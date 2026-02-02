
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Play, Pause, Grid, Music, Heart, X, Bot, Link as LinkIcon, 
  Globe, ChevronRight, Menu, Search, Video, Settings, ChevronDown, 
  Maximize2, Type as FontIcon, Minus, Plus, Share2, Guitar, Star, Users, Flame, Disc, ArrowLeft, CheckCircle2,
  ArrowUpDown, Type, PlusCircle, Timer, Activity, Folder, ExternalLink, Info, Download, PlayCircle,
  Keyboard, Monitor, Youtube, Sparkles, Zap, AlertCircle, Eye
} from 'lucide-react';
import { ExtendedSong, ZEZE_SONGS, JULIANY_SOUZA_SONGS } from './constants';
import { findChordsWithAI } from './services/geminiService';
import { transposeContent } from './utils/musicUtils';
import SearchInput from './components/SearchInput';
import ChordDisplay from './components/ChordDisplay';
import ChordDiagram from './components/ChordDiagram';
import JoaoAssistant from './components/JoaoAssistant';
import Tuner from './components/Tuner';
import Metronome from './components/Metronome';

const GENRES = ['Sertanejo', 'Rock', 'Pop', 'Reggae', 'Gospel', 'Forró', 'MPB', 'Samba', 'Sofrência'];
const INSTRUMENTS = [
  { id: 'Violão', icon: Guitar, label: 'Violão' },
  { id: 'Guitarra', icon: Monitor, label: 'Guitarra' },
  { id: 'Teclado', icon: Keyboard, label: 'Teclado' },
  { id: 'Ukulele', icon: Music, label: 'Ukulele' }
];

const App: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<ExtendedSong | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transposition, setTransposition] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [isJoaoOpen, setIsJoaoOpen] = useState(false);
  const [isTunerOpen, setIsTunerOpen] = useState(false);
  const [isMetronomeOpen, setIsMetronomeOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState('Violão');
  const [showChordsInSidebar, setShowChordsInSidebar] = useState(false);
  const [favorites, setFavorites] = useState<ExtendedSong[]>([]);
  const [isFavFolderOpen, setIsFavFolderOpen] = useState(true);
  const [isViewMode, setIsViewMode] = useState(false);

  // Load favorites from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cifra_master_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar favoritos", e);
      }
    }
  }, []);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('cifra_master_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((song: ExtendedSong) => {
    setFavorites(prev => {
      const isFav = prev.some(f => f.id === song.id);
      if (isFav) {
        return prev.filter(f => f.id !== song.id);
      } else {
        return [...prev, song];
      }
    });
  }, []);

  const isCurrentFavorite = useMemo(() => {
    if (!currentSong) return false;
    return favorites.some(f => f.id === currentSong.id);
  }, [favorites, currentSong]);

  const groupedContent = useMemo(() => {
    const allSongs = [...ZEZE_SONGS, ...JULIANY_SOUZA_SONGS];
    const map: Record<string, Record<string, ExtendedSong[]>> = {};

    allSongs.forEach(song => {
      if (!map[song.genre]) map[song.genre] = {};
      if (!map[song.genre][song.artist]) map[song.genre][song.artist] = [];
      map[song.genre][song.artist].push(song);
    });

    return map;
  }, []);

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

  const handleSongSelect = useCallback((song: ExtendedSong) => {
    setCurrentSong(song);
    setTransposition(0);
    setFontSize(16);
    setIsJoaoOpen(false);
    setIsAutoScrolling(false);
    setScrollSpeed(1);
    setShowChordsInSidebar(false);
    setIsViewMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('juliany souza') || q.includes('quem é esse')) {
       handleSongSelect(JULIANY_SOUZA_SONGS[0]);
       return;
    }
    setIsLoading(true);
    const aiSong = await findChordsWithAI(query);
    if (aiSong) {
      handleSongSelect(aiSong as ExtendedSong);
    } else {
      alert("Desculpe, mestre! Não conseguimos encontrar essa cifra agora. Tente novamente.");
    }
    setIsLoading(false);
  }, [handleSongSelect]);

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    setSelectedArtist(null);
    setCurrentSong(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArtistClick = (artist: string) => {
    setSelectedArtist(artist);
    setCurrentSong(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentSong) {
      setCurrentSong(null);
      setIsViewMode(false);
    } else if (selectedArtist) {
      setSelectedArtist(null);
    } else if (selectedGenre) {
      setSelectedGenre(null);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isAutoScrolling) {
      interval = setInterval(() => {
        window.scrollBy(0, 1);
      }, 60 / scrollSpeed);
    }
    return () => clearInterval(interval);
  }, [isAutoScrolling, scrollSpeed]);

  const transposedContent = useMemo(() => {
    if (!currentSong) return '';
    return transposeContent(currentSong.content, transposition);
  }, [currentSong, transposition]);

  // Download functionality
  const handleDownload = useCallback(() => {
    if (!currentSong) return;

    const timestamp = new Date().toLocaleDateString('pt-BR');
    const header = `--------------------------------------------------\nCIFRA MASTER - Seu portal de música\nGerado em: ${timestamp}\n--------------------------------------------------\n\nMúsica: ${currentSong.title}\nArtista: ${currentSong.artist}\nTom Original: ${currentSong.originalKey || 'N/A'}\nTransposição Atual: ${transposition > 0 ? '+' : ''}${transposition} semitonia(s)\n\n--------------------------------------------------\n\n`;
    const footer = `\n\n--------------------------------------------------\nBaixe mais cifras em: Cifra Master AI\n--------------------------------------------------`;
    
    const fullText = header + transposedContent + footer;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentSong.artist} - ${currentSong.title}.txt`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [currentSong, transposedContent, transposition]);

  const renderHome = () => (
    <div className="py-2">
      {/* Pasta de Favoritos Otimizada */}
      {favorites.length > 0 && (
        <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
           <button 
             onClick={() => setIsFavFolderOpen(!isFavFolderOpen)}
             className="w-full flex items-center justify-between p-4 bg-[#1c1c1c] rounded-2xl shadow-xl border border-white/5 hover:bg-gray-800 transition-all group"
           >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-[#38cc63]/20 rounded-xl flex items-center justify-center border border-[#38cc63]/30">
                    <Folder className="text-[#38cc63] w-5 h-5 fill-[#38cc63]/20" />
                 </div>
                 <div className="text-left">
                    <h2 className="text-lg font-black text-white tracking-tight uppercase">Meus Favoritos</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{favorites.length} música{favorites.length !== 1 ? 's' : ''} salva{favorites.length !== 1 ? 's' : ''}</p>
                 </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isFavFolderOpen ? 'rotate-180' : ''}`} />
           </button>
           
           {isFavFolderOpen && (
             <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in slide-in-from-top-2 duration-300 origin-top">
                {favorites.map((song) => (
                  <div 
                    key={song.id} 
                    onClick={() => handleSongSelect(song)}
                    className="group flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl hover:border-[#38cc63] hover:shadow-sm transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#38cc63] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex-1 min-w-0 pr-3">
                      <h4 className="font-bold text-gray-800 text-sm truncate group-hover:text-[#38cc63]">{song.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate">{song.artist}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#38cc63] group-hover:text-white transition-all">
                      <Play className="w-4 h-4" />
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      )}

      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Disc className="text-[#38cc63] w-7 h-7" /> Navegar por Ritmos
        </h1>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-[#38cc63]/10 text-[9px] font-black rounded-full text-[#38cc63] uppercase tracking-widest flex items-center gap-1.5">
            <Flame className="w-3 h-3" /> Explorar
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-20">
        {GENRES.map((genre) => (
          <button 
            key={genre}
            onClick={() => handleGenreClick(genre)}
            className="group relative h-24 md:h-32 rounded-2xl overflow-hidden bg-gray-900 shadow-lg hover:shadow-[#38cc63]/20 transition-all border-2 border-transparent hover:border-[#38cc63]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#38cc63]/20 to-black opacity-60 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
               <span className="text-white font-black text-sm md:text-lg uppercase tracking-widest group-hover:scale-110 transition-transform">
                 {genre}
               </span>
               <div className="w-8 h-0.5 bg-[#38cc63] mt-2 group-hover:w-16 transition-all"></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderArtistsView = () => {
    const artists = groupedContent[selectedGenre!] || {};
    const artistNames = Object.keys(artists);

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={handleBack} className="flex items-center gap-2 text-[10px] font-black text-[#38cc63] uppercase tracking-[0.2em] mb-8">
          <ArrowLeft className="w-4 h-4" /> Voltar aos Gêneros
        </button>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase mb-12">{selectedGenre}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artistNames.map((artist) => (
            <button key={artist} onClick={() => handleArtistClick(artist)} className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#38cc63] p-5 text-left">
               <h3 className="font-black text-gray-900 uppercase tracking-tight group-hover:text-[#38cc63]">{artist}</h3>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderSongsView = () => {
    const songs = groupedContent[selectedGenre!]?.[selectedArtist!] || [];
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button onClick={handleBack} className="flex items-center gap-2 text-[10px] font-black text-[#38cc63] uppercase tracking-[0.2em] mb-8">
          <ArrowLeft className="w-4 h-4" /> Voltar para {selectedGenre}
        </button>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-12">{selectedArtist}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.map((song) => (
            <div key={song.id} onClick={() => handleSongSelect(song)} className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#38cc63] cursor-pointer">
              <h4 className="font-bold text-gray-800 text-lg group-hover:text-[#38cc63]">{song.title}</h4>
              <Play className="w-4 h-4 text-[#38cc63]" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SidebarButton = ({ icon: Icon, label, onClick, children, active, primary }: any) => (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl border transition-all group ${
        primary 
          ? 'bg-[#38cc63] border-[#38cc63] text-white' 
          : active 
            ? 'bg-[#38cc63]/5 border-[#38cc63]/30 text-[#38cc63]' 
            : 'bg-white border-gray-200 hover:border-gray-400'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${primary ? 'text-white' : active ? 'text-[#38cc63]' : 'text-gray-400'}`} />
        <span className={`text-[11px] font-bold uppercase tracking-tight ${primary ? 'text-white' : active ? 'text-[#38cc63]' : 'text-gray-600'}`}>{label}</span>
      </div>
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col font-sans relative overflow-x-hidden">
      {!isViewMode && (
        <header className="bg-[#1c1c1c] text-white sticky top-0 z-[60] h-16 flex items-center shadow-lg">
          <div className="max-w-[1280px] mx-auto w-full px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setCurrentSong(null); setSelectedGenre(null); setSelectedArtist(null); }}>
              <div className="bg-[#38cc63] p-2 rounded-lg"><Music className="text-white w-5 h-5" /></div>
              <span className="font-black text-2xl tracking-tight uppercase">CIFRA<span className="text-[#38cc63]"> MASTER</span></span>
            </div>
            <div className="flex-1 max-w-2xl"><SearchInput onSearch={handleSearch} isLoading={isLoading} /></div>
          </div>
        </header>
      )}

      {/* Exit View Mode Button */}
      {isViewMode && (
        <button 
          onClick={() => setIsViewMode(false)}
          className="fixed top-4 left-4 z-[100] w-12 h-12 bg-white/80 backdrop-blur-md rounded-full border border-gray-200 shadow-xl flex items-center justify-center text-gray-500 hover:text-red-500 transition-all hover:scale-110 active:scale-95"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className={`flex-1 max-w-[1280px] mx-auto w-full pt-6 flex gap-6 mb-20 relative transition-all duration-500 ${isViewMode ? 'px-0 pt-0 max-w-none mb-0' : 'px-4'}`}>
        <main className={`flex-1 min-w-0 bg-white shadow-sm relative transition-all duration-300 ${isViewMode ? 'rounded-none border-none p-6 md:p-20' : 'rounded-xl border border-gray-200 p-4 md:p-10'} ${currentSong && !isViewMode ? 'flex flex-col md:flex-row gap-10' : ''} ${showChordsInSidebar && !isViewMode ? 'md:mr-[280px]' : ''}`}>
          {!currentSong && !selectedGenre && renderHome()}
          {selectedGenre && !selectedArtist && !currentSong && renderArtistsView()}
          {selectedArtist && !currentSong && renderSongsView()}
          
          {currentSong && (
            <>
              {!isViewMode && (
                <aside className="w-full md:w-[200px] shrink-0 flex flex-col gap-2">
                  <button 
                    onClick={handleBack}
                    className="w-full bg-[#38cc63] text-white py-3 rounded-xl font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#2da34f] transition-all mb-2 shadow-lg shadow-[#38cc63]/20 hover:scale-[1.02] active:scale-95 group"
                  >
                     <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {currentSong.artist}
                  </button>

                  <div className="flex items-center justify-between w-full px-3 py-2 bg-white border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Type className="w-4 h-4" />
                      <span className="text-[11px] font-bold uppercase">Texto</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setFontSize(s => Math.max(10, s - 1))} className="p-1 hover:bg-gray-100 rounded-lg"><Minus className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button onClick={() => setFontSize(s => Math.min(30, s + 1))} className="p-1 hover:bg-gray-100 rounded-lg"><Plus className="w-3.5 h-3.5 text-gray-400" /></button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full px-3 py-2 bg-white border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Music className="w-4 h-4" />
                      <span className="text-[11px] font-bold uppercase">Tom</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setTransposition(t => t - 1)} className="p-1 hover:bg-gray-100 rounded-lg"><Minus className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button onClick={() => setTransposition(t => t + 1)} className="p-1 hover:bg-gray-100 rounded-lg"><Plus className="w-3.5 h-3.5 text-gray-400" /></button>
                    </div>
                  </div>

                  <SidebarButton 
                    icon={Eye} 
                    label="Exibir (Performance)" 
                    onClick={() => setIsViewMode(true)} 
                    active={isViewMode}
                  />

                  <SidebarButton 
                    icon={Grid} 
                    label="Acordes" 
                    onClick={() => setShowChordsInSidebar(!showChordsInSidebar)} 
                    active={showChordsInSidebar}
                  />
                  
                  <SidebarButton icon={Activity} label="Afinador" onClick={() => setIsTunerOpen(true)} />
                  
                  <div className="my-2 border-t border-gray-100"></div>

                  <SidebarButton 
                    icon={isCurrentFavorite ? Heart : PlusCircle} 
                    label={isCurrentFavorite ? "Remover favoritos" : "Adicionar à lista"} 
                    onClick={() => toggleFavorite(currentSong)} 
                    active={isCurrentFavorite}
                  />
                  
                  <SidebarButton icon={Timer} label="Metrônomo" onClick={() => setIsMetronomeOpen(true)} />
                  <SidebarButton icon={Download} label="Baixar cifra" onClick={handleDownload} />
                </aside>
              )}

              <div className="flex-1 min-w-0">
                {!isViewMode && (
                  <div className="flex items-center gap-2 mb-8 bg-gray-50 p-2 rounded-2xl border border-gray-100 overflow-x-auto no-scrollbar">
                    {INSTRUMENTS.map((inst) => (
                      <button
                        key={inst.id}
                        onClick={() => setSelectedInstrument(inst.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                          selectedInstrument === inst.id 
                            ? 'bg-[#38cc63] text-white shadow-lg shadow-[#38cc63]/20' 
                            : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300 hover:text-gray-600'
                        }`}
                      >
                        <inst.icon className="w-4 h-4" />
                        {inst.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className={`${isViewMode ? 'mb-14' : 'mb-10'}`}>
                   {!isViewMode && (
                     <div className="flex items-center gap-2 mb-4">
                       <span className="text-[10px] font-black text-[#38cc63] uppercase tracking-widest bg-[#38cc63]/10 px-2 py-0.5 rounded">Tom: {currentSong.originalKey || 'A'}</span>
                     </div>
                   )}
                   <div className="flex items-center justify-between gap-4">
                      <h2 className={`${isViewMode ? 'text-5xl md:text-7xl' : 'text-4xl md:text-5xl'} font-black text-gray-950 tracking-tight leading-none mb-2 uppercase`}>{currentSong.title}</h2>
                      {!isViewMode && (
                        <button 
                          onClick={() => toggleFavorite(currentSong)}
                          className={`p-3 rounded-full transition-all border ${isCurrentFavorite ? 'bg-red-50 border-red-200 text-red-500 shadow-md' : 'bg-white border-gray-100 text-gray-300 hover:text-red-400 hover:border-red-100'}`}
                        >
                           <Heart className={`w-6 h-6 ${isCurrentFavorite ? 'fill-red-500' : ''}`} />
                        </button>
                      )}
                   </div>
                   <h3 className={`${isViewMode ? 'text-2xl' : 'text-xl'} font-medium text-gray-400`}>{currentSong.artist}</h3>
                </div>

                <ChordDisplay content={transposedContent} fontSize={isViewMode ? fontSize * 1.2 : fontSize} instrument={selectedInstrument} />

                {currentSong.sources && currentSong.sources.length > 0 && !isViewMode && (
                  <div className="mt-10 pt-10 border-t border-gray-100">
                    <h4 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-tight flex items-center gap-3">
                      <Globe className="w-5 h-5 text-[#38cc63]" /> Fontes da Cifra (Grounding)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentSong.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-bold text-gray-600 hover:border-[#38cc63] hover:text-[#38cc63] transition-all group"
                        >
                          <LinkIcon className="w-3 h-3 text-gray-400 group-hover:text-[#38cc63]" />
                          <span className="truncate max-w-[200px]">{source.title || 'Ver Fonte'}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {/* Floating Chord Panel (Drawer) - Hidden in View Mode */}
        {currentSong && !isViewMode && (
          <div className={`fixed top-20 right-4 bottom-20 w-[260px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 transition-all duration-500 transform ${showChordsInSidebar ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'}`}>
             <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
                <div className="flex items-center gap-2">
                   <Grid className="w-4 h-4 text-[#38cc63]" />
                   <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">Dicionário da Música</span>
                </div>
                <button onClick={() => setShowChordsInSidebar(false)} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                   <X className="w-4 h-4 text-gray-400" />
                </button>
             </div>
             <div className="overflow-y-auto h-[calc(100%-60px)] p-4 space-y-6 custom-scrollbar">
                <div className="flex flex-col gap-8">
                  {songChords.map(chord => (
                    <div key={chord} className="flex flex-col items-center">
                       <ChordDiagram chord={chord} instrument={selectedInstrument} />
                    </div>
                  ))}
                </div>
                {songChords.length === 0 && (
                  <div className="text-center py-20">
                     <AlertCircle className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Nenhum acorde detectado</p>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* Floating Action Buttons Group */}
      <div className={`fixed bottom-8 right-8 flex flex-col items-center gap-4 z-[80] transition-opacity duration-300 ${isViewMode && !isAutoScrolling ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}>
        
        {/* Floating Auto-scroll Control (Visible only when a song is active) */}
        {currentSong && (
          <div className="flex flex-col items-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
             {/* Speed Selector (Visible when auto-scrolling is on) */}
             {isAutoScrolling && (
               <div className="flex flex-col gap-1.5 mb-2 bg-[#1c1c1c] p-2 rounded-2xl shadow-2xl border border-white/10 animate-in zoom-in-95 origin-bottom">
                 {[2, 1.5, 1, 0.5].map((speed) => (
                   <button
                     key={speed}
                     onClick={() => setScrollSpeed(speed)}
                     className={`w-10 h-10 rounded-xl text-[10px] font-black flex items-center justify-center transition-all ${
                       scrollSpeed === speed 
                         ? 'bg-[#38cc63] text-white shadow-lg shadow-[#38cc63]/20' 
                         : 'text-gray-400 hover:text-white hover:bg-white/5'
                     }`}
                   >
                     {speed}x
                   </button>
                 ))}
               </div>
             )}
             
             {/* Main Auto-scroll Toggle */}
             <button 
               onClick={() => setIsAutoScrolling(!isAutoScrolling)}
               className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all border-4 border-white ${
                 isAutoScrolling 
                  ? 'bg-[#38cc63] text-white shadow-[#38cc63]/40 scale-110' 
                  : 'bg-[#1c1c1c] text-white hover:bg-gray-800'
               }`}
               title="Auto Rolagem"
             >
               <div className="relative">
                 <ArrowUpDown className={`w-7 h-7 ${isAutoScrolling ? 'animate-bounce' : ''}`} />
                 {isAutoScrolling && (
                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
                 )}
               </div>
             </button>
          </div>
        )}

        {/* João Assistant Button - Hidden in view mode to focus on lyrics, unless auto-scrolling is off */}
        {(!isViewMode || !isAutoScrolling) && !isJoaoOpen && (
          <button 
            onClick={() => setIsJoaoOpen(true)} 
            className="w-16 h-16 bg-[#1c1c1c] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group border-4 border-white"
            title="Assistente João"
          >
            <Guitar className="text-yellow-400 w-8 h-8" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#38cc63] rounded-full border-4 border-white"></div>
          </button>
        )}
      </div>

      <JoaoAssistant isOpen={isJoaoOpen} onClose={() => setIsJoaoOpen(false)} onSongFound={handleSongSelect} />
      <Tuner isOpen={isTunerOpen} onClose={() => setIsTunerOpen(false)} />
      <Metronome isOpen={isMetronomeOpen} onClose={() => setIsMetronomeOpen(false)} />
    </div>
  );
};

export default App;
