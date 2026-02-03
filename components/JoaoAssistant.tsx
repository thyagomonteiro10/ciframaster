
import { Send, X, Music, Guitar, Loader2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ExtendedSong } from '../constants';

interface Message {
  role: 'user' | 'joao';
  text: string;
  songData?: ExtendedSong;
  status?: 'searching' | 'found' | 'error';
}

interface JoaoAssistantProps {
  onSongFound: (song: ExtendedSong) => void;
  isOpen: boolean;
  onClose: () => void;
}

const JoaoAssistant: React.FC<JoaoAssistantProps> = ({ onSongFound, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'joao', text: 'Fala, mestre! Qual som vamos tirar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const askJoao = async (query: string) => {
    if (!query.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');
    setIsTyping(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: query,
        config: {
          systemInstruction: "Você é o João do Cifra Master. Encontre cifras com acordes entre colchetes [C]. Retorne JSON.",
          responseMimeType: "application/json"
        }
      });
      const data = JSON.parse(response.text);
      setMessages(prev => [...prev, { role: 'joao', text: data.message || "Encontrei essa cifra!", status: 'found' }]);
      if (data.songData) onSongFound(data.songData);
    } catch {
      setMessages(prev => [...prev, { role: 'joao', text: 'Houve um erro.', status: 'error' }]);
    } finally { setIsTyping(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-8 z-[100] flex flex-col w-full md:w-[420px] h-full md:h-[600px] bg-white md:rounded-3xl shadow-2xl border">
      <div className="bg-[#1c1c1c] p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo do João: Violão Verde no fundo Preto */}
          <div className="w-12 h-12 bg-[#1c1c1c] rounded-xl flex items-center justify-center border-2 border-[#22c55e] shadow-inner">
            <Guitar className="w-7 h-7 text-[#22c55e]" />
          </div>
          <div>
            <h3 className="text-white font-black">João <span className="bg-[#22c55e] text-white text-[10px] px-2 py-0.5 rounded ml-2">IA</span></h3>
            <p className="text-[#22c55e] text-[10px] uppercase font-bold">Online</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8f9fa] no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-[#1c1c1c] text-white' : 'bg-white border text-gray-800'}`}>{msg.text}</div>
          </div>
        ))}
        {isTyping && <div className="text-[10px] text-[#22c55e] font-black animate-pulse uppercase">João está procurando...</div>}
      </div>
      <div className="p-4 bg-white border-t">
        <form onSubmit={(e) => { e.preventDefault(); askJoao(input); }} className="relative">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Toca um Legião..." className="w-full pl-4 pr-12 py-3 bg-gray-50 rounded-xl outline-none focus:border-[#22c55e] border-2 border-transparent" />
          <button type="submit" className="absolute right-2 top-2 p-2 bg-[#1c1c1c] text-white rounded-lg hover:bg-[#22c55e] transition-all"><Send className="w-4 h-4" /></button>
        </form>
      </div>
    </div>
  );
};

export default JoaoAssistant;
