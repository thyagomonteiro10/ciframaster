
import { Send, X, Sparkles, Music, Guitar, MessageCircle, Bot } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ExtendedSong } from '../constants';

interface Message {
  role: 'user' | 'joao';
  text: string;
  songData?: ExtendedSong;
}

interface JoaoAssistantProps {
  onSongFound: (song: ExtendedSong) => void;
  isOpen: boolean;
  onClose: () => void;
}

const JoaoAssistant: React.FC<JoaoAssistantProps> = ({ onSongFound, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'joao', text: 'Fala, mestre! Eu sou o João, seu parceiro de ensaio. Que som vamos tirar hoje?' }
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
    // Initialize AI client with proper API key usage from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          systemInstruction: `Você é o João, o mascote palheta do site CifraMaster AI. 
          Sua personalidade é de um músico experiente, amigável e usa gírias leves de músico brasileiro ("fala mestre", "bora pro ensaio", "toca muito").
          Regra de Ouro: Se o usuário pedir uma música, você DEVE gerar a cifra COMPLETA (letra e acordes do início ao fim). Nunca resuma.
          Sempre que encontrar uma música, inclua o campo "songData" no JSON de resposta.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: { type: Type.STRING, description: "Sua resposta amigável para o usuário" },
              songData: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  artist: { type: Type.STRING },
                  content: { type: Type.STRING, description: "Cifra COMPLETA com acordes em colchetes [C]" },
                  genre: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ['Fácil', 'Médio', 'Difícil'] },
                  originalKey: { type: Type.STRING },
                  tuning: { type: Type.STRING }
                }
              }
            },
            required: ["message"]
          }
        }
      });

      // Use the response.text property directly without calling it
      const data = JSON.parse(response.text);
      
      setMessages(prev => [...prev, { 
        role: 'joao', 
        text: data.message, 
        songData: data.songData 
      }]);

      if (data.songData) {
        onSongFound({
          id: Math.random().toString(36).substr(2, 9),
          ...data.songData
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'joao', text: 'Putz, deu uma desafinada aqui no meu sistema! Tenta de novo, mestre?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-8 z-[100] flex flex-col w-full md:w-[400px] h-full md:h-[600px] bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-purple-100 animate-in slide-in-from-bottom-8 duration-300">
      <div className="bg-purple-900 p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center rotate-3 shadow-lg border-2 border-white">
              <Guitar className="w-8 h-8 text-purple-900" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-white font-black text-xl tracking-tight">João AI</h3>
            <p className="text-purple-300 text-[10px] font-bold uppercase tracking-widest">Cifras Completas</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-purple-200 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium shadow-sm leading-relaxed ${
              msg.role === 'user' 
              ? 'bg-purple-600 text-white rounded-tr-none' 
              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
              {msg.text}
              {msg.songData && (
                <div className="mt-3 pt-3 border-t border-purple-100/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                      <Music className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-black uppercase truncate">{msg.songData.title}</span>
                  </div>
                  <button 
                    onClick={() => onSongFound(msg.songData!)}
                    className="text-[10px] font-black text-purple-600 underline"
                  >
                    Abrir Cifra Completa
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-gray-100 flex gap-1">
              <div className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-100 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); if (input.trim()) askJoao(input); }}
          className="relative"
        >
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Manda o nome da música, mestre..."
            className="w-full pl-6 pr-14 py-4 bg-gray-100 rounded-full text-sm font-bold outline-none focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all border border-transparent"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoaoAssistant;
