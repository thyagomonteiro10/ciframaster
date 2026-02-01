
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
    { role: 'joao', text: 'Fala, mestre! Tô conectado ao banco do Cifra Master via IA. Pode pedir qualquer música que eu encontro a cifra oficial e os diagramas pra você!' }
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
          systemInstruction: `Você é o João do Cifra Master. Você busca as cifras mais precisas na internet. 
          Retorne sempre a letra integral e os acordes [C] de forma correta. 
          Sua personalidade é de um instrutor de música gente boa.`,
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
      setMessages(prev => [...prev, { role: 'joao', text: 'Eita, mestre, perdi o sinal. Tenta perguntar de novo?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-8 z-[100] flex flex-col w-full md:w-[380px] h-full md:h-[600px] bg-white md:rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="bg-[#1c1c1c] p-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1c1c1c] border border-gray-800 rounded-xl flex items-center justify-center">
            <Guitar className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-black text-sm tracking-tight">João Online</h3>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
               <p className="text-[#38cc63] text-[9px] font-bold uppercase tracking-widest">Pronto para buscar</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] font-medium leading-relaxed ${
              msg.role === 'user' ? 'bg-[#38cc63] text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm'
            }`}>
              {msg.text}
              
              {msg.songData && (
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Music className="w-3 h-3 text-[#38cc63] shrink-0" />
                    <span className="text-[10px] font-black uppercase truncate text-gray-600">{msg.songData.title}</span>
                  </div>
                  <button onClick={() => onSongFound(msg.songData!)} className="text-[9px] font-black bg-[#38cc63]/10 text-[#38cc63] px-3 py-1.5 rounded-full hover:bg-[#38cc63]/20">
                    ABRIR
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold px-2">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span>João está procurando...</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) askJoao(input); }} className="relative">
          <input 
            type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Qual cifra você quer hoje?"
            className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#38cc63]/20"
          />
          <button type="submit" disabled={isTyping} className="absolute right-1.5 top-1.5 w-9 h-9 bg-[#1c1c1c] rounded-lg flex items-center justify-center text-white hover:bg-black transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoaoAssistant;
