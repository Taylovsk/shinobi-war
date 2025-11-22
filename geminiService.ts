import { GoogleGenAI } from "@google/genai";

// Recupera a chave de ambiente do Vite
const getApiKey = () => import.meta.env.VITE_API_KEY;

export const generateLoreOrQuest = async (prompt: string): Promise<string> => {
  const apiKey = getApiKey();

  // Verificação de segurança para evitar crash se a chave não estiver configurada
  if (!apiKey || apiKey.includes('YOUR_API_KEY')) {
    console.warn("Gemini API Key is missing. Please check Vercel Environment Variables (VITE_API_KEY).");
    return "⚠️ O Oráculo está dormindo. (Configure a VITE_API_KEY no Vercel para acordá-lo).";
  }

  try {
    // Inicializa o cliente apenas quando necessário (Lazy initialization)
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
    console.error("Erro ao consultar o oráculo:", error);
    return "Uma interferência de chakra impediu a comunicação. O Oráculo está indisponível no momento.";
  }
};
