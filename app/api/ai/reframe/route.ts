import { NextRequest, NextResponse } from "next/server";
import { getReframeModel } from "@/lib/ai/gemini";
import { db } from "@/lib/db";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { ReframePayload, ReframeResult } from "@/lib/types";

const STUB_RESULTS: Record<string, ReframeResult> = {
  spiritual: {
    insight:
      "The weight you carry is not your soul's burden — it is the residue of a world that forgot its Dharma. Your spirit is not broken; it is being refined, the way fire purifies gold.",
    practice:
      "Place your hand over your heart and repeat: 'I am the keeper of an ancient flame. This storm is not my story — it is just today's weather.'",
    metaphor:
      "You are gold in the fire — the heat does not destroy you, it reveals what was always precious.",
  },
  nature: {
    insight:
      "What feels like the fog is simply the forest resting between seasons. Even the oldest oak sheds its leaves before it grows stronger. Your roots are deeper than the storm above.",
    practice:
      "Step outside. Place both feet on the earth. Breathe in for 4 counts, hold for 4, and exhale for 6. Feel the ground hold you the way it holds every river.",
    metaphor:
      "You are the river after the monsoon — wider, deeper, carrying more than before, but still flowing.",
  },
  practical: {
    insight:
      "The mind's architecture sometimes needs reinforcement, not demolition. What feels like collapse is often the foundation shifting to bear a new weight. You are restructuring, not failing.",
    practice:
      "Write down three things within your control right now. Circle one. Begin there. The blueprint of recovery is built one beam at a time.",
    metaphor:
      "You are the architect standing in the scaffolding — the building is unfinished, not ruined.",
  },
  community: {
    insight:
      "No elder in the village ever healed alone. The heaviness you feel is not weakness — it is the echo of carrying a load meant for many hands. The circle is waiting for you to step in.",
    practice:
      "Reach out to one person today — not to solve anything, just to say: 'I'm here, and I see you.' The fireside begins with a single voice.",
    metaphor:
      "You are the voice that breaks the silence around the fire — and in that breaking, everyone breathes easier.",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body: ReframePayload = await request.json();
    const { rawInput, persona, userId } = body;

    if (!rawInput?.trim()) {
      return NextResponse.json(
        { success: false, error: "Share what you're carrying — even one sentence is enough." },
        { status: 400 }
      );
    }

    const validPersonas = ["spiritual", "nature", "practical", "community"];
    const safePersona = validPersonas.includes(persona) ? persona : "spiritual";

    let result: ReframeResult;

    const model = getReframeModel();
    if (model) {
      const prompt = `User's persona tone: ${safePersona}\n\nThe user shared:\n"${rawInput}"\n\nPerform Cultural Alchemy. Reframe this into a Wisdom Insight matching their persona tone. Respond in valid JSON only.`;

      const response = await model.generateContent(prompt);
      result = JSON.parse(response.response.text()) as ReframeResult;
    } else {
      result = STUB_RESULTS[safePersona] || STUB_RESULTS.spiritual;
    }

    if (userId) {
      try {
        await addDoc(collection(db, "users", userId, "insights"), {
          type: "reframe",
          input: rawInput,
          persona: safePersona,
          result,
          createdAt: serverTimestamp(),
        });
      } catch (firestoreError) {
        console.error("Failed to save insight to Firestore:", firestoreError);
      }
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Reframe API error:", error);
    return NextResponse.json(
      { success: false, error: "The Scribe could not process your words. Please try again." },
      { status: 500 }
    );
  }
}
