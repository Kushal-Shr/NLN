import { NextRequest, NextResponse } from "next/server";
import { generateHubWisdom } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const feelings: string[] = body.feelings ?? [];
    const query: string = body.query ?? "";

    if (feelings.length === 0 && !query.trim()) {
      return NextResponse.json(
        { error: "Please select a feeling or enter a search query." },
        { status: 400 }
      );
    }

    const result = await generateHubWisdom(feelings, query);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate wisdom. Please try again." },
      { status: 500 }
    );
  }
}
