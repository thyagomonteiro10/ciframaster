
import { Send, X, Music, Guitar, CheckCircle2, Loader2, Sparkles, Zap, AlertCircle, Search, Home } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ExtendedSong, ZEZE_SONGS, JULIANY_SOUZA_SONGS } from '../constants';

interface Message {
  role: 'user' | 'joao';
  text: string;
  songData?: ExtendedSong;
  isLocal?: boolean;
  status?: 'searching' | 'found' | 'error';
}

interface JoaoAssistantProps {
  onSongFound: (song: ExtendedSong) => void;
  isOpen: boolean;
  onClose: () => void;
  onGoHome?: () => void;
}

const JoaoAssistant: React.FC<JoaoAssistantProps> = ({ onSongFound, isOpen, onClose, onGoHome }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'joao', text: 'Fala, mestre! Sou o João. Qual som vamos tirar hoje? Pode mandar o nome de qualquer música que eu me viro pra achar a cifra pra você!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingStatus, setTypingStatus] = useState('Afinando a busca...');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const findLocalSong = (query: string): ExtendedSong | undefined => {
    const q = query.toLowerCase().trim()
      .replace(/^(toca|abre|cifra de|quero tocar|pesquisar)\s+/i, '');
    
    if (q.length < 2) return undefined;
    
    const allLocal = [...ZEZE_SONGS, ...JULIANY_SOUZA_SONGS];
    return allLocal.find(song => 
      song.title.toLowerCase() === q || 
      `${song.artist} ${song.title}`.toLowerCase().includes(q) ||
      song.title.toLowerCase().includes(q)
    );
  };

  const askJoao = async (query: string) => {
    if (!query.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');
    setIsTyping(true);
    setTypingStatus('Consultando meu caderno de cifras...');

    const localMatch = findLocalSong(query);
    if (localMatch) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'joao', 
          text: `Achei aqui no meu repertório! "${localMatch.title}" do ${localMatch.artist}. Já tô preparando o palco...`, 
          songData: localMatch,
          isLocal: true,
          status: 'found'
        }]);
        setIsTyping(false);
        setTimeout(() => onSongFound(localMatch), 800);
      }, 400);
      return;
    }

    setTypingStatus('Buscando na internet (Google Search)...');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Encontre a cifra completa e precisa de: "${query}". Se houver erros de digitação, corrija-os.`,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `Você é o João, o assistente inteligente do site Cifra Master. 
          Sua missão é ser o melhor instrutor de música do mundo.
          
          REGRAS DE OURO:
          1. Se o usuário pedir uma música, você DEVE encontrá-la usando Google Search.
          2. Corrija erros de digitação automaticamente (ex: "zeze de camargo" para "Zezé Di Camargo & Luciano").
          3. Formate a cifra com acordes entre colchetes [C] acima da letra.
          4. Se NÃO encontrar de jeito nenhum, explique o motivo educadamente.
          5. Use gírias de músico (brother, mestre, bora pro som, palhetada).
          
          RETORNE SEMPRE UM JSON COM:
          {
            "message": "Comentário sobre a música e o artista",
            "found": true/false,
            "songData": {
              "title": "Título Correto",
              "artist": "Artista Correto",
              "content": "Cifra completa formatada",
              "genre": "Gênero Musical",
              "difficulty": "Fácil/Médio/Difícil",
              "originalKey": "Tom original"
            }
          }`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: { type: Type.STRING },
              found: { type: Type.BOOLEAN },
              songData: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  artist: { type: Type.STRING },
                  content: { type: Type.STRING },
                  genre: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  originalKey: { type: Type.STRING }
                },
                required: ["title", "artist", "content", "genre", "difficulty"]
              }
            },
            required: ["message", "found"]
          }
        }
      });

      const data = JSON.parse(response.text);
      
      if (data.found && data.songData) {
        setTypingStatus('Formatando os acordes...');
        const newSong = {
          id: `ai-${Date.now()}`,
          ...data.songData,
          verified: false
        };

        setMessages(prev => [...prev, { 
          role: 'joao', 
          text: data.message, 
          songData: newSong,
          status: 'found'
        }]);
        
        setTimeout(() => onSongFound(newSong), 1000);
      } else {
        setMessages(prev => [...prev, { 
          role: 'joao', 
          text: data.message || "Eita mestre, dei uma rodada na web e não achei essa. Tem certeza do nome?",
          status: 'error'
        }]);
      }
    } catch (error) {
      console.error("Erro do João:", error);
      setMessages(prev => [...prev, { 
        role: 'joao', 
        text: 'Desculpa brother, deu uma interferência no meu sinal aqui. Pode mandar de novo?',
        status: 'error'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-8 z-[100] flex flex-col w-full md:w-[420px] h-full md:h-[650px] bg-white md:rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.35)] overflow-hidden border border-gray-100 transition-all animate-in fade-in slide-in-from-bottom-10">
      {/* Header João Intelligence */}
      <div className="bg-[#1c1c1c] p-6 flex items-center justify-between shrink-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#38cc63] via-yellow-400 to-[#38cc63] animate-gradient-x"></div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
              <Guitar className="w-8 h-8 text-[#38cc63] drop-shadow-[0_0_12px_rgba(56,204,99,0.4)]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#38cc63] rounded-full border-[3px] border-[#1c1c1c] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
              João <span className="text-[10px] bg-[#38cc63] text-white px-2 py-0.5 rounded-md font-black uppercase tracking-widest shadow-lg shadow-[#38cc63]/20">Expert IA</span>
            </h3>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-[#38cc63] rounded-full animate-pulse"></span>
               <p className="text-[#38cc63] text-[10px] font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onGoHome && (
            <button 
              onClick={onGoHome} 
              title="Voltar para o Início"
              className="p-2.5 text-gray-500 hover:text-[#38cc63] hover:bg-white/10 rounded-2xl transition-all"
            >
              <Home className="w-5 h-5" />
            </button>
          )}
          <button onClick={onClose} className="p-2.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Chat Area with Smooth Scroll */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#f8f9fa] custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
            <div className={`max-w-[90%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
              <div className={`relative p-5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#1c1c1c] text-white rounded-tr-none font-medium' 
                  : msg.status === 'error' 
                    ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                {msg.text}
                
                {msg.songData && (
                  <div className={`mt-4 p-4 rounded-2xl border-2 transition-all group animate-in zoom-in-95 ${
                    msg.isLocal ? 'bg-[#38cc63]/5 border-[#38cc63]/30' : 'bg-blue-50/50 border-blue-100'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`p-2 rounded-xl shadow-sm ${msg.isLocal ? 'bg-[#38cc63] text-white' : 'bg-blue-500 text-white'}`}>
                           <Music className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-[12px] font-black uppercase truncate text-gray-900">{msg.songData.title}</div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{msg.songData.artist}</div>
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <span className="flex items-center gap-1.5 text-[10px] font-black bg-[#38cc63] text-white px-2.5 py-1 rounded-full uppercase">
                          <Zap className="w-3 h-3 fill-white" /> Abrindo
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {msg.status === 'error' && (
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-red-500">
                    <AlertCircle className="w-3 h-3" /> Tente pesquisar com o nome do artista junto
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col gap-2 px-2">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-[#38cc63] rounded-full animate-bounce [animation-duration:0.6s]"></div>
                <div className="w-2 h-2 bg-[#38cc63] rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-[#38cc63] rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[11px] text-[#38cc63] font-black uppercase tracking-widest animate-pulse">{typingStatus}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Pro Area */}
      <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
        <form onSubmit={(e) => { e.preventDefault(); askJoao(input); }} className="relative group">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Diz aí o som! Ex: Toca Legião..."
            disabled={isTyping}
            className="w-full pl-6 pr-16 py-4.5 bg-gray-50 rounded-2xl text-[15px] font-bold text-gray-900 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-[#38cc63]/10 focus:bg-white transition-all border-2 border-transparent focus:border-[#38cc63]/30 disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim()} 
            className="absolute right-2 top-2 bottom-2 px-4 bg-[#1c1c1c] rounded-xl flex items-center justify-center text-white hover:bg-[#38cc63] active:scale-90 transition-all disabled:opacity-20 disabled:scale-90 shadow-xl shadow-black/10 group-hover:shadow-[#38cc63]/20"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
        <div className="mt-4 flex items-center justify-between px-1">
           <div className="flex items-center gap-4">
             <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
               <Sparkles className="w-3 h-3 text-yellow-500" /> Gemini Pro
             </span>
             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
             <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
               <Search className="w-3 h-3 text-[#38cc63]" /> Live Search
             </span>
           </div>
           <div className="text-[9px] font-black text-[#38cc63] uppercase tracking-tighter opacity-50">Cifra Master v2.5</div>
        </div>
      </div>
      
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default JoaoAssistant;
