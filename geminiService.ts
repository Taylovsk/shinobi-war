import { GoogleGenAI } from "@google/genai";

const getApiKey = () => import.meta.env.VITE_API_KEY;

export const generateLoreOrQuest = async (prompt: string): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
    console.warn("Gemini API Key is missing. Please check Vercel Environment Variables (VITE_API_KEY).");
    return "⚠️ O Oráculo está dormindo. (Configure a VITE_API_KEY no Vercel para acordá-lo).";
  }

  try {

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
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
    return "Uma interferência de chakra impediu a comunicação. O Oráculo está indisponível no momento.";
  }
};
