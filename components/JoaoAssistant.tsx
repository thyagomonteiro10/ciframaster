
import { Send, X, Sparkles, Music, Guitar, Link as LinkIcon, Bot } from 'lucide-react';
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
    { role: 'joao', text: 'Fala, mestre! Tô conectado na rede. Qual cifra você quer que eu busque agora?' }
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
          systemInstruction: `Você é o João, assistente do CifraMaster. 
          Você tem acesso à internet. Sempre que pedirem uma música, pesquise no Google Search para garantir que a cifra seja a mais completa e precisa possível. 
          Sua resposta deve ser amigável e musical. Forneça o JSON com songData completo (letra + acordes [C]).`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: { type: Type.STRING },
              songData: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  artist: { type: Type.STRING },
                  content: { type: Type.STRING },
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
        id: Math.random().toString(36).substr(2, 9),
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
      setMessages(prev => [...prev, { role: 'joao', text: 'Tive um problema na conexão com o servidor de cifras. Bora tentar de novo?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-8 z-[100] flex flex-col w-full md:w-[400px] h-full md:h-[600px] bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-purple-100">
      <div className="bg-purple-900 p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center rotate-3 border-2 border-white">
            <Guitar className="w-7 h-7 text-purple-900" />
          </div>
          <div>
            <h3 className="text-white font-black text-lg">João Web-Search</h3>
            <p className="text-purple-300 text-[9px] font-bold uppercase tracking-widest">Online via Google</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-purple-200 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium ${
              msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border rounded-tl-none'
            }`}>
              {msg.text}
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 mb-1 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> FONTES DA INTERNET:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.slice(0, 2).map((s, idx) => (
                      <a key={idx} href={s.uri} target="_blank" rel="noreferrer" className="text-[9px] text-purple-500 hover:underline truncate max-w-[150px]">
                        {s.title || 'Ver fonte'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && <div className="p-4 bg-white rounded-3xl animate-pulse text-xs text-gray-400">João está pesquisando na web...</div>}
      </div>

      <div className="p-6 bg-white border-t border-gray-100">
        <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) askJoao(input); }} className="relative">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Qual cifra buscamos na internet?"
            className="w-full pl-6 pr-14 py-4 bg-gray-100 rounded-full text-sm font-bold outline-none"
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
