
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

export const findChordsWithAI = async (query: string): Promise<Song | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `PESQUISE NA INTERNET e forneça a cifra COMPLETA da música: "${query}". 
  REGRAS DE FORMATAÇÃO (ESTILO CIFRA CLUB):
  1. Forneça a LETRA INTEGRAL com acordes entre colchetes exatamente acima da sílaba correta, como [C], [G], etc.
  2. DEVE incluir a INTRODUÇÃO detalhada com TABLATURA (ex: e|---2---3---|).
  3. Inclua variações de dedilhado ou batida se disponíveis.
  4. Identifique o tom original, a afinação (ex: Padrão) e a dificuldade.
  5. Use o Google Search para garantir que a cifra é a versão "Verificada" mais popular.
  6. Retorne os dados estritamente em JSON.`;

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
            content: { type: Type.STRING, description: "Cifra, letra, tablaturas e orientações de ritmo" },
            genre: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ['Fácil', 'Médio', 'Difícil'] },
            originalKey: { type: Type.STRING },
            tuning: { type: Type.STRING }
          },
          required: ["title", "artist", "content", "genre", "difficulty"]
        }
      }
    });

    const text = response.text;
    const result = JSON.parse(text);
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
