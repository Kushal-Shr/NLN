import { NextRequest, NextResponse } from "next/server";
import { getLibraryModel } from "@/lib/ai/gemini";
import type { LibraryResult } from "@/lib/types";

const STUB_RESULTS: Record<string, LibraryResult> = {
  focus: {
    title: "Sharpening the Inner Lens",
    description:
      "When the mind scatters across a hundred directions at once, it is not a flaw — it is a signal that your inner compass is searching for true north. The scattered wind does not mean the sky is broken; it means there is energy looking for the right channel.\n\nThis experience is far more common than anyone admits. From students to elders, the struggle to hold a single thread of attention is universal. The good news: focus is a muscle, not a gift. It can be trained with patience, ritual, and the right techniques.",
    guidance: [
      "Try the 5-4-3-2-1 grounding: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste. This anchors the scattered wind.",
      "Set a sacred 25 minutes — work on one thing only, then rest for 5. This rhythm mirrors the tide: focused flow, gentle retreat.",
      "Place your phone in another room during deep work. The absence of the screen is itself a practice in reclaiming attention.",
    ],
    citations: [
      { sourceName: "American Psychological Association", url: "https://www.apa.org/topics/attention" },
      { sourceName: "Harvard Health Publishing", url: "https://www.health.harvard.edu/mind-and-mood/tips-to-improve-concentration" },
      { sourceName: "World Health Organization", url: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response" },
    ],
  },
  rest: {
    title: "The Art of Sacred Rest",
    description:
      "Rest is not laziness — it is the root system that feeds every branch of your life. When the body and mind resist rest, it is often because the world has convinced you that stillness equals failure. But every monsoon gives way to a dry season, and every harvest requires a fallow field.\n\nMillions of people lie awake not because they are weak, but because they carry the weight of the day into the night. Learning to set that weight down — even for an hour — is one of the most powerful acts of resilience there is.",
    guidance: [
      "Try the 4-7-8 breathing before bed: inhale for 4, hold for 7, exhale for 8. Think of it as dimming the lantern slowly instead of blowing it out.",
      "Write a release list before sleep — three things you are letting go of tonight. They will be there tomorrow if you need them.",
      "Lower screen brightness 1 hour before bed and switch to warm tones. Let the evening light signal your body that the day is done.",
    ],
    citations: [
      { sourceName: "National Sleep Foundation", url: "https://www.sleepfoundation.org/sleep-hygiene" },
      { sourceName: "Harvard Medical School", url: "https://healthysleep.med.harvard.edu/healthy" },
      { sourceName: "World Health Organization", url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity" },
    ],
  },
  connection: {
    title: "Rebuilding the Circle",
    description:
      "Human connection is not a luxury — it is the fireside around which every culture has gathered since the beginning. When the circle feels broken, when loneliness settles in like fog, it does not mean you are unwanted. It means the bridges need tending, and sometimes the first plank is simply saying: I am here.\n\nResearch across every culture confirms that belonging is as vital as food and shelter. Even one genuine connection — one person who sees you — can shift the entire landscape of your inner world.",
    guidance: [
      "Send one message today to someone you have not spoken to in a while. Not to catch up — just to say thinking of you. The door opens with the smallest key.",
      "Join a community circle or group session — even as a listener. Presence is participation.",
      "Practice the two-minute bridge: spend 2 minutes fully listening to someone without planning your response. Connection lives in attention.",
    ],
    citations: [
      { sourceName: "American Psychological Association", url: "https://www.apa.org/topics/loneliness" },
      { sourceName: "Harvard Study of Adult Development", url: "https://www.adultdevelopmentstudy.org" },
      { sourceName: "World Health Organization", url: "https://www.who.int/teams/social-determinants-of-health" },
    ],
  },
};

const DEFAULT_STUB: LibraryResult = {
  title: "The Wisdom You Seek",
  description:
    "Every question you bring to this library is a lantern in the dark — the act of searching is itself a step toward clarity. What you are looking for may not have a single answer, but it has a path, and that path begins with the curiosity you have already shown.\n\nThe Library is designed to meet you where you are. Whether you are seeking understanding, a practical technique, or simply the reassurance that you are not alone — the shelves hold something for you.",
  guidance: [
    "Start with one small action today related to what you searched. Progress is built in single steps, not leaps.",
    "Write down what you have learned and revisit it in 3 days. Knowledge deepens with reflection.",
    "Share what resonates with someone you trust. Wisdom grows when it is spoken aloud.",
  ],
  citations: [
    { sourceName: "Greater Good Science Center — UC Berkeley", url: "https://greatergood.berkeley.edu" },
    { sourceName: "National Institute of Mental Health", url: "https://www.nimh.nih.gov/health" },
    { sourceName: "World Health Organization", url: "https://www.who.int/health-topics/mental-health" },
  ],
};

function getStubResult(query: string): LibraryResult {
  const lower = query.toLowerCase();
  for (const [key, result] of Object.entries(STUB_RESULTS)) {
    if (lower.includes(key)) return result;
  }
  return { ...DEFAULT_STUB, title: query };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userQuery: string = body.query ?? "";

    if (!userQuery.trim()) {
      return NextResponse.json(
        { success: false, error: "Type a topic to search the library." },
        { status: 400 }
      );
    }

    let result: LibraryResult;

    const model = getLibraryModel();
    if (model) {
      try {
        const prompt = `The user searched for: "${userQuery}"\n\nGenerate a comprehensive, research-backed library entry for this topic.`;
        const response = await model.generateContent(prompt);
        result = JSON.parse(response.response.text()) as LibraryResult;

        if (!result.guidance || result.guidance.length < 3) {
          result.guidance = [...(result.guidance || []), ...DEFAULT_STUB.guidance].slice(0, 3);
        }
        if (!result.citations || result.citations.length === 0) {
          result.citations = DEFAULT_STUB.citations;
        }
      } catch (aiError) {
        console.error("Gemini generation failed, using stub:", aiError);
        result = getStubResult(userQuery);
      }
    } else {
      result = getStubResult(userQuery);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Library API error:", error);
    return NextResponse.json(
      { success: false, error: "The Library could not process your query. Please try again." },
      { status: 500 }
    );
  }
}
