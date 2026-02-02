
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

export const findChordsWithAI = async (query: string): Promise<Song | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Instrução de sistema mais rigorosa para garantir qualidade técnica musical
  const systemInstruction = `Você é o especialista em música do Cifra Master. 
  Sua tarefa é encontrar a cifra mais atualizada e precisa para a música solicitada.
  REGRAS CRÍTICAS:
  1. Use o Google Search para encontrar versões "Verificadas".
  2. Mantenha os acordes [ENTRE COLCHETES] exatamente acima das letras.
  3. Inclua a introdução com tablatura e indicações de ritmo/batida.
  4. Identifique o tom e a dificuldade.
  5. Retorne APENAS um objeto JSON válido, sem explicações fora do JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Busque a cifra completa da música: "${query}"`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            content: { type: Type.STRING, description: "Cifra formatada com [Acordes] e Tablaturas" },
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
    // Limpeza simples caso a IA retorne markdown em volta do JSON
    const cleanJson = text.replace(/^```json/, '').replace(/```$/, '').trim();
    const result = JSON.parse(cleanJson);
    
    // Extração das fontes de grounding (links reais da internet)
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
