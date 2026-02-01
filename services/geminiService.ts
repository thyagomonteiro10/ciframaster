
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

export const findChordsWithAI = async (query: string): Promise<Song | null> => {
  const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) || '' });
  
  const prompt = `Gere a cifra COMPLETA da música: "${query}". 
  Regras cruciais:
  1. A cifra (content) deve conter a LETRA INTEGRAL da música, do início ao fim.
  2. Insira os acordes entre colchetes exatamente acima ou antes das sílabas onde a troca ocorre, exemplo: "[C] Letra [G]".
  3. Inclua seções como [Intro], [Verso], [Refrão], [Ponte] e [Final].
  4. Seja extremamente preciso na harmonia.
  5. Se houver um solo, represente-o com tablaturas simples ou indicação de acordes.`;

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
            difficulty: { type: Type.STRING, enum: ['Fácil', 'Médio', 'Difícil'] },
            originalKey: { type: Type.STRING },
            tuning: { type: Type.STRING }
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
    console.error("Erro ao buscar cifra completa com IA:", error);
    return null;
  }
};
