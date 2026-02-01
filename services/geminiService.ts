
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

export const findChordsWithAI = async (query: string): Promise<Song | null> => {
  // Inicialização dentro da função para garantir que o processo de build já tenha injetado a chave
  const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) || '' });
  
  const prompt = `Encontre a cifra da música: "${query}". 
  Retorne os detalhes em formato JSON. A cifra (content) deve ter os acordes entre colchetes, exemplo: "[C] Letra [G]".
  Seja preciso nos acordes.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            content: { type: Type.STRING },
            genre: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ['Fácil', 'Médio', 'Difícil'] }
          },
          required: ["title", "artist", "content", "genre", "difficulty"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...result
    };
  } catch (error) {
    console.error("Erro ao buscar cifra com IA:", error);
    return null;
  }
};
