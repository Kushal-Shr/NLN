export type GeminiResponse = {
  wisdom: string;
  practice: string;
  metaphor: string;
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
