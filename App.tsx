
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, Pause, Grid, Printer, Music, Heart, X, Bot, Link as LinkIcon, 
  Globe, ChevronRight, Menu, Search, Video, Settings, ChevronDown, 
  Maximize2, Type as FontIcon, Minus, Plus, Share2
} from 'lucide-react';
import { ExtendedSong, POPULAR_ARTISTS, TOP_SONGS } from './constants';
import { findChordsWithAI } from './services/geminiService';
import { transposeContent } from './utils/musicUtils';
import SearchInput from './components/SearchInput';
import ChordDisplay from './components/ChordDisplay';
import ChordDiagram from './components/ChordDiagram';
import JoaoAssistant from './components/JoaoAssistant';

const GENRES = ['Sertanejo', 'Rock', 'Pop', 'Gospel', 'MPB', 'Forró', 'Pagode', 'Samba'];
const INSTRUMENTS = ['Violão', 'Guitarra', 'Teclado', 'Ukulele', 'Baixo'];

const App: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<ExtendedSong | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transposition, setTransposition] = useState(0);
  const [fontSize, setFontSize] = useState(15);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [favorites, setFavorites] = useState<ExtendedSong[]>([]);
  const [isJoaoOpen, setIsJoaoOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState('Violão');

  // Identifica acordes na cifra atual para o dicionário no final
  const songChords = useMemo(() => {
    if (!currentSong) return [];
    const chords = new Set<string>();
    const matches = currentSong.content.match(/\[(.*?)\]/g);
    if (matches) {
      matches.forEach(m => {
        const chord = m.slice(1, -1).trim();
        if (chord) chords.add(chord);
      });
    }
    return Array.from(chords);
  }, [currentSong]);

  const handleSongSelect = (song: ExtendedSong) => {
    setCurrentSong(song);
    setTransposition(0);
    setIsJoaoOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    const aiSong = await findChordsWithAI(query);
    if (aiSong) {
      handleSongSelect(aiSong as ExtendedSong);
    }
    setIsLoading(false);
  };

  // Efeito de auto-scroll
  useEffect(() => {
    let interval: any;
    if (isAutoScrolling) {
      interval = setInterval(() => {
        window.scrollBy(0, 1);
      }, 50 / scrollSpeed);
    }
    return () => clearInterval(interval);
  }, [isAutoScrolling, scrollSpeed]);

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col font-sans">
      {/* Header Estilo Cifra Club, agora como Cifra Master */}
      <header className="bg-[#1c1c1c] text-white sticky top-0 z-[60] h-14 md:h-16 flex items-center">
        <div className="max-w-[1280px] mx-auto w-full px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentSong(null)}>
            <div className="bg-[#38cc63] p-2 rounded-lg">
              <Music className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-xl md:text-2xl tracking-tight hidden sm:block uppercase">CIFRA<span className="text-[#38cc63]"> MASTER</span></span>
          </div>
          
          <div className="flex-1 max-w-2xl relative">
            <SearchInput onSearch={handleSearch} isLoading={isLoading} />
          </div>

          <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-tight opacity-80">
            {GENRES.slice(0, 4).map(g => (
              <button key={g} className="hover:text-[#38cc63] transition-colors">{g}</button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-full md:hidden"><Search className="w-5 h-5" /></button>
            <div className="w-8 h-8 rounded-full bg-gray-600 border border-white/20 hidden md:block overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=User&background=38cc63&color=fff" alt="User" />
            </div>
          </div>
        </div>
      </header>

      {/* Sub-header de Instrumentos */}
      <div className="bg-white border-b border-gray-200 h-10 flex items-center overflow-x-auto no-scrollbar">
        <div className="max-w-[1280px] mx-auto w-full px-4 flex items-center gap-8 whitespace-nowrap">
          {INSTRUMENTS.map(inst => (
            <button 
              key={inst} 
              onClick={() => setSelectedInstrument(inst)}
              className={`text-[11px] font-black uppercase tracking-widest h-full border-b-2 transition-all ${selectedInstrument === inst ? 'border-[#38cc63] text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {inst}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 max-w-[1280px] mx-auto w-full px-4 pt-6 gap-6">
        
        {/* Lado Esquerdo */}
        <aside className="hidden xl:block w-[180px] shrink-0">
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-widest">Top Artistas</h4>
            <div className="space-y-4">
              {POPULAR_ARTISTS.slice(0, 8).map(artist => (
                <div key={artist.name} onClick={() => handleSearch(artist.name)} className="flex items-center gap-2 cursor-pointer group">
                  <img src={artist.imageUrl} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-bold text-gray-600 group-hover:text-[#38cc63] truncate">{artist.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="flex-1 min-w-0 bg-white rounded-t-lg border border-gray-200 border-b-0 p-4 md:p-8">
          {!currentSong ? (
            <div className="py-6">
              <h1 className="text-3xl font-black text-gray-900 mb-8">As cifras mais acessadas</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                {TOP_SONGS.map((song, i) => (
                  <div 
                    key={song.rank} 
                    onClick={() => handleSearch(`${song.title} ${song.artist}`)}
                    className="flex items-center gap-4 py-3 border-b border-gray-100 cursor-pointer group hover:bg-gray-50 px-2 rounded-lg transition-colors"
                  >
                    <span className="text-lg font-black text-gray-300 group-hover:text-[#38cc63] w-6">{song.rank}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-gray-800 truncate">{song.title}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase">{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16">
                 <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2">
                    <Video className="text-red-500 w-6 h-6" /> Videoaulas recomendadas
                 </h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {[1,2,3].map(v => (
                     <div key={v} className="bg-gray-100 aspect-video rounded-xl relative overflow-hidden group cursor-pointer">
                        <img src={`https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=225&fit=crop&q=${v}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Play className="text-white w-12 h-12 fill-white" />
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              {/* Toolbar de Ferramentas */}
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-8 bg-gray-50 p-2 md:p-4 rounded-xl border border-gray-200">
                <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                   <button onClick={() => setTransposition(t => t-1)} className="p-2 hover:bg-gray-50 border-r border-gray-200"><Minus className="w-4 h-4" /></button>
                   <div className="px-4 text-[10px] font-black text-gray-600 uppercase">Tom</div>
                   <button onClick={() => setTransposition(t => t+1)} className="p-2 hover:bg-gray-50 border-l border-gray-200"><Plus className="w-4 h-4" /></button>
                </div>

                <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                   <button onClick={() => setFontSize(s => Math.max(10, s-1))} className="p-2 hover:bg-gray-50 border-r border-gray-200"><Minus className="w-4 h-4" /></button>
                   <div className="px-4"><FontIcon className="w-4 h-4 text-gray-400" /></div>
                   <button onClick={() => setFontSize(s => Math.min(24, s+1))} className="p-2 hover:bg-gray-50 border-l border-gray-200"><Plus className="w-4 h-4" /></button>
                </div>

                <button 
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-black text-[11px] transition-all ${isAutoScrolling ? 'bg-[#38cc63] border-[#38cc63] text-white shadow-lg' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {isAutoScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  ROLAGEM
                </button>

                <div className="hidden sm:flex items-center gap-4 ml-auto text-gray-400">
                   <button className="hover:text-gray-600" title="Imprimir" onClick={() => window.print()}><Printer className="w-5 h-5" /></button>
                   <button className="hover:text-gray-600" title="Compartilhar"><Share2 className="w-5 h-5" /></button>
                   <button className="hover:text-[#38cc63]" title="Favoritar"><Heart className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-2 mb-2 text-[#38cc63] font-black text-[10px] uppercase tracking-widest">
                  <Music className="w-3 h-3" /> {currentSong.genre}
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-gray-950 tracking-tight leading-none mb-2 uppercase">{currentSong.title}</h2>
                <h3 className="text-xl md:text-2xl font-medium text-gray-400">{currentSong.artist}</h3>
              </div>

              <ChordDisplay content={transposeContent(currentSong.content, transposition)} fontSize={fontSize} />

              {/* Dicionário de Acordes */}
              <div className="mt-20 pt-10 border-t border-gray-100">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">Acordes utilizados</h4>
                <div className="flex flex-wrap gap-x-12 gap-y-12 justify-center md:justify-start">
                  {songChords.map(chord => (
                    <div key={chord} className="flex flex-col items-center">
                      <ChordDiagram chord={chord} />
                    </div>
                  ))}
                </div>
              </div>

              {currentSong.sources && (
                <div className="mt-20 p-6 bg-gray-50 border border-gray-200 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-4">Fontes da busca inteligente</p>
                  <div className="flex flex-col gap-2">
                    {currentSong.sources.map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#38cc63] hover:underline flex items-center gap-2">
                        <LinkIcon className="w-3 h-3" /> {s.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Lado Direito */}
        {currentSong && (
          <aside className="hidden lg:block w-[240px] shrink-0">
             <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 sticky top-24">
                <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Videoaula</h4>
                <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                   <img src={`https://img.youtube.com/vi/placeholder/0.jpg`} className="w-full h-full object-cover opacity-60" />
                   <Play className="text-white w-8 h-8 absolute group-hover:scale-110 transition-transform" />
                </div>
                
                <h4 className="text-[10px] font-black text-gray-400 uppercase mt-8 mb-4 tracking-widest">Acordes rápidos</h4>
                <div className="grid grid-cols-2 gap-4">
                  {songChords.slice(0, 4).map(chord => (
                    <div key={chord} className="transform scale-[0.6] -mx-8 -my-8">
                       <ChordDiagram chord={chord} />
                    </div>
                  ))}
                </div>
                {songChords.length > 4 && (
                   <button className="w-full text-center text-[10px] font-black text-[#38cc63] mt-2 uppercase hover:underline">Ver todos</button>
                )}
             </div>
          </aside>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-20">
        <div className="max-w-[1280px] mx-auto px-4 text-center">
           <div className="flex items-center justify-center gap-2 mb-6 opacity-30">
              <Music className="w-6 h-6 text-gray-900" />
              <span className="font-black text-xl tracking-tighter uppercase">CIFRA<span className="text-[#38cc63]"> MASTER</span></span>
           </div>
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Feito com inteligência artificial para músicos</p>
        </div>
      </footer>

      {!isJoaoOpen && (
        <button 
          onClick={() => setIsJoaoOpen(true)} 
          className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-[#38cc63] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-[80] group"
        >
          <Bot className="text-white w-7 h-7 md:w-8 md:h-8" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      )}

      <JoaoAssistant isOpen={isJoaoOpen} onClose={() => setIsJoaoOpen(false)} onSongFound={handleSongSelect} />
    </div>
  );
};

export default App;
