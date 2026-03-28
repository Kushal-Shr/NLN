import { NextRequest, NextResponse } from "next/server";
import { generateJournalInsight } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entry: string = body.entry ?? "";

    if (!entry.trim()) {
      return NextResponse.json(
        { error: "Write something first — wisdom needs raw material." },
        { status: 400 }
      );
    }

    const result = await generateJournalInsight(entry);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate insight." },
      { status: 500 }
    );
  }
}
