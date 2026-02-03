
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Play, Pause, Grid, Music, Heart, X, Bot, Link as LinkIcon, 
  Globe, ChevronRight, Menu, Search, Video, Settings, ChevronDown, 
  Maximize2, Type as FontIcon, Minus, Plus, Share2, Guitar, Star, Users, Flame, Disc, ArrowLeft, CheckCircle2,
  ArrowUpDown, Type, PlusCircle, Timer, Activity, Folder, ExternalLink, Info, Download, PlayCircle,
  Keyboard, Monitor, Youtube, Sparkles, Zap, AlertCircle, Eye, User, LogIn, Mail, Lock, LogOut, Home, ChevronUp, PlusSquare,
  Upload, FileJson, FileText, Save, Trash2, Smartphone, Minimize2, BookOpen
} from 'lucide-react';
import { ExtendedSong, ZEZE_SONGS, JULIANY_SOUZA_SONGS, RICK_RENNER_SONGS, COMMUNITY_SONGS } from './constants';
import { findChordsWithAI } from './services/geminiService';
import { transposeContent } from './utils/musicUtils';
import SearchInput from './components/SearchInput';
import ChordDisplay from './components/ChordDisplay';
import ChordDiagram from './components/ChordDiagram';
import Tuner from './components/Tuner';
import Metronome from './components/Metronome';
import SongSubmission from './components/SongSubmission';
import DownloadModal from './components/DownloadModal';
import ChordDictionary from './components/ChordDictionary';

const GENRES = ['Sertanejo', 'Rock', 'Pop', 'Reggae', 'Gospel', 'Forró', 'MPB', 'Samba', 'Sofrência'];
const SCROLL_SPEEDS = [0.5, 1, 1.5, 2, 3];

const App: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<ExtendedSong | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transposition, setTransposition] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [isTunerOpen, setIsTunerOpen] = useState(false);
  const [isMetronomeOpen, setIsMetronomeOpen] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isChordDictOpen, setIsChordDictOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState('Violão');
  
  // Estados de dados
  const [favorites, setFavorites] = useState<ExtendedSong[]>([]);
  const [userSongs, setUserSongs] = useState<ExtendedSong[]>([]);
  const [communitySongs, setCommunitySongs] = useState<ExtendedSong[]>(() => {
    const saved = localStorage.getItem('cifra_master_community_songs');
    const base = [...COMMUNITY_SONGS, ...ZEZE_SONGS, ...JULIANY_SOUZA_SONGS, ...RICK_RENNER_SONGS];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...base.filter(b => !parsed.some((p: any) => p.id === b.id))];
      } catch (e) { return base; }
    }
    return base;
  });

  const [isFavFolderOpen, setIsFavFolderOpen] = useState(true);
  const [isUserSongsOpen, setIsUserSongsOpen] = useState(true);
  const [isCommunityOpen, setIsCommunityOpen] = useState(true);
  const [isViewMode, setIsViewMode] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) {
      setIsDownloadModalOpen(true);
      return;
    }
    installPrompt.prompt();
    installPrompt.userChoice.then(() => {
      setInstallPrompt(null);
      setIsDownloadModalOpen(false);
    });
  };

  const goHome = useCallback(() => {
    setCurrentSong(null);
    setSelectedGenre(null);
    setIsViewMode(false);
    setIsAuthModalOpen(false);
    setIsSubmissionOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Persistência
  useEffect(() => {
    const savedUser = localStorage.getItem('cifra_master_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    const savedFavs = localStorage.getItem('cifra_master_favorites');
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
    }

    const savedUserSongs = localStorage.getItem('cifra_master_user_songs');
    if (savedUserSongs) {
      try { setUserSongs(JSON.parse(savedUserSongs)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cifra_master_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cifra_master_user_songs', JSON.stringify(userSongs));
  }, [userSongs]);

  useEffect(() => {
    const customCommunity = communitySongs.filter(s => s.id.startsWith('user-'));
    localStorage.setItem('cifra_master_community_songs', JSON.stringify(customCommunity));
  }, [communitySongs]);

  const toggleFavorite = useCallback((song: ExtendedSong) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setFavorites(prev => {
      const isFav = prev.some(f => f.id === song.id);
      if (isFav) return prev.filter(f => f.id !== song.id);
      return [...prev, song];
    });
  }, [currentUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = { name: 'Músico Convidado', email: 'musico@ciframaster.com' };
    setCurrentUser(user);
    localStorage.setItem('cifra_master_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cifra_master_user');
  };

  const isCurrentFavorite = useMemo(() => {
    return currentSong ? favorites.some(f => f.id === currentSong.id) : false;
  }, [currentSong, favorites]);

  const handleSongSubmission = (song: ExtendedSong) => {
    if (song.isPublic) {
      setCommunitySongs(prev => [song, ...prev]);
      setIsCommunityOpen(true);
    } else {
      setUserSongs(prev => [song, ...prev]);
      setIsUserSongsOpen(true);
    }
  };

  const deleteUserSong = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Deseja excluir esta cifra do seu repertório local?")) {
      setUserSongs(prev => prev.filter(s => s.id !== id));
      setCommunitySongs(prev => prev.filter(s => s.id !== id));
      if (currentSong?.id === id) setCurrentSong(null);
    }
  };

  const handleSongSelect = useCallback((song: ExtendedSong) => {
    setCurrentSong(song);
    setTransposition(0);
    setFontSize(16);
    setIsAutoScrolling(false);
    setScrollSpeed(1);
    setIsViewMode(false);
    setIsSubmissionOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    const q = query.toLowerCase();
    const allAvailable = [...userSongs, ...communitySongs];
    const match = allAvailable.find(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
    
    if (match) { handleSongSelect(match); return; }
    
    setIsLoading(true);
    const aiSong = await findChordsWithAI(query);
    if (aiSong) handleSongSelect(aiSong as ExtendedSong);
    setIsLoading(false);
  }, [handleSongSelect, userSongs, communitySongs]);

  const handleBack = () => {
    if (currentSong) { setCurrentSong(null); setIsViewMode(false); }
    else if (selectedGenre) setSelectedGenre(null);
  };

  useEffect(() => {
    let interval: any;
    if (isAutoScrolling) {
      interval = setInterval(() => { 
        window.scrollBy(0, 1); 
      }, 80 / scrollSpeed);
    }
    return () => clearInterval(interval);
  }, [isAutoScrolling, scrollSpeed]);

  const transposedContent = useMemo(() => {
    if (!currentSong) return '';
    return transposeContent(currentSong.content, transposition);
  }, [currentSong, transposition]);

  const songChords = useMemo(() => {
    if (!currentSong) return [];
    const chords = new Set<string>();
    const matches = transposedContent.match(/\[(.*?)\]/g);
    if (matches) {
      matches.forEach(m => {
        const chord = m.slice(1, -1).trim();
        if (chord.length <= 8) chords.add(chord); 
      });
    }
    return Array.from(chords);
  }, [transposedContent, currentSong]);

  const handleDownload = useCallback(() => {
    if (!currentSong) return;
    const blob = new Blob([transposedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentSong.artist} - ${currentSong.title}.txt`;
    link.click();
  }, [currentSong, transposedContent]);

  const filteredCommunitySongs = useMemo(() => {
    if (!selectedGenre) return communitySongs;
    return communitySongs.filter(s => s.genre === selectedGenre);
  }, [communitySongs, selectedGenre]);

  const SidebarButton = ({ icon: Icon, label, onClick, children, active, primary }: any) => (
    <button onClick={onClick} className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl border transition-all group ${
        primary ? 'bg-[#22c55e] border-[#22c55e] text-white shadow-lg shadow-[#22c55e]/20' : active ? 'bg-[#22c55e]/5 border-[#22c55e]/30 text-[#22c55e]' : 'bg-white border-gray-200 hover:border-gray-400'
      }`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${primary ? 'text-white' : active ? 'text-[#22c55e]' : 'text-gray-400'}`} />
        <span className={`text-[11px] font-bold uppercase ${primary ? 'text-white' : active ? 'text-[#22c55e]' : 'text-gray-600'}`}>{label}</span>
      </div>
      {children}
    </button>
  );

  const renderHome = () => (
    <div className="py-2">
      <div className="mb-10 p-8 bg-gradient-to-r from-[#1c1c1c] to-[#2a2a2a] rounded-[2.5rem] text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#22c55e]/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
              <div className="flex items-center gap-3 text-[#22c55e] mb-4">
                  <Globe className="w-5 h-5 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Seu Estúdio Digital Global</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">Sua Jornada <br/><span className="text-[#22c55e]">Cifrada</span> Começa Aqui</h1>
              <p className="text-gray-400 max-w-lg text-sm font-medium leading-relaxed mb-6">Envie suas cifras do computador, escolha o ritmo e salve para que todos na comunidade possam tocar juntos.</p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setIsSubmissionOpen(true)}
                  className="px-8 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-[#22c55e]/20"
                >
                  Publicar do meu PC
                </button>
                <button 
                  onClick={() => setIsTunerOpen(true)}
                  className="px-8 py-3 bg-white text-black hover:bg-[#22c55e] hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl"
                >
                  Abrir Afinador
                </button>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Card do Afinador */}
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
           <button onClick={() => setIsTunerOpen(true)} className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#0a0a0a] rounded-3xl shadow-2xl border-2 border-[#22c55e]/60 hover:bg-black transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#00ff66] animate-pulse shadow-[0_0_15px_#00ff66]"></div>
              </div>
              <div className="w-20 h-20 bg-[#22c55e]/10 rounded-2xl flex items-center justify-center border border-[#22c55e]/30 mb-5 group-hover:scale-110 transition-transform">
                 <Activity className="text-[#00ff66] w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-2">Afinador</h2>
              <p className="text-[10px] font-black text-[#00ff66] uppercase tracking-[0.5em]">Live • Cromático</p>
           </button>
        </div>

        {/* Card Favoritos */}
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
           <button onClick={() => setIsFavFolderOpen(!isFavFolderOpen)} className="w-full h-full flex flex-col p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-[#22c55e]/30 transition-all group relative">
              <div className="flex items-center justify-between w-full mb-6">
                 <div className="w-14 h-14 bg-[#22c55e]/10 rounded-2xl flex items-center justify-center border border-[#22c55e]/20">
                    <Heart className="text-[#22c55e] w-7 h-7 fill-[#22c55e]/20" />
                 </div>
                 <ChevronDown className={`w-6 h-6 text-gray-300 transition-transform duration-300 ${isFavFolderOpen ? 'rotate-180' : ''}`} />
              </div>
              <div className="text-left">
                 <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Favoritos</h2>
                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{favorites.length} músicas salvas</p>
              </div>
           </button>
        </div>

        {/* Card Feed Global */}
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
           <button onClick={() => setIsCommunityOpen(!isCommunityOpen)} className="w-full h-full flex flex-col p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-[#22c55e]/30 transition-all group relative">
              <div className="flex items-center justify-between w-full mb-6">
                 <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-100">
                    <Users className="text-white w-7 h-7" />
                 </div>
                 <ChevronDown className={`w-6 h-6 text-gray-300 transition-transform ${isCommunityOpen ? 'rotate-180' : ''}`} />
              </div>
              <div className="text-left">
                 <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Feed da Comunidade</h2>
                 <p className="text-[11px] font-bold text-[#22c55e] uppercase tracking-widest">{communitySongs.length} músicas compartilhadas</p>
              </div>
           </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3"><Disc className="text-[#22c55e] w-7 h-7" /> Navegar por Ritmo</h1>
        {selectedGenre && (
          <button onClick={() => setSelectedGenre(null)} className="text-[10px] font-black uppercase text-gray-400 hover:text-[#22c55e]">Limpar Filtro</button>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
        {GENRES.map((genre) => (
          <button 
            key={genre} 
            onClick={() => setSelectedGenre(genre)} 
            className={`group relative h-24 rounded-2xl overflow-hidden shadow-lg border-2 transition-all ${selectedGenre === genre ? 'border-[#22c55e]' : 'border-transparent hover:border-[#22c55e]/50'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-black opacity-90 ${selectedGenre === genre ? 'opacity-100' : 'group-hover:opacity-100'}`}></div>
            <div className="relative h-full flex flex-col items-center justify-center p-4">
               <span className={`font-black text-xs uppercase tracking-widest transition-colors ${selectedGenre === genre ? 'text-[#22c55e]' : 'text-white'}`}>{genre}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-8 mb-12">
        {isFavFolderOpen && favorites.length > 0 && (
          <div className="animate-in slide-in-from-top-4 duration-500">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Suas Favoritas</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {favorites.map((song) => (
                  <div key={song.id} onClick={() => handleSongSelect(song)} className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#22c55e] hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex-1 min-w-0 pr-3">
                      <h4 className="font-bold text-gray-800 text-sm truncate group-hover:text-[#22c55e]">{song.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{song.artist}</p>
                    </div>
                    <Play className="w-4 h-4 text-gray-300 group-hover:text-[#22c55e] group-hover:scale-125 transition-all" />
                  </div>
                ))}
             </div>
          </div>
        )}

        {isCommunityOpen && (
          <div className="animate-in slide-in-from-top-4 duration-500">
             <div className="flex items-center justify-between mb-4 ml-2">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                  {selectedGenre ? `Feed Global: ${selectedGenre}` : "Recém Compartilhadas"}
                </h3>
             </div>
             {filteredCommunitySongs.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredCommunitySongs.map((song) => (
                    <div key={song.id} onClick={() => handleSongSelect(song)} className="group flex flex-col p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#22c55e] hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#22c55e] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-gray-100 text-gray-400 rounded group-hover:bg-[#22c55e]/10 group-hover:text-[#22c55e] transition-colors">{song.genre}</span>
                        {song.id.startsWith('user-') && <Users className="w-3 h-3 text-gray-200" />}
                      </div>
                      <div className="flex-1 min-w-0 pr-3">
                        <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-[#22c55e]">{song.title}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{song.artist}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                         <span className="text-[8px] text-gray-300 font-bold uppercase">Por {song.author || 'Músico Master'}</span>
                         <PlayCircle className="w-5 h-5 text-gray-200 group-hover:text-[#22c55e] transition-all" />
                      </div>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="py-12 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 text-center flex flex-col items-center">
                  <Music className="w-12 h-12 text-gray-200 mb-4" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nenhuma cifra de {selectedGenre} ainda.</p>
                  <button onClick={() => setIsSubmissionOpen(true)} className="mt-4 text-[10px] font-black uppercase text-[#22c55e] hover:underline">Seja o primeiro a enviar!</button>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col font-sans relative">
      {!isViewMode && (
        <header className="bg-[#1c1c1c] text-white sticky top-0 z-[60] h-16 flex items-center shadow-lg px-4">
          <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 cursor-pointer" onClick={goHome}>
              <div className="bg-[#1c1c1c] p-2 rounded-lg border border-[#22c55e] shadow-md shadow-[#22c55e]/20 flex items-center justify-center">
                <Guitar className="text-[#22c55e] w-5 h-5" />
              </div>
              <span className="font-black text-2xl tracking-tight uppercase">CIFRA<span className="text-[#22c55e]"> MASTER</span></span>
            </div>
            <div className="flex-1 max-w-xl mx-4"><SearchInput onSearch={handleSearch} isLoading={isLoading} /></div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSubmissionOpen(true)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
              >
                <PlusSquare className="w-4 h-4 text-[#22c55e]" /> Adicionar Cifra
              </button>
              <button onClick={handleInstallClick} className="flex items-center gap-2 px-4 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"><Smartphone className="w-4 h-4" /> APK</button>
              {currentUser ? (
                <button onClick={handleLogout} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-500 transition-all"><LogOut className="w-5 h-5" /></button>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="hidden sm:flex items-center gap-2 px-5 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl text-xs font-black shadow-lg"><User className="w-4 h-4" /> Entrar</button>
              )}
            </div>
          </div>
        </header>
      )}

      <div className={`flex-1 max-w-[1280px] mx-auto w-full pt-6 flex gap-6 relative ${isViewMode ? 'px-0 pt-0 max-w-none' : 'px-4'}`}>
        <main className={`flex-1 min-w-0 bg-white relative transition-all duration-300 ${isViewMode ? 'p-6 md:p-20 pt-10' : 'rounded-xl border border-gray-200 p-4 md:p-10'} ${currentSong && !isViewMode ? 'flex flex-col md:flex-row gap-10' : ''}`}>
          
          {isViewMode && (
            <button 
              onClick={() => setIsViewMode(false)}
              className="fixed top-6 right-6 z-[100] w-12 h-12 bg-[#1c1c1c] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-gray-800 transition-all border-2 border-white"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          )}

          {!currentSong && renderHome()}
          
          {currentSong && (
            <>
              {!isViewMode && (
                <aside className="w-full md:w-[200px] shrink-0 flex flex-col gap-2">
                  <button onClick={handleBack} className="w-full bg-[#22c55e] text-white py-3 rounded-xl font-black text-[12px] uppercase shadow-lg mb-2"><ArrowLeft className="w-4 h-4 inline mr-2"/> {currentSong.artist}</button>
                  <SidebarButton icon={Activity} label="Afinador" onClick={() => setIsTunerOpen(true)} />
                  <SidebarButton icon={Timer} label="Metrônomo" onClick={() => setIsMetronomeOpen(true)} />
                  <SidebarButton icon={Heart} label={isCurrentFavorite ? "Remover" : "Favoritar"} onClick={() => toggleFavorite(currentSong)} active={isCurrentFavorite} />
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Tamanho da Letra</p>
                    <div className="flex items-center justify-between bg-white rounded-xl border p-1">
                      <button onClick={() => setFontSize(Math.max(10, fontSize - 2))} className="p-2 text-gray-500 hover:text-[#22c55e] transition-colors"><Minus className="w-4 h-4" /></button>
                      <span className="text-xs font-black text-gray-900">{fontSize}</span>
                      <button onClick={() => setFontSize(Math.min(40, fontSize + 2))} className="p-2 text-gray-500 hover:text-[#22c55e] transition-colors"><Plus className="w-4 h-4" /></button>
                    </div>

                    <button onClick={() => setIsChordDictOpen(true)} className="w-full flex items-center justify-center gap-2 py-3 bg-[#1c1c1c] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#22c55e] transition-all shadow-md border border-[#22c55e]/30">
                      <BookOpen className="w-4 h-4 text-[#22c55e]" /> Dicionário
                    </button>

                    <button onClick={() => setIsViewMode(true)} className="w-full flex items-center justify-center gap-2 py-3 bg-[#1c1c1c] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md">
                      <Eye className="w-4 h-4 text-[#22c55e]" /> Modo Leitura
                    </button>
                  </div>

                  <SidebarButton icon={Download} label="Baixar" onClick={handleDownload} />
                  <SidebarButton icon={Smartphone} label="Instalar App" onClick={handleInstallClick} primary />
                </aside>
              )}

              <div className={`flex-1 min-w-0 ${isViewMode ? 'mx-auto max-w-4xl' : ''}`}>
                <div className={`${isViewMode ? 'mb-14 text-center' : 'mb-10'}`}>
                   {currentSong.isPublic && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-full mb-4">
                        <Globe className="w-3 h-3 text-[#22c55e]" />
                        <span className="text-[8px] font-black uppercase text-[#22c55e]">Cifra da Comunidade</span>
                      </div>
                   )}
                   <h2 className={`${isViewMode ? 'text-6xl md:text-8xl' : 'text-5xl'} font-black text-gray-950 uppercase mb-2 tracking-tight transition-all duration-500`}>{currentSong.title}</h2>
                   <h3 className={`${isViewMode ? 'text-2xl' : 'text-xl'} font-medium text-gray-400 transition-all duration-500`}>{currentSong.artist}</h3>
                </div>
                <ChordDisplay content={transposedContent} fontSize={fontSize} instrument={selectedInstrument} />
              </div>
            </>
          )}
        </main>
      </div>

      <div className={`fixed bottom-6 right-6 flex flex-col items-center gap-3 z-[80] transition-all duration-300 ${isViewMode && !isAutoScrolling ? 'opacity-40 hover:opacity-100' : ''}`}>
        {currentSong && (
          <>
             {isViewMode && (
                <div className="flex flex-col gap-2 mb-2 p-2 bg-[#1c1c1c] rounded-full shadow-2xl border-4 border-white animate-in slide-in-from-bottom-4">
                  <button onClick={() => setFontSize(Math.min(40, fontSize + 2))} className="w-10 h-10 flex items-center justify-center text-[#22c55e] hover:bg-white/10 rounded-full"><Plus className="w-5 h-5" /></button>
                  <button onClick={() => setIsChordDictOpen(true)} className="w-10 h-10 flex items-center justify-center text-[#22c55e] hover:bg-white/10 rounded-full"><BookOpen className="w-5 h-5" /></button>
                  <button onClick={() => setFontSize(Math.max(10, fontSize - 2))} className="w-10 h-10 flex items-center justify-center text-[#22c55e] hover:bg-white/10 rounded-full"><Minus className="w-5 h-5" /></button>
                </div>
             )}

             {isAutoScrolling && (
               <div className="flex flex-col gap-2 p-2 bg-[#1c1c1c] rounded-3xl shadow-2xl border-4 border-white animate-in slide-in-from-bottom-4 mb-2">
                 {SCROLL_SPEEDS.map(speed => (
                   <button 
                     key={speed} 
                     onClick={() => setScrollSpeed(speed)}
                     className={`w-10 h-10 flex items-center justify-center text-[10px] font-black rounded-full transition-all ${scrollSpeed === speed ? 'bg-[#22c55e] text-white' : 'text-white hover:bg-white/10'}`}
                   >
                     {speed}x
                   </button>
                 ))}
               </div>
             )}

             <button onClick={scrollToTop} className="w-11 h-11 bg-[#1c1c1c] text-[#22c55e] rounded-full flex items-center justify-center shadow-2xl border-4 border-white active:scale-95 transition-all"><ChevronUp className="w-5 h-5" /></button>
             
             <div className="relative group">
                <button 
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)} 
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transition-all active:scale-90 ${isAutoScrolling ? 'bg-[#22c55e] text-white scale-110' : 'bg-[#1c1c1c] text-white'}`}
                >
                  <ArrowUpDown className="w-6 h-6" />
                </button>
                {isAutoScrolling && (
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#1c1c1c] text-white text-[8px] font-black rounded-md border border-white/20 whitespace-nowrap animate-in fade-in zoom-in">
                    {scrollSpeed}x SPEED
                  </div>
                )}
             </div>
          </>
        )}
      </div>

      <Tuner isOpen={isTunerOpen} onClose={() => setIsTunerOpen(false)} />
      <Metronome isOpen={isMetronomeOpen} onClose={() => setIsMetronomeOpen(false)} />
      <ChordDictionary isOpen={isChordDictOpen} onClose={() => setIsChordDictOpen(false)} chords={songChords} instrument={selectedInstrument} onInstrumentChange={setSelectedInstrument} />
      <SongSubmission isOpen={isSubmissionOpen} onClose={() => setIsSubmissionOpen(false)} onSubmit={handleSongSubmission} defaultGenre={selectedGenre} currentUser={currentUser} />
      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} onInstall={handleInstallClick} isInstallAvailable={!!installPrompt} />
      
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="relative w-full max-sm bg-white rounded-3xl p-8 shadow-2xl">
              <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-4 right-4 text-gray-400"><X className="w-5 h-5" /></button>
              <h3 className="text-2xl font-black text-gray-950 text-center uppercase mb-8">Acesse seu Palco</h3>
              <form onSubmit={handleLogin} className="space-y-4">
                  <input type="email" placeholder="E-mail" required className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#22c55e] rounded-xl outline-none" />
                  <input type="password" placeholder="Senha" required className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#22c55e] rounded-xl outline-none" />
                  <button type="submit" className="w-full py-4 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl font-black text-xs uppercase shadow-lg">Entrar</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
