
import { Send, X, Music, Guitar, CheckCircle2, Loader2, Sparkles, Zap } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ExtendedSong, ZEZE_SONGS, JULIANY_SOUZA_SONGS } from '../constants';

interface Message {
  role: 'user' | 'joao';
  text: string;
  songData?: ExtendedSong;
  isLocal?: boolean;
}

interface JoaoAssistantProps {
  onSongFound: (song: ExtendedSong) => void;
  isOpen: boolean;
  onClose: () => void;
}

const JoaoAssistant: React.FC<JoaoAssistantProps> = ({ onSongFound, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'joao', text: 'Fala, mestre! Sou o João. Qual som vamos tirar hoje? É só mandar o nome da música ou do artista que eu já preparo o palco pra você!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const findLocalSong = (query: string): ExtendedSong | undefined => {
    const q = query.toLowerCase().trim()
      .replace('abre a cifra de ', '')
      .replace('quero tocar ', '')
      .replace('toca ', '');
    
    if (q.length < 2) return undefined;
    
    const allLocal = [...ZEZE_SONGS, ...JULIANY_SOUZA_SONGS];
    return allLocal.find(song => 
      song.title.toLowerCase().includes(q) || 
      song.artist.toLowerCase().includes(q)
    );
  };

  const askJoao = async (query: string) => {
    if (!query.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');
    setIsTyping(true);

    // Inteligência Local primeiro
    const localMatch = findLocalSong(query);
    if (localMatch) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'joao', 
          text: `Essa eu tenho aqui no meu caderno! "${localMatch.title}" do ${localMatch.artist}. Já tô abrindo pra você, mestre!`, 
          songData: localMatch,
          isLocal: true
        }]);
        setIsTyping(false);
        setTimeout(() => onSongFound(localMatch), 1000);
      }, 500);
      return;
    }

    // Inteligência Artificial
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `Você é o João, o instrutor de música mais gente boa do Brasil.
          OBJETIVO: Encontrar cifras precisas e abrir para o usuário.
          PERSONALIDADE: Use gírias de músico (mestre, brother, tirar um som, palhetada). Seja rápido e prestativo.
          
          SE O USUÁRIO PEDIR UMA MÚSICA:
          1. Busque a cifra real com Google Search.
          2. Garanta que o JSON contenha 'songData'.
          3. No campo 'message', diga algo como "Encontrei essa fera aqui! Preparando a cifra de [Musica]..."
          
          FORMATO DE RESPOSTA (JSON):
          {
            "message": "Sua resposta amigável aqui",
            "songData": {
              "title": "Nome da Música",
              "artist": "Nome do Artista",
              "content": "Letra com [Acordes] entre colchetes",
              "genre": "Gênero",
              "difficulty": "Fácil/Médio/Difícil",
              "originalKey": "Tom Original"
            }
          }`,
          responseMimeType: "application/json",
        }
      });

      const data = JSON.parse(response.text);
      
      if (data.songData) {
        const newSong = {
          id: `ai-${Date.now()}`,
          ...data.songData,
          verified: false
        };

        setMessages(prev => [...prev, { 
          role: 'joao', 
          text: data.message || `Achei! Vamos tocar "${newSong.title}". Abrindo em 3, 2, 1...`, 
          songData: newSong 
        }]);
        
        // Redirecionamento automático
        setTimeout(() => onSongFound(newSong), 1500);
      } else {
        setMessages(prev => [...prev, { 
          role: 'joao', 
          text: data.message || "Poxa mestre, procurei em todo canto mas essa cifra tá difícil. Tenta outro nome?" 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'joao', text: 'Eita, deu um nó nas cordas aqui. Tenta de novo, por favor?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-8 z-[100] flex flex-col w-full md:w-[400px] h-full md:h-[620px] bg-white md:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-100 transition-all animate-in fade-in slide-in-from-bottom-10">
      {/* Header Premium */}
      <div className="bg-[#1c1c1c] p-5 flex items-center justify-between shrink-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#38cc63] to-transparent opacity-50"></div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700 shadow-inner">
              <Guitar className="w-7 h-7 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#38cc63] rounded-full border-2 border-[#1c1c1c] flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-black text-base tracking-tight flex items-center gap-2">
              João <span className="text-[10px] bg-[#38cc63] text-white px-1.5 py-0.5 rounded font-bold uppercase">Pro</span>
            </h3>
            <p className="text-[#38cc63]/80 text-[10px] font-bold uppercase tracking-widest">Pronto para o show</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#fcfcfc] custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[88%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
              <div className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#38cc63] text-white rounded-tr-none font-semibold' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                {msg.text}
                
                {msg.songData && (
                  <div className={`mt-4 p-3 rounded-xl border flex flex-col gap-2 transition-all group cursor-pointer hover:border-[#38cc63]/50 ${
                    msg.isLocal ? 'bg-[#38cc63]/5 border-[#38cc63]/20' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="p-1.5 bg-white rounded-lg border border-gray-100 shadow-sm">
                           <Music className={`w-3.5 h-3.5 ${msg.isLocal ? 'text-[#38cc63]' : 'text-gray-400'}`} />
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-[11px] font-black uppercase truncate text-gray-800">{msg.songData.title}</div>
                          <div className="text-[9px] text-gray-500 font-bold uppercase">{msg.songData.artist}</div>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 text-[9px] font-bold bg-[#38cc63]/10 text-[#38cc63] px-2 py-0.5 rounded-full uppercase">
                        <Zap className="w-2.5 h-2.5" /> Abrindo
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-3 text-[11px] text-gray-400 font-bold px-2 italic">
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#38cc63] rounded-full animate-bounce [animation-duration:0.8s]"></div>
              <div className="w-1.5 h-1.5 bg-[#38cc63] rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-[#38cc63] rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></div>
            </div>
            <span>João está afinando a busca...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-5 bg-white border-t border-gray-100">
        <form onSubmit={(e) => { e.preventDefault(); askJoao(input); }} className="relative">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: Toca No Dia em que Saí de Casa..."
            className="w-full pl-5 pr-14 py-4 bg-gray-100 rounded-2xl text-[14px] font-bold text-black placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-[#38cc63]/10 focus:bg-white transition-all border border-transparent focus:border-[#38cc63]/20"
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim()} 
            className="absolute right-2 top-2 w-11 h-11 bg-[#1c1c1c] rounded-xl flex items-center justify-center text-white hover:bg-black active:scale-95 transition-all disabled:opacity-20 disabled:scale-90 shadow-lg shadow-black/10"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
        <div className="mt-3 flex items-center justify-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
           <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> IA Gemini 3</span>
           <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
           <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Redirecionamento Auto</span>
        </div>
      </div>
    </div>
  );
};

export default JoaoAssistant;
