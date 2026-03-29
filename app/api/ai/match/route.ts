import { NextRequest, NextResponse } from "next/server";
import { getMatchModel } from "@/lib/ai/gemini";
import { db } from "@/lib/db";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { MatchPayload, MatchResult, MentorTier } from "@/lib/types";

function classifyFallback(input: string): MatchResult {
  const lower = input.toLowerCase();

  const crisisSignals = ["harm", "hurt", "end it", "can't go on", "hopeless", "dying", "suicide", "kill"];
  const culturalSignals = ["family", "parents", "culture", "honour", "honor", "shame", "tradition", "pressure", "expectations", "marriage"];
  const groupSignals = ["alone", "lonely", "listen", "group", "community", "circle", "belong"];

  if (crisisSignals.some((s) => lower.includes(s))) {
    return {
      recommendedTier: "professional" as MentorTier,
      matchCertainty: 0.95,
      culturallySpecificReason:
        "The weight you describe sounds like it needs a steady hand — someone trained to sit with the deepest storms. A Professional Guide can hold that space with you safely.",
    };
  }

  if (culturalSignals.some((s) => lower.includes(s))) {
    return {
      recommendedTier: "interpreter" as MentorTier,
      matchCertainty: 0.82,
      culturallySpecificReason:
        "Navigating the space between two worlds — the expectations of home and the reality of here — calls for someone who speaks both languages. A Cultural Interpreter walks that bridge daily.",
    };
  }

  if (groupSignals.some((s) => lower.includes(s))) {
    return {
      recommendedTier: "moderator" as MentorTier,
      matchCertainty: 0.75,
      culturallySpecificReason:
        "Sometimes the fire of healing burns brightest in a circle. A Moderator can guide you into a safe group space where you can listen, be witnessed, and find your voice when ready.",
    };
  }

  return {
    recommendedTier: "peer" as MentorTier,
    matchCertainty: 0.7,
    culturallySpecificReason:
      "What you're carrying sounds like it would benefit from someone who has walked a similar path. A Peer Guide has lived experience and speaks from the heart, not a textbook.",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: MatchPayload = await request.json();
    const { userInput, userId } = body;

    if (!userInput?.trim()) {
      return NextResponse.json(
        { success: false, error: "Tell us a little about what you need — even a few words help." },
        { status: 400 }
      );
    }

    let result: MatchResult;

    const model = getMatchModel();
    if (model) {
      const prompt = `The user said:\n"${userInput}"\n\nAnalyze their expressed need and recommend the most appropriate mentor tier. Consider cultural context, severity, and the nature of their request. Respond in valid JSON only.`;

      const response = await model.generateContent(prompt);
      result = JSON.parse(response.response.text()) as MatchResult;

      const validTiers: MentorTier[] = ["professional", "peer", "interpreter", "moderator"];
      if (!validTiers.includes(result.recommendedTier)) {
        result.recommendedTier = "peer";
      }
      result.matchCertainty = Math.min(1, Math.max(0, result.matchCertainty));
    } else {
      result = classifyFallback(userInput);
    }

    if (userId) {
      try {
        await addDoc(collection(db, "users", userId, "insights"), {
          type: "match",
          input: userInput,
          result,
          createdAt: serverTimestamp(),
        });
      } catch (firestoreError) {
        console.error("Failed to save match to Firestore:", firestoreError);
      }
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Match API error:", error);
    return NextResponse.json(
      { success: false, error: "The Oracle could not find a path. Please try again." },
      { status: 500 }
    );
  }
}
