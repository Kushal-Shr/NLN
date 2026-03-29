import { NextRequest, NextResponse } from "next/server";
import { getRoadmapModel } from "@/lib/ai/gemini";

interface CalendarEvent {
  summary: string;
  start: string;
  end: string;
}

interface RoadmapRequest {
  energyLevel: number;
  focusLevel: number;
  calendarEvents: CalendarEvent[];
}

const STUB_ROADMAP = [
  { time: "9:00 AM", title: "Morning Grounding", duration: "15 min", why: "Starting the day anchored reduces the weight of everything that follows.", codedIntention: "Feel your feet on the ground and take three slow breaths.", isCalendarEvent: false, isCurrent: false },
  { time: "9:30 AM", title: "Deep Work Block", duration: "90 min", why: "Your focus peaks in the morning — protect this window for what matters most.", codedIntention: "Before beginning, set one clear intention for this session.", isCalendarEvent: false, isCurrent: false },
  { time: "11:00 AM", title: "Movement Break", duration: "20 min", why: "A short walk resets your nervous system and boosts clarity.", codedIntention: "Notice three textures around you as you move.", isCalendarEvent: false, isCurrent: false },
  { time: "11:30 AM", title: "Creative Exploration", duration: "60 min", why: "After movement, your mind is primed for lateral thinking.", codedIntention: "Let curiosity lead — no outcome needed.", isCalendarEvent: false, isCurrent: false },
  { time: "1:00 PM", title: "Nourishment & Rest", duration: "45 min", why: "Eating mindfully fuels the second half of your day.", codedIntention: "Put your screen away for the first five bites.", isCalendarEvent: false, isCurrent: false },
  { time: "2:00 PM", title: "Collaborative Session", duration: "60 min", why: "Afternoon energy suits connection and shared thinking.", codedIntention: "Listen fully before forming your response.", isCalendarEvent: false, isCurrent: false },
  { time: "3:30 PM", title: "Reflection & Planning", duration: "30 min", why: "Closing the day with intention prevents tomorrow from feeling heavy.", codedIntention: "Write down one thing that went well today.", isCalendarEvent: false, isCurrent: false },
];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RoadmapRequest;

    const { energyLevel, focusLevel, calendarEvents } = body;

    if (
      typeof energyLevel !== "number" ||
      typeof focusLevel !== "number" ||
      !Array.isArray(calendarEvents)
    ) {
      return NextResponse.json(
        { error: "energyLevel (number), focusLevel (number), and calendarEvents (array) are required." },
        { status: 400 },
      );
    }

    const model = getRoadmapModel();

    if (!model) {
      return NextResponse.json({ roadmap: STUB_ROADMAP });
    }

    const prompt = `Generate my 24-hour roadmap.

Energy Level: ${energyLevel}/10
Focus Level: ${focusLevel}/10

Calendar Events:
${
  calendarEvents.length > 0
    ? calendarEvents
        .map((e) => `- "${e.summary}" from ${e.start} to ${e.end}`)
        .join("\n")
    : "No calendar events scheduled."
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const roadmap = JSON.parse(text);

    if (!Array.isArray(roadmap)) {
      return NextResponse.json({ roadmap: STUB_ROADMAP });
    }

    return NextResponse.json({ roadmap });
  } catch (err) {
    console.error("Roadmap generation error:", err);
    return NextResponse.json({ roadmap: STUB_ROADMAP });
  }
}
