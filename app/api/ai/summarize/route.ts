import { NextRequest, NextResponse } from "next/server";
import { getSummarizeModel } from "@/lib/ai/gemini";

const STUB_BULLETS = [
  "This experience is more common than you think.",
  "Small daily practices can shift the inner landscape.",
  "Trusted sources confirm that healing is possible.",
];

export async function POST(request: NextRequest) {
  try {
    const { text } = (await request.json()) as { text?: string };

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "No text provided to summarize." },
        { status: 400 },
      );
    }

    const model = getSummarizeModel();

    if (!model) {
      return NextResponse.json({ bullets: STUB_BULLETS });
    }

    const prompt = `Summarize the following text into exactly 3 bullet points. Each bullet must be under 15 words. Keep the tone supportive and nature-focused.\n\n---\n${text}`;

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    if (Array.isArray(parsed) && parsed.length >= 3) {
      return NextResponse.json({ bullets: parsed.slice(0, 3) });
    }

    return NextResponse.json({ bullets: STUB_BULLETS });
  } catch (err) {
    console.error("Summarize API error:", err);
    return NextResponse.json({ bullets: STUB_BULLETS });
  }
}
