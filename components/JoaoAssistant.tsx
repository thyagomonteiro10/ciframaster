
import { Send, X, Music, Guitar, Link as LinkIcon, Bot, Globe } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ExtendedSong } from '../constants';

interface Message {
  role: 'user' | 'joao';
  text: string;
  songData?: ExtendedSong;
  sources?: { uri: string; title: string }[];
}

interface JoaoAssistantProps {
  onSongFound: (song: ExtendedSong) => void;
  isOpen: boolean;
  onClose: () => void;
}

const JoaoAssistant: React.FC<JoaoAssistantProps> = ({ onSongFound, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'joao', text: 'Fala, mestre! Tô online e pronto pra buscar qualquer cifra do mundo pra você. É só mandar o nome da música ou do artista!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const askJoao = async (query: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `Você é o João, o mestre das cifras. Você tem acesso à internet em tempo real. 
          Sua missão é buscar a cifra mais completa (letra integral + acordes [C] + tablaturas) de qualquer música solicitada. 
          Sempre retorne a música completa, nunca resuma. Use linguagem de músico camarada.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: { type: Type.STRING, description: "Sua fala amigável" },
              songData: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  artist: { type: Type.STRING },
                  content: { type: Type.STRING, description: "Cifra e letra completa com acordes em colchetes" },
                  genre: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ['Fácil', 'Médio', 'Difícil'] },
                  originalKey: { type: Type.STRING }
                }
              }
            },
            required: ["message"]
          }
        }
      });

      const data = JSON.parse(response.text);
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title
      })).filter((s: any) => s.uri) || [];
      
      const newSong = data.songData ? {
        id: `web-${Math.random().toString(36).substr(2, 9)}`,
        ...data.songData,
        sources
      } : undefined;

      setMessages(prev => [...prev, { 
        role: 'joao', 
        text: data.message, 
        songData: newSong,
        sources
      }]);

      if (newSong) onSongFound(newSong);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'joao', text: 'Eita, mestre, deu um ruído na busca. Tenta de novo?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-8 z-[100] flex flex-col w-full md:w-[420px] h-full md:h-[650px] bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-purple-100">
      <div className="bg-purple-900 p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center border-2 border-white shadow-lg rotate-2">
              <Guitar className="w-8 h-8 text-purple-900" />
            </div>
            <div className="absolute -top-1 -right-1 bg-green-500 p-1 rounded-full border-2 border-purple-900 animate-pulse">
              <Globe className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-white font-black text-xl tracking-tight">João Web</h3>
            <p className="text-purple-300 text-[10px] font-bold uppercase tracking-widest">Cifras da Internet 24h</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-purple-200 hover:text-white transition-colors">
          <X className="w-7 h-7" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-3xl text-sm font-medium shadow-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border rounded-tl-none'
            }`}>
              {msg.text}
              
              {msg.songData && (
                <div className="mt-4 pt-3 border-t border-purple-50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Music className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-[11px] font-black uppercase truncate text-purple-900">{msg.songData.title}</span>
                  </div>
                  <button onClick={() => onSongFound(msg.songData!)} className="text-[10px] font-black bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-200">
                    VER CIFRA
                  </button>
                </div>
              )}

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.slice(0, 2).map((s, idx) => (
                      <a key={idx} href={s.uri} target="_blank" rel="noreferrer" className="text-[9px] text-purple-400 hover:underline flex items-center gap-1">
                        <LinkIcon className="w-2 h-2" /> {s.title || 'Ver fonte'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold animate-pulse">
            <Globe className="w-3 h-3 animate-spin" />
            <span>Pesquisando na internet...</span>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-100">
        <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) askJoao(input); }} className="relative">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Qual música vamos tirar hoje?"
            className="w-full pl-6 pr-14 py-4 bg-gray-100 rounded-full text-sm font-bold outline-none focus:ring-2 focus:ring-purple-200"
          />
          <button type="submit" disabled={isTyping} className="absolute right-2 top-2 w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoaoAssistant;
