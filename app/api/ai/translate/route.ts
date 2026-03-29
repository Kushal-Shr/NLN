import { NextRequest, NextResponse } from "next/server";
import { getTranslateModel, getBatchTranslateModel } from "@/lib/ai/gemini";

const LANGUAGE_NAMES: Record<string, string> = {
  es: "Spanish",
  fr: "French",
  ne: "Nepali",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetLanguage } = body;

    const langName = LANGUAGE_NAMES[targetLanguage];
    if (!langName) {
      return NextResponse.json(
        { success: false, error: `Unsupported language: ${targetLanguage}` },
        { status: 400 }
      );
    }

    // ── Batch mode (JSON-to-JSON) ───────────────────────────────────
    if (body.batch && typeof body.batch === "object") {
      const batch = body.batch as Record<string, string>;

      if (Object.keys(batch).length === 0) {
        return NextResponse.json({ success: true, translated: {} });
      }

      const model = getBatchTranslateModel();
      if (!model) {
        return NextResponse.json({ success: true, translated: batch });
      }

      const prompt = `Translate the values in this JSON object into ${langName} while keeping the keys identical. Return ONLY the valid JSON object.\n\n${JSON.stringify(batch)}`;
      const response = await model.generateContent(prompt);
      const raw = response.response.text().trim();

      try {
        const translated = JSON.parse(raw) as Record<string, string>;
        return NextResponse.json({ success: true, translated });
      } catch {
        console.error("Batch translate JSON parse failed:", raw.slice(0, 200));
        return NextResponse.json({ success: true, translated: batch });
      }
    }

    // ── Single-text mode (backward compat for AutoTranslate) ────────
    const { text } = body;
    if (!text) {
      return NextResponse.json(
        { success: false, error: "Missing text or batch." },
        { status: 400 }
      );
    }

    const model = getTranslateModel();
    if (!model) {
      return NextResponse.json({ success: true, translated: text });
    }

    const prompt = `Translate the following UI text into ${langName}. Return ONLY the translated string with no extra text: ${text}`;
    const response = await model.generateContent(prompt);
    const translated = response.response.text().trim();

    return NextResponse.json({ success: true, translated });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { success: false, error: "Translation failed." },
      { status: 500 }
    );
  }
}
