
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, Pause, Grid, Printer, Music, Heart, X, Bot, Link as LinkIcon, Globe, ChevronRight, Menu, Search
} from 'lucide-react';
import { ExtendedSong, POPULAR_ARTISTS, TOP_SONGS } from './constants';
import { findChordsWithAI } from './services/geminiService';
import { transposeContent } from './utils/musicUtils';
import SearchInput from './components/SearchInput';
import ChordDisplay from './components/ChordDisplay';
import ChordDiagram from './components/ChordDiagram';
import JoaoAssistant from './components/JoaoAssistant';

const GENRES = ['Sertanejo', 'Rock', 'Gospel', 'MPB', 'Forró', 'Pagode', 'Samba'];

const App: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<ExtendedSong | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transposition, setTransposition] = useState(0);
  const [fontSize, setFontSize] = useState(15);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [favorites, setFavorites] = useState<ExtendedSong[]>([]);
  const [isJoaoOpen, setIsJoaoOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      {/* Header Estilo Letras.mus.br */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-[60] h-16 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 cursor-pointer" onClick={() => setCurrentSong(null)}>
            <div className="bg-purple-900 p-2 rounded-xl shadow-md">
              <Music className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-xl text-purple-950 tracking-tighter">CIFRA<span className="text-gray-300">MASTER</span></span>
          </div>
          <div className="flex-1 max-w-xl hidden md:block">
            <SearchInput onSearch={handleSearch} isLoading={isLoading} />
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            {GENRES.map(g => <button key={g} className="hover:text-purple-600 transition-colors">{g}</button>)}
          </nav>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar de Ações da Cifra */}
        {currentSong && (
          <aside className="hidden md:flex w-20 bg-white border-r border-gray-50 sticky top-16 h-[calc(100vh-4rem)] flex-col items-center py-6 gap-8">
            <button onClick={() => setTransposition(t => t+1)} className="flex flex-col items-center gap-1 group">
              <div className="p-3 rounded-full bg-gray-50 group-hover:bg-purple-100 text-gray-400 group-hover:text-purple-600 transition-all">+½</div>
              <span className="text-[9px] font-black text-gray-400">TOM</span>
            </button>
            <button onClick={() => setIsAutoScrolling(!isAutoScrolling)} className={`flex flex-col items-center gap-1 group ${isAutoScrolling ? 'text-purple-600' : 'text-gray-400'}`}>
              <div className={`p-3 rounded-full ${isAutoScrolling ? 'bg-purple-100' : 'bg-gray-50'} group-hover:bg-purple-100 transition-all`}>
                {isAutoScrolling ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </div>
              <span className="text-[9px] font-black">SCROLL</span>
            </button>
            <button onClick={() => window.print()} className="flex flex-col items-center gap-1 group text-gray-400 hover:text-purple-600">
              <div className="p-3 rounded-full bg-gray-50 group-hover:bg-purple-100 transition-all"><Printer className="w-5 h-5" /></div>
              <span className="text-[9px] font-black">PRINT</span>
            </button>
          </aside>
        )}

        <main className="flex-1 min-w-0">
          {!currentSong ? (
            <div className="max-w-7xl mx-auto px-4 py-12">
              {/* Seção Artistas (Replicando o Letras) */}
              <div className="mb-16">
                <h2 className="text-3xl font-black mb-12 text-gray-900 flex items-center gap-3">
                  <Globe className="text-purple-600" /> Artistas mais tocados
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-8">
                  {POPULAR_ARTISTS.map(artist => (
                    <div 
                      key={artist.name} 
                      onClick={() => handleSearch(artist.name)}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      <div className="relative mb-4">
                        <img 
                          src={artist.imageUrl} 
                          alt={artist.name} 
                          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform duration-300 ring-4 ring-transparent group-hover:ring-purple-100" 
                        />
                        <div className="absolute inset-0 bg-purple-900/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="font-bold text-gray-800 text-center group-hover:text-purple-600 transition-colors">{artist.name}</h3>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seção Top Músicas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-gray-100 pt-16">
                <div>
                  <h3 className="text-2xl font-black mb-8">Músicas em alta</h3>
                  <div className="space-y-4">
                    {TOP_SONGS.map(song => (
                      <div 
                        key={song.rank} 
                        onClick={() => handleSearch(`${song.title} ${song.artist}`)}
                        className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-purple-900/5 cursor-pointer transition-all group border border-transparent hover:border-purple-50"
                      >
                        <span className="text-3xl font-black text-gray-200 group-hover:text-purple-200 transition-colors w-10">{song.rank}</span>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{song.title}</h4>
                          <p className="text-sm text-gray-400 font-medium">{song.artist}</p>
                        </div>
                        <ChevronRight className="ml-auto text-gray-300 group-hover:text-purple-500" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-purple-50/50 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center mb-6 shadow-xl rotate-3">
                    <Bot className="w-10 h-10 text-purple-900" />
                  </div>
                  <h3 className="text-2xl font-black text-purple-950 mb-4">Não achou o que procurava?</h3>
                  <p className="text-purple-900/60 font-medium mb-8">Peça para o João buscar qualquer música em tempo real na internet para você.</p>
                  <button onClick={() => setIsJoaoOpen(true)} className="bg-purple-900 text-white px-8 py-4 rounded-full font-black shadow-xl shadow-purple-900/20 hover:scale-105 transition-all">ABRIR JOÃO WEB-SEARCH</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full pb-32">
              <div className="max-w-4xl mx-auto p-4 md:p-12">
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{currentSong.genre}</span>
                    {currentSong.sources && <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px]"><Globe className="w-3.5 h-3.5" /> FONTE WEB</div>}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-gray-950 tracking-tighter mb-2 leading-none">{currentSong.title}</h2>
                  <p className="text-purple-600 font-black text-2xl">{currentSong.artist}</p>
                </div>

                <ChordDisplay content={transposeContent(currentSong.content, transposition)} fontSize={fontSize} />

                {/* DICIONÁRIO DE ACORDES AUTOMÁTICO NO FINAL */}
                <div className="mt-24 pt-16 border-t-2 border-dashed border-gray-100">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="bg-purple-900 p-2.5 rounded-xl text-white shadow-lg"><Grid className="w-6 h-6" /></div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Acordes desta música</h3>
                  </div>
                  <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                    {songChords.map(chord => (
                      <div key={chord} className="transform hover:scale-110 transition-transform">
                        <ChordDiagram chord={chord} />
                      </div>
                    ))}
                  </div>
                </div>

                {currentSong.sources && (
                  <div className="mt-20 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.3em]">Validado via Pesquisa Online</p>
                    <div className="flex flex-col gap-3">
                      {currentSong.sources.map((s, i) => (
                        <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-sm font-bold text-purple-600 hover:text-purple-800 flex items-center gap-2">
                          <LinkIcon className="w-3.5 h-3.5" /> {s.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {!isJoaoOpen && (
        <button 
          onClick={() => setIsJoaoOpen(true)} 
          className="fixed bottom-8 right-8 w-20 h-20 bg-purple-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-[80] group"
        >
          <Bot className="text-white w-10 h-10 group-hover:rotate-12 transition-transform" />
          <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
        </button>
      )}

      <JoaoAssistant isOpen={isJoaoOpen} onClose={() => setIsJoaoOpen(false)} onSongFound={handleSongSelect} />
    </div>
  );
};

export default App;
