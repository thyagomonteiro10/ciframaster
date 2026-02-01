
import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, ChevronUp, ChevronDown, Plus, 
  Grid, Activity, Settings, Maximize2, PlusCircle, 
  Clock, BookOpen, PenTool, Printer, Sparkles, Guitar, 
  CheckCircle, ChevronRight, Menu, Search, Music, Heart, ArrowLeft, X, Bot, MessageCircle
} from 'lucide-react';
import { MOCK_SONGS, ExtendedSong, TRENDING_SONGS, POPULAR_ARTISTS } from './constants';
import { findChordsWithAI } from './services/geminiService';
import { transposeContent } from './utils/musicUtils';
import SearchInput from './components/SearchInput';
import ChordDisplay from './components/ChordDisplay';
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
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar favoritos", e);
      }
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
    
    // Prioriza busca exata no banco local (Mocks + Favoritos)
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

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentSong(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setCurrentSong(null);
    setSelectedGenre(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    let interval: any;
    if (isAutoScrolling) {
      interval = setInterval(() => window.scrollBy(0, scrollSpeed), 50);
    }
    return () => clearInterval(interval);
  }, [isAutoScrolling, scrollSpeed]);

  const SidebarBtn = ({ icon: Icon, label, onClick, active = false, highlight = false, small = false }: any) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center transition-all group ${small ? 'px-2 py-1' : 'w-full py-3 border-b border-gray-100'} ${active ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
    >
      <Icon className={`${small ? 'w-4 h-4' : 'w-5 h-5'} mb-1 ${highlight ? 'text-red-500' : active ? 'text-[#8B5CF6]' : 'text-gray-400 group-hover:text-gray-600'}`} />
      <span className={`text-[10px] text-center font-bold leading-tight ${active ? 'text-[#8B5CF6]' : 'text-gray-500'}`}>
        {label}
      </span>
    </button>
  );

  // Se o gênero selecionado for 'Sertanejo', incluímos também o 'Sertanejo Universitário' se houver confusão de tags
  const filteredSongs = selectedGenre 
    ? MOCK_SONGS.filter(s => {
        if (selectedGenre === 'Sertanejo') {
          return s.genre.includes('Sertanejo');
        }
        return s.genre.toLowerCase() === selectedGenre.toLowerCase();
      })
    : [];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden relative">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-[60] shadow-sm h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-8 flex-1 min-w-0">
            <button 
              className="md:hidden p-2 text-gray-600 shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>

            <div 
              className="flex items-center gap-2 cursor-pointer group shrink-0" 
              onClick={handleLogoClick}
            >
              <div className="bg-purple-900 p-1.5 md:p-2 rounded-xl shadow-lg">
                <Music className="text-white w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex flex-col -space-y-1 hidden sm:flex">
                <span className="font-black text-lg md:text-xl tracking-tighter text-purple-950">
                  CIFRA<span className="text-gray-400 group-hover:text-purple-900 transition-colors">MASTER</span>
                </span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-4 text-[11px] lg:text-[13px] font-bold text-gray-600 overflow-x-auto no-scrollbar py-2">
               {GENRES.slice(0, 6).map(genre => (
                 <button 
                  key={genre}
                  onClick={() => handleGenreClick(genre)}
                  className={`hover:text-[#8B5CF6] transition-colors whitespace-nowrap ${selectedGenre === genre ? 'text-purple-800' : ''}`}
                 >
                   {genre}
                 </button>
               ))}
               <div className="relative group">
                  <button className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-1 whitespace-nowrap">
                    Mais +
                  </button>
                  <div className="absolute top-full left-0 bg-white border border-gray-100 shadow-xl rounded-xl py-2 hidden group-hover:block z-[100] min-w-[150px]">
                    {GENRES.slice(6).map(genre => (
                      <button 
                        key={genre}
                        onClick={() => handleGenreClick(genre)}
                        className="w-full text-left px-4 py-2 hover:bg-purple-50 text-xs font-bold text-gray-700 hover:text-purple-600"
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
               </div>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4 justify-end">
             <div className={`${isSearchVisible ? 'fixed inset-x-0 top-16 p-4 bg-white border-b md:relative md:inset-auto md:p-0 md:bg-transparent md:border-none md:block' : 'hidden md:block'} flex-1 max-w-md z-50`}>
                <SearchInput onSearch={handleSearch} isLoading={isLoading} />
             </div>
             
             <button 
               className="md:hidden p-2 text-gray-600"
               onClick={() => setIsSearchVisible(!isSearchVisible)}
             >
               {isSearchVisible ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
             </button>

             <button className="hidden sm:block bg-gradient-to-r from-purple-800 to-purple-950 px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold text-white shadow-md hover:scale-105 transition-all whitespace-nowrap">
                Entrar
             </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[55] md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col p-6 overflow-y-auto no-scrollbar">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Categorias Musicais</h3>
            <div className="flex flex-col gap-4">
              {GENRES.map(genre => (
                <button 
                  key={genre}
                  onClick={() => handleGenreClick(genre)}
                  className={`flex items-center justify-between text-lg font-black transition-colors ${selectedGenre === genre ? 'text-purple-600' : 'text-purple-950'}`}
                >
                  {genre} <ChevronRight className={`w-5 h-5 ${selectedGenre === genre ? 'text-purple-300' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {currentSong && (
          <aside className="hidden md:flex w-24 bg-white border-r border-gray-100 sticky top-16 h-[calc(100vh-4rem)] flex-col overflow-y-auto no-scrollbar shrink-0">
            <SidebarBtn 
              icon={Heart} 
              label={isFavorite(currentSong.id) ? "Favorito" : "Favoritar"} 
              highlight={isFavorite(currentSong.id)}
              onClick={() => toggleFavorite(currentSong)}
            />
            <SidebarBtn icon={Sparkles} label="Simplificar" />
            <SidebarBtn 
              icon={isAutoScrolling ? Pause : Play} 
              label="Auto rolagem" 
              active={isAutoScrolling}
              onClick={() => setIsAutoScrolling(!isAutoScrolling)} 
            />
            <div className="w-full flex flex-col items-center py-4 border-b border-gray-100 gap-1">
               <div className="flex items-center gap-2">
                  <button onClick={() => setFontSize(s => Math.max(10, s-1))} className="text-gray-300 hover:text-purple-600 text-xs font-bold">A</button>
                  <span className="text-[10px] font-bold text-gray-400">Texto</span>
                  <button onClick={() => setFontSize(s => Math.min(30, s+1))} className="text-gray-300 hover:text-purple-600 text-lg font-bold">A</button>
               </div>
            </div>
            <div className="w-full flex flex-col items-center py-4 border-b border-gray-100 gap-1">
               <div className="flex items-center gap-2">
                  <button onClick={() => setTransposition(t => t-1)} className="text-gray-300 hover:text-purple-600"><Plus className="w-4 h-4 rotate-45"/></button>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">½ Tom</span>
                  <button onClick={() => setTransposition(t => t+1)} className="text-gray-300 hover:text-purple-600"><Plus className="w-4 h-4"/></button>
               </div>
            </div>
            <SidebarBtn icon={Grid} label="Acordes" />
            <SidebarBtn icon={Printer} label="Imprimir" />
          </aside>
        )}

        <main className="flex-1 min-w-0">
          {!currentSong ? (
            <div className="w-full pb-20">
              {selectedGenre ? (
                <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                   <button 
                    onClick={() => setSelectedGenre(null)}
                    className="flex items-center gap-2 text-sm font-bold text-purple-700 mb-6"
                   >
                     <ArrowLeft className="w-4 h-4" /> Voltar
                   </button>
                   <div className="flex items-center gap-4 mb-8">
                      <div className="bg-purple-900 p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-xl">
                        <Music className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">{selectedGenre}</h2>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {filteredSongs.length > 0 ? (
                        filteredSongs.map(song => (
                          <div 
                            key={song.id}
                            onClick={() => handleSongSelect(song)}
                            className="group bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:shadow-xl transition-all cursor-pointer flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                <Music className="w-5 h-5 text-gray-400" />
                              </div>
                              <div className="truncate">
                                <h3 className="font-bold text-gray-900 truncate">{song.title}</h3>
                                <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase truncate">{song.artist}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                          <Sparkles className="w-10 h-10 text-purple-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-bold mb-2">Buscando as melhores cifras de {selectedGenre}...</p>
                          <button 
                            onClick={() => setIsJoaoOpen(true)}
                            className="text-purple-600 font-black underline"
                          >
                            Falar com o João AI agora
                          </button>
                        </div>
                      )}
                   </div>
                </div>
              ) : (
                <>
                  <section className="max-w-7xl mx-auto px-4 py-4 md:py-8">
                    <div className="relative w-full h-[300px] md:h-[450px] rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-purple-950 group shadow-2xl">
                       <img 
                        src="https://images.unsplash.com/photo-1514525253344-f251357ad165?w=1600&h=800&fit=crop" 
                        alt="Destaque Sertanejo" 
                        className="w-full h-full object-cover opacity-60"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-purple-900/40 to-transparent p-6 md:p-12 flex flex-col justify-end">
                          <h1 className="text-4xl md:text-7xl font-black text-white mb-1 md:mb-2 tracking-tighter">Liberdade Provisória</h1>
                          <p className="text-lg md:text-2xl text-purple-300 font-black uppercase tracking-wider">Henrique & Juliano</p>
                          <div className="mt-6 md:mt-8">
                            <button 
                              onClick={() => handleSearch('Liberdade Provisória')}
                              className="bg-white text-purple-950 font-black px-8 md:px-12 py-3 md:py-4 rounded-full text-sm md:text-lg hover:bg-purple-50 transition-all flex items-center gap-2"
                            >
                              <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                              Tocar agora
                            </button>
                          </div>
                       </div>
                    </div>
                  </section>

                  {/* Outras seções como favoritos e trending (mantidas conforme original) */}
                  <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                     <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">Artistas em Destaque</h2>
                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {POPULAR_ARTISTS.map((artist) => (
                          <div 
                            key={artist.name} 
                            onClick={() => handleSearch(artist.name)}
                            className="flex flex-col items-center gap-3 p-4 rounded-3xl hover:bg-purple-50 transition-all cursor-pointer group"
                          >
                             <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-110 transition-transform">
                                <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                             </div>
                             <span className="text-xs font-black text-gray-800 text-center">{artist.name}</span>
                          </div>
                        ))}
                     </div>
                  </section>
                </>
              )}
            </div>
          ) : (
            // Exibição da Cifra (mantida conforme original com melhorias)
            <div className="w-full pb-32 md:pb-12">
               <div className="max-w-4xl mx-auto p-4 md:p-12">
                <div className="space-y-4 mb-8">
                   <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-purple-100 text-purple-900 text-[9px] md:text-[10px] font-black px-2 py-1 rounded-md uppercase">{currentSong.genre}</span>
                        <span className="bg-gray-100 text-gray-600 text-[9px] md:text-[10px] font-black px-2 py-1 rounded-md uppercase">{currentSong.difficulty}</span>
                      </div>
                      <button 
                        onClick={() => toggleFavorite(currentSong)}
                        className={`p-2.5 md:p-3 rounded-full transition-all border ${isFavorite(currentSong.id) ? 'bg-red-50 border-red-100 text-red-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                      >
                        <Heart className={`w-5 h-5 md:w-6 md:h-6 ${isFavorite(currentSong.id) ? 'fill-current' : ''}`} />
                      </button>
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none">{currentSong.title}</h2>
                   <p className="text-purple-900 font-black uppercase text-lg md:text-xl tracking-wide">{currentSong.artist}</p>
                </div>

                <div className="overflow-x-auto">
                  <ChordDisplay 
                    content={transposeContent(currentSong.content, transposition)} 
                    fontSize={fontSize} 
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <JoaoAssistant 
        isOpen={isJoaoOpen} 
        onClose={() => setIsJoaoOpen(false)} 
        onSongFound={handleSongSelect}
      />
    </div>
  );
};

export default App;
