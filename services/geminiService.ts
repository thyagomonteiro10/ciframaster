
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

export const findChordsWithAI = async (query: string): Promise<Song | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `PESQUISE NA INTERNET e forneça a cifra COMPLETA da música: "${query}". 
  REGRAS:
  1. Forneça a LETRA INTEGRAL com acordes entre colchetes como [C], [G], etc.
  2. Inclua INTRODUÇÕES com TABLATURAS se existirem na versão original.
  3. Identifique o tom original e o gênero musical exato.
  4. Use o Google Search para garantir que a cifra é a mais precisa disponível atualmente.
  5. Retorne os dados estritamente em JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            content: { type: Type.STRING, description: "Cifra e letra completa" },
            genre: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ['Fácil', 'Médio', 'Difícil'] },
            originalKey: { type: Type.STRING }
          },
          required: ["title", "artist", "content", "genre", "difficulty"]
        }
      }
    });

    const result = JSON.parse(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      uri: chunk.web?.uri,
      title: chunk.web?.title
    })).filter((s: any) => s.uri) || [];

    return {
      id: `web-${Math.random().toString(36).substr(2, 9)}`,
      ...result,
      sources
    };
  } catch (error) {
    console.error("Erro na pesquisa de cifra online:", error);
    return null;
  }
};
