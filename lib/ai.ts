export type AiResponse = {
  text: string;
};

export async function generateAiResponse(prompt: string): Promise<AiResponse> {
  // Placeholder for AI provider integration.
  return {
    text: `Stub response for: ${prompt}`,
  };
}
