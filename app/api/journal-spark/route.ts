import { NextResponse } from "next/server";
import { generateJournalSpark } from "@/lib/gemini";

export async function GET() {
  try {
    const result = await generateJournalSpark();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate spark." },
      { status: 500 }
    );
  }
}
