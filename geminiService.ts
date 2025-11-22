import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client directly with the process.env.API_KEY
// The vite.config.ts file handles the replacement of this variable during the build process
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLoreOrQuest = async (prompt: string): Promise<string> => {
  // Safety check for debugging deployment issues
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing. Please check Vercel Environment Variables.");
    return "O oráculo está silenciado temporariamente (Chave de API não configurada).";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Você é um Mestre de RPG (Dungeon Master) experiente no universo de Naruto (Shinobi World). Seu tom é épico, misterioso e motivador. Você deve responder em Português do Brasil. Seja conciso, use termos como 'Chakra', 'Jutsu', 'Vila Oculta'. Evite quebrar a imersão.",
        temperature: 0.8,
        maxOutputTokens: 300,
      }
    });

    return response.text || "O pergaminho está em branco...";
  } catch (error) {
    console.error("Oracle service unavailable:", error);
    return "Uma interferência de chakra impediu a comunicação. Tente novamente.";
  }
};
