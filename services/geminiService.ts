import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateDescription = async (projectName: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key not configured for Gemini.");
  }

  try {
    const prompt = `Write a professional and concise service description for a project titled: "${projectName}". The description should be suitable for a project management system.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const text = response.text;
    if (!text) {
        throw new Error("Received an empty response from the AI.");
    }
    return text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    throw new Error("Failed to communicate with the AI service.");
  }
};
