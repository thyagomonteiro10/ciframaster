
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, Pause, Plus, Grid, Printer, Sparkles, Guitar, 
  ChevronRight, Menu, Search, Music, Heart, ArrowLeft, X, Bot, Link as LinkIcon 
} from 'lucide-react';
import { MOCK_SONGS, ExtendedSong, TRENDING_SONGS, POPULAR_ARTISTS } from './constants';
import { findChordsWithAI } from './services/geminiService';
import { transposeContent } from './utils/musicUtils';
import SearchInput from './components/SearchInput';
import ChordDisplay from './components/ChordDisplay';
import ChordDiagram from './components/ChordDiagram';
import JoaoAssistant from './components/JoaoAssistant';

const GENRES = [
  'Sertanejo', 'Sertanejo Universitário', 'Rock', 'Gospel', 'MPB', 
  'Lambada', 'Samba', 'Axé', 'Sofrência'
];

const App: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<ExtendedSong | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transposition, setTransposition] = useState(0);
  const [fontSize, setFontSize] = useState(15);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [favorites, setFavorites] = useState<ExtendedSong[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isJoaoOpen, setIsJoaoOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ciframaster_favorites');
    if (saved) {
      try { setFavorites(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ciframaster_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (song: ExtendedSong) => {
    setFavorites(prev => {
      const isFav = prev.some(f => f.id === song.id);
      if (isFav) return prev.filter(f => f.id !== song.id);
      return [...prev, song];
    });
  };

  const isFavorite = (songId: string) => favorites.some(f => f.id === songId);

  // Identifica todos os acordes presentes na cifra para mostrar no final
  const songChords = useMemo(() => {
    if (!currentSong) return [];
    const chords = new Set<string>();
    const matches = currentSong.content.match(/\[(.*?)\]/g);
    if (matches) {
      matches.forEach(m => chords.add(m.slice(1, -1)));
    }
    return Array.from(chords);
  }, [currentSong]);

  const handleSongSelect = (song: ExtendedSong) => {
    setCurrentSong(song);
    setSelectedGenre(null);
    setTransposition(0);
    setIsJoaoOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setIsSearchVisible(false);
    
    let found = [...MOCK_SONGS, ...favorites].find(s => 
      s.title.toLowerCase().includes(query.toLowerCase()) || 
      s.artist.toLowerCase().includes(query.toLowerCase())
    ) as ExtendedSong;

    if (found) {
      handleSongSelect(found);
    } else {
      const aiSong = await findChordsWithAI(query);
      if (aiSong) {
        handleSongSelect(aiSong as ExtendedSong);
      }
    }
    setIsLoading(false);
  };

  const SidebarBtn = ({ icon: Icon, label, onClick, active = false, highlight = false }: any) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center transition-all group w-full py-3 border-b border-gray-100 ${active ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
    >
      <Icon className={`w-5 h-5 mb-1 ${highlight ? 'text-red-500' : active ? 'text-[#8B5CF6]' : 'text-gray-400 group-hover:text-gray-600'}`} />
      <span className={`text-[10px] text-center font-bold leading-tight ${active ? 'text-[#8B5CF6]' : 'text-gray-500'}`}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden relative">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-[60] shadow-sm h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-8 flex-1 min-w-0">
            <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setCurrentSong(null); setSelectedGenre(null); }}>
              <div className="bg-purple-900 p-1.5 rounded-xl shadow-lg"><Music className="text-white w-5 h-5" /></div>
              <span className="font-black text-lg text-purple-950 hidden sm:block">CIFRA<span className="text-gray-400">MASTER</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-4 text-xs font-bold text-gray-600">
               {GENRES.slice(0, 5).map(genre => (
                 <button key={genre} onClick={() => setSelectedGenre(genre)} className={`hover:text-[#8B5CF6] ${selectedGenre === genre ? 'text-purple-800' : ''}`}>{genre}</button>
               ))}
            </nav>
          </div>
          <div className="flex-1 max-w-md hidden md:block"><SearchInput onSearch={handleSearch} isLoading={isLoading} /></div>
          <button className="md:hidden p-2" onClick={() => setIsSearchVisible(!isSearchVisible)}><Search /></button>
        </div>
      </header>

      {isSearchVisible && <div className="p-4 bg-white border-b md:hidden"><SearchInput onSearch={handleSearch} isLoading={isLoading} /></div>}

      <div className="flex flex-1">
        {currentSong && (
          <aside className="hidden md:flex w-24 bg-white border-r border-gray-100 sticky top-16 h-[calc(100vh-4rem)] flex-col shrink-0">
            <SidebarBtn icon={Heart} label="Favoritar" highlight={isFavorite(currentSong.id)} onClick={() => toggleFavorite(currentSong)} />
            <SidebarBtn icon={isAutoScrolling ? Pause : Play} label="Auto rolagem" active={isAutoScrolling} onClick={() => setIsAutoScrolling(!isAutoScrolling)} />
            <div className="py-4 border-b flex flex-col items-center gap-2">
               <button onClick={() => setTransposition(t => t-1)} className="text-gray-300 hover:text-purple-600 font-bold">-½</button>
               <span className="text-[10px] font-black text-gray-400">TOM</span>
               <button onClick={() => setTransposition(t => t+1)} className="text-gray-300 hover:text-purple-600 font-bold">+½</button>
            </div>
            <SidebarBtn icon={Printer} label="Imprimir" onClick={() => window.print()} />
          </aside>
        )}

        <main className="flex-1 min-w-0">
          {!currentSong ? (
            <div className="max-w-7xl mx-auto p-4 md:p-12">
               {/* Dashboard inicial (Trending e Artistas) */}
               <h2 className="text-2xl font-black mb-8">Destaques</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {TRENDING_SONGS.map(s => (
                   <div key={s.rank} onClick={() => handleSearch(s.title!)} className="bg-gray-50 p-6 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-purple-50 transition-all">
                     <img src={s.imageUrl} className="w-16 h-16 rounded-2xl object-cover" />
                     <div>
                       <h3 className="font-bold">{s.title}</h3>
                       <p className="text-xs text-gray-500 uppercase">{s.artist}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          ) : (
            <div className="w-full pb-32">
               <div className="max-w-4xl mx-auto p-4 md:p-12">
                <div className="mb-12">
                   <div className="flex items-center justify-between mb-4">
                      <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-3 py-1 rounded-full uppercase">{currentSong.genre}</span>
                      {currentSong.sources && currentSong.sources.length > 0 && (
                        <div className="flex gap-2">
                           <LinkIcon className="w-4 h-4 text-gray-400" />
                           <span className="text-[10px] text-gray-400 font-bold">FONTE WEB</span>
                        </div>
                      )}
                   </div>
                   <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">{currentSong.title}</h2>
                   <p className="text-purple-900 font-black text-xl mb-6">{currentSong.artist}</p>
                </div>

                <ChordDisplay content={transposeContent(currentSong.content, transposition)} fontSize={fontSize} />

                {/* DICIONÁRIO DE ACORDES NO FINAL */}
                <div className="mt-20 pt-12 border-t-2 border-dashed border-gray-100">
                   <div className="flex items-center gap-2 mb-8">
                      <Grid className="w-6 h-6 text-purple-900" />
                      <h3 className="text-2xl font-black text-gray-900">Acordes da música</h3>
                   </div>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {songChords.map(chord => (
                        <ChordDiagram key={chord} chord={chord} />
                      ))}
                   </div>
                </div>

                {currentSong.sources && (
                  <div className="mt-12 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                     <p className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">Validado via Pesquisa Web:</p>
                     <div className="flex flex-col gap-2">
                        {currentSong.sources.map((s, i) => (
                          <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-sm font-bold text-purple-600 hover:underline flex items-center gap-2">
                            <LinkIcon className="w-3 h-3" /> {s.title}
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
        <button onClick={() => setIsJoaoOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-[80]">
          <Bot className="text-white w-8 h-8" />
        </button>
      )}

      <JoaoAssistant isOpen={isJoaoOpen} onClose={() => setIsJoaoOpen(false)} onSongFound={handleSongSelect} />
    </div>
  );
};

export default App;
