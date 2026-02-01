
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

export const findChordsWithAI = async (query: string): Promise<Song | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Pesquise na internet e gere a cifra COMPLETA e ATUALIZADA da música: "${query}". 
  Regras:
  1. Use o Google Search para encontrar a versão mais fiel e completa.
  2. A cifra deve ter a LETRA INTEGRAL com acordes entre colchetes, ex: "[C] Letra".
  3. Identifique o tom original e a dificuldade correta.
  4. Retorne APENAS o JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Modelo Pro para melhor raciocínio e busca
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            content: { type: Type.STRING },
            genre: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ['Fácil', 'Médio', 'Difícil'] },
            originalKey: { type: Type.STRING },
            tuning: { type: Type.STRING }
          },
          required: ["title", "artist", "content", "genre", "difficulty"]
        }
      }
    });

    const result = JSON.parse(response.text);
    
    // Extrair fontes da pesquisa
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      uri: chunk.web?.uri,
      title: chunk.web?.title
    })).filter((s: any) => s.uri) || [];

    return {
      id: Math.random().toString(36).substr(2, 9),
      ...result,
      sources
    };
  } catch (error) {
    console.error("Erro na busca conectada:", error);
    return null;
  }
};
