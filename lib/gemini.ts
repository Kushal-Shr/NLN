export type GeminiResponse = {
  wisdom: string;
  practice: string;
  metaphor: string;
};

export type JournalSpark = {
  prompt: string;
};

export type JournalInsight = {
  nugget: string;
};

export async function generateHubWisdom(
  feelings: string[],
  query: string
): Promise<GeminiResponse> {
  // Replace with actual Gemini SDK call, e.g.:
  // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  // const result = await model.generateContent(prompt);

  const feelingsList = feelings.length > 0 ? feelings.join(", ") : "general calm";

  return {
    wisdom: `When the ${feelingsList} visits, remember: the lantern inside you doesn't need perfect weather to shine. Even in the monsoon, your light refracts through every raindrop. Searching for "${query}" is itself an act of courage.`,
    practice: `Try the 4-7-8 breathing: inhale for 4 counts, hold for 7, exhale for 8. Repeat 3 times. Think of it as refueling the lantern — each breath fans the flame a little brighter.`,
    metaphor: `You are navigating the monsoon. The rain is not punishment — it is the world watering the seeds you've already planted.`,
  };
}

const SPARK_POOL = [
  "What duty brought you peace today?",
  "Where did you see strength in nature?",
  "Name one small act of kindness you witnessed.",
  "What sound made you feel safe recently?",
  "Describe a moment where silence was comforting.",
  "What part of your heritage gave you courage today?",
  "Write about a meal that felt like home.",
  "When did you last feel the weight lift, even briefly?",
];

export async function generateJournalSpark(): Promise<JournalSpark> {
  // Replace with actual Gemini call for persona-based prompts.
  const prompt = SPARK_POOL[Math.floor(Math.random() * SPARK_POOL.length)];
  return { prompt };
}

export async function generateJournalInsight(
  entry: string
): Promise<JournalInsight> {
  // Replace with actual Gemini summarisation call.
  const words = entry.trim().split(/\s+/).length;
  if (words < 5) {
    return { nugget: "Write a little more and the wisdom will surface." };
  }
  return {
    nugget: `From your reflection: the thread of resilience runs through every sentence. Your words carry the quiet strength of someone who is already healing — even when it doesn't feel that way.`,
  };
}
