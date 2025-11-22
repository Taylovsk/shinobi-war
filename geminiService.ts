import { GoogleGenAI } from "@google/genai";

export const generateLoreOrQuest = async (prompt: string): Promise<string> => {
  // Recupera a chave de ambiente do Vite de forma segura
  const apiKey = import.meta.env.VITE_API_KEY;

  // Verificação de segurança para evitar crash se a chave não estiver configurada ou for padrão
  if (!apiKey || typeof apiKey !== 'string' || apiKey.includes('YOUR_API_KEY') || apiKey.length < 10) {
    console.warn("⚠️ Shinobi War Alert: VITE_API_KEY não encontrada ou inválida nas variáveis de ambiente.");
    return "🚫 O selo do Oráculo está quebrado. (Configure a VITE_API_KEY no Vercel para restaurar a conexão).";
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
    return "🌀 Uma interferência massiva de chakra impediu a comunicação. Tente novamente mais tarde.";
  }
};
