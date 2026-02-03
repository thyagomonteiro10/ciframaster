
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Play, Pause, Grid, Music, Heart, X, Bot, Link as LinkIcon, 
  Globe, ChevronRight, Menu, Search, Video, Settings, ChevronDown, 
  Maximize2, Type as FontIcon, Minus, Plus, Share2, Guitar, Star, Users, Flame, Disc, ArrowLeft, CheckCircle2,
  ArrowUpDown, Type, PlusCircle, Timer, Activity, Folder, ExternalLink, Info, Download, PlayCircle,
  Keyboard, Monitor, Youtube, Sparkles, Zap, AlertCircle, Eye, User, LogIn, Mail, Lock, LogOut, Home, ChevronUp, PlusSquare
} from 'lucide-react';
import { ExtendedSong, ZEZE_SONGS, JULIANY_SOUZA_SONGS, RICK_RENNER_SONGS } from './constants';
import { findChordsWithAI } from './services/geminiService';
import { transposeContent } from './utils/musicUtils';
import SearchInput from './components/SearchInput';
import ChordDisplay from './components/ChordDisplay';
import ChordDiagram from './components/ChordDiagram';
import Tuner from './components/Tuner';
import Metronome from './components/Metronome';
import SongSubmission from './components/SongSubmission';

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
  const [isTunerOpen, setIsTunerOpen] = useState(false);
  const [isMetronomeOpen, setIsMetronomeOpen] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState('Violão');
  const [showChordsInSidebar, setShowChordsInSidebar] = useState(false);
  const [favorites, setFavorites] = useState<ExtendedSong[]>([]);
  const [userSongs, setUserSongs] = useState<ExtendedSong[]>([]);
  const [isFavFolderOpen, setIsFavFolderOpen] = useState(true);
  const [isUserSongsOpen, setIsUserSongsOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  
  // Auth States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Helper to go back home
  const goHome = useCallback(() => {
    setCurrentSong(null);
    setSelectedGenre(null);
    setSelectedArtist(null);
    setIsViewMode(false);
    setIsAuthModalOpen(false);
    setIsSubmissionOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Load user, favorites and user songs from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('cifra_master_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const savedFavs = localStorage.getItem('cifra_master_favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error("Erro ao carregar favoritos", e);
      }
    }

    const savedUserSongs = localStorage.getItem('cifra_master_user_songs');
    if (savedUserSongs) {
      try {
        setUserSongs(JSON.parse(savedUserSongs));
      } catch (e) {
        console.error("Erro ao carregar contribuições", e);
      }
    }
  }, []);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('cifra_master_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save user songs to local storage
  useEffect(() => {
    localStorage.setItem('cifra_master_user_songs', JSON.stringify(userSongs));
  }, [userSongs]);

  const toggleFavorite = useCallback((song: ExtendedSong) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setFavorites(prev => {
      const isFav = prev.some(f => f.id === song.id);
      if (isFav) {
        return prev.filter(f => f.id !== song.id);
      } else {
        return [...prev, song];
      }
    });
  }, [currentUser]);

  const handleSongSubmission = (song: ExtendedSong) => {
    setUserSongs(prev => [song, ...prev]);
    setIsUserSongsOpen(true);
    // Auto select the new song
    handleSongSelect(song);
  };

  const isCurrentFavorite = useMemo(() => {
    if (!currentSong) return false;
    return favorites.some(f => f.id === currentSong.id);
  }, [favorites, currentSong]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = { name: 'Mestre da Música', email: 'musico@ciframaster.com' };
    setCurrentUser(user);
    localStorage.setItem('cifra_master_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cifra_master_user');
  };

  const handleSongSelect = useCallback((song: ExtendedSong) => {
    setCurrentSong(song);
    setTransposition(0);
    setFontSize(16);
    setIsAutoScrolling(false);
    setScrollSpeed(1);
    setShowChordsInSidebar(false);
    setIsViewMode(false);
    setIsSubmissionOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    const q = query.toLowerCase();
    
    // Check user songs first
    const userMatch = userSongs.find(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
    if (userMatch) {
      handleSongSelect(userMatch);
      return;
    }

    if (q.includes('juliany souza') || q.includes('quem é esse')) {
       handleSongSelect(JULIANY_SOUZA_SONGS[0]);
       return;
    }
    if (q.includes('rick') || q.includes('demais')) {
       handleSongSelect(RICK_RENNER_SONGS[0]);
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
  }, [handleSongSelect, userSongs]);

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

  const groupedContent = useMemo(() => {
    const allSongs = [...ZEZE_SONGS, ...JULIANY_SOUZA_SONGS, ...RICK_RENNER_SONGS, ...userSongs];
    const map: Record<string, Record<string, ExtendedSong[]>> = {};
    allSongs.forEach(song => {
      if (!map[song.genre]) map[song.genre] = {};
      if (!map[song.genre][song.artist]) map[song.genre][song.artist] = [];
      map[song.genre][song.artist].push(song);
    });
    return map;
  }, [userSongs]);

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

  const renderHome = () => (
    <div className="py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Favoritos */}
        {favorites.length > 0 && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
             <button 
               onClick={() => setIsFavFolderOpen(!isFavFolderOpen)}
               className="w-full flex items-center justify-between p-4 bg-[#1c1c1c] rounded-2xl shadow-xl border border-white/5 hover:bg-gray-800 transition-all group"
             >
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-[#38cc63]/20 rounded-xl flex items-center justify-center border border-[#38cc63]/30">
                      <Heart className="text-[#38cc63] w-5 h-5 fill-[#38cc63]/20" />
                   </div>
                   <div className="text-left">
                      <h2 className="text-lg font-black text-white tracking-tight uppercase">Meus Favoritos</h2>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{favorites.length} músicas</p>
                   </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isFavFolderOpen ? 'rotate-180' : ''}`} />
             </button>
             
             {isFavFolderOpen && (
               <div className="mt-3 grid grid-cols-1 gap-2 animate-in slide-in-from-top-2 duration-300 origin-top">
                  {favorites.slice(0, 5).map((song) => (
                    <div 
                      key={song.id} 
                      onClick={() => handleSongSelect(song)}
                      className="group flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-[#38cc63] transition-all cursor-pointer"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <h4 className="font-bold text-gray-800 text-xs truncate group-hover:text-[#38cc63]">{song.title}</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight truncate">{song.artist}</p>
                      </div>
                      <Play className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#38cc63]" />
                    </div>
                  ))}
               </div>
             )}
          </div>
        )}

        {/* Minhas Contribuições */}
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
           <button 
             onClick={() => setIsUserSongsOpen(!isUserSongsOpen)}
             className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#38cc63] transition-all group"
           >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-[#38cc63]/10 group-hover:border-[#38cc63]/30 transition-all">
                    <PlusSquare className="text-gray-400 w-5 h-5 group-hover:text-[#38cc63] transition-colors" />
                 </div>
                 <div className="text-left">
                    <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">Minhas Cifras</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{userSongs.length} contribuições</p>
                 </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${isUserSongsOpen ? 'rotate-180' : ''}`} />
           </button>
           
           {isUserSongsOpen && (
             <div className="mt-3 grid grid-cols-1 gap-2 animate-in slide-in-from-top-2 duration-300 origin-top">
                {userSongs.length > 0 ? (
                  userSongs.slice(0, 5).map((song) => (
                    <div 
                      key={song.id} 
                      onClick={() => handleSongSelect(song)}
                      className="group flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-[#38cc63] transition-all cursor-pointer"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <h4 className="font-bold text-gray-800 text-xs truncate group-hover:text-[#38cc63]">{song.title}</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight truncate">{song.artist}</p>
                      </div>
                      <div className="px-2 py-0.5 bg-gray-50 rounded text-[8px] font-black text-gray-400 uppercase">Draft</div>
                    </div>
                  ))
                ) : (
                  <button 
                    onClick={() => setIsSubmissionOpen(true)}
                    className="p-8 border-2 border-dashed border-gray-100 rounded-xl text-center hover:border-[#38cc63]/30 transition-all group"
                  >
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-[#38cc63]">Nenhuma cifra enviada</p>
                    <span className="text-[9px] font-bold text-[#38cc63] mt-2 block">Clique para enviar a primeira</span>
                  </button>
                )}
             </div>
           )}
        </div>
      </div>

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
            onClick={() => { setSelectedGenre(genre); setSelectedArtist(null); setCurrentSong(null); }}
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
            <div className="flex items-center gap-4 cursor-pointer" onClick={goHome}>
              <div className="bg-[#38cc63] p-2 rounded-lg"><Music className="text-white w-5 h-5" /></div>
              <span className="font-black text-2xl tracking-tight uppercase">CIFRA<span className="text-[#38cc63]"> MASTER</span></span>
            </div>
            
            <div className="flex-1 max-w-xl mx-4"><SearchInput onSearch={handleSearch} isLoading={isLoading} /></div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSubmissionOpen(true)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
              >
                <PlusSquare className="w-4 h-4 text-[#38cc63]" /> Enviar Música
              </button>

              {currentUser ? (
                <div className="flex items-center gap-3 pl-3 border-l border-white/10 group">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Bem-vindo,</p>
                    <p className="text-xs font-bold text-white truncate max-w-[120px]">{currentUser.name}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-500 transition-all group"
                    title="Sair"
                  >
                    <LogOut className="w-5 h-5 group-hover:scale-90 transition-transform" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-[#38cc63] hover:bg-[#2da34f] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#38cc63]/20"
                >
                  <User className="w-4 h-4" /> Entrar
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300">
           <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-all text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="p-6 pt-8">
                 <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 bg-[#38cc63] rounded-2xl flex items-center justify-center shadow-xl shadow-[#38cc63]/20">
                       <Guitar className="w-7 h-7 text-white" />
                    </div>
                 </div>
                 
                 <h3 className="text-2xl font-black text-gray-950 text-center uppercase tracking-tight mb-1">
                   {isRegisterMode ? 'Criar Conta' : 'Acesse seu Palco'}
                 </h3>
                 <p className="text-gray-400 text-center text-xs mb-8">
                   Sincronize seus favoritos em qualquer lugar.
                 </p>

                 <form onSubmit={handleLogin} className="space-y-3">
                    {isRegisterMode && (
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Nome Completo" 
                          required
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#38cc63] rounded-xl outline-none transition-all font-bold text-sm"
                        />
                      </div>
                    )}
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input 
                         type="email" 
                         placeholder="E-mail" 
                         required
                         className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#38cc63] rounded-xl outline-none transition-all font-bold text-sm"
                       />
                    </div>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                       <input 
                         type="password" 
                         placeholder="Senha" 
                         required
                         className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#38cc63] rounded-xl outline-none transition-all font-bold text-sm"
                       />
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full py-4 bg-[#38cc63] hover:bg-[#2da34f] text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#38cc63]/10 hover:scale-[1.01] active:scale-95"
                    >
                       {isRegisterMode ? 'Registrar Agora' : 'Entrar no Sistema'}
                    </button>
                 </form>

                 <div className="mt-6 flex flex-col items-center gap-4">
                    <button 
                      onClick={() => setIsRegisterMode(!isRegisterMode)}
                      className="text-[9px] font-black uppercase text-gray-400 tracking-widest hover:text-[#38cc63] transition-colors"
                    >
                      {isRegisterMode ? 'Já tem conta? Entrar' : 'Novo por aqui? Criar conta'}
                    </button>
                    
                    <div className="flex items-center gap-3 w-full">
                       <div className="flex-1 h-px bg-gray-100"></div>
                       <span className="text-[9px] font-bold text-gray-300 uppercase">Ou</span>
                       <div className="flex-1 h-px bg-gray-100"></div>
                    </div>

                    <div className="flex gap-3 w-full">
                       <button className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                          <img src="https://www.google.com/favicon.ico" className="w-3.5 h-3.5 grayscale" alt="Google" />
                          <span className="text-[10px] font-bold text-gray-500">Google</span>
                       </button>
                       <button className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                          <Monitor className="w-3.5 h-3.5 text-black" />
                          <span className="text-[10px] font-bold text-gray-500">Apple</span>
                       </button>
                    </div>

                    <button 
                      onClick={goHome}
                      className="mt-2 flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-600 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      <Home className="w-3 h-3" /> Início
                    </button>
                 </div>
              </div>
           </div>
        </div>
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
          {selectedGenre && !selectedArtist && !currentSong && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button onClick={handleBack} className="flex items-center gap-2 text-[10px] font-black text-[#38cc63] uppercase tracking-[0.2em] mb-8">
                <ArrowLeft className="w-4 h-4" /> Voltar aos Gêneros
              </button>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase mb-12">{selectedGenre}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(groupedContent[selectedGenre!] || {}).map((artist) => (
                  <button key={artist} onClick={() => { setSelectedArtist(artist); setCurrentSong(null); }} className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#38cc63] p-5 text-left transition-all hover:shadow-lg">
                     <h3 className="font-black text-gray-900 uppercase tracking-tight group-hover:text-[#38cc63]">{artist}</h3>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{groupedContent[selectedGenre!][artist].length} músicas</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {selectedArtist && !currentSong && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button onClick={handleBack} className="flex items-center gap-2 text-[10px] font-black text-[#38cc63] uppercase tracking-[0.2em] mb-8">
                <ArrowLeft className="w-4 h-4" /> Voltar para {selectedGenre}
              </button>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-12">{selectedArtist}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(groupedContent[selectedGenre!]?.[selectedArtist!] || []).map((song) => (
                  <div key={song.id} onClick={() => handleSongSelect(song)} className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#38cc63] cursor-pointer transition-all">
                    <h4 className="font-bold text-gray-800 text-lg group-hover:text-[#38cc63]">{song.title}</h4>
                    <div className="flex items-center gap-3">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                         song.difficulty === 'Fácil' ? 'bg-green-100 text-green-600' :
                         song.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-600' :
                         'bg-red-100 text-red-600'
                       }`}>
                         {song.difficulty}
                       </span>
                       <Play className="w-4 h-4 text-[#38cc63]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
                       {currentSong.verified && (
                         <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                           <CheckCircle2 className="w-3 h-3" /> Verificada
                         </span>
                       )}
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

      <div className={`fixed bottom-6 right-6 flex flex-col items-center gap-3 z-[80] transition-opacity duration-300 ${isViewMode && !isAutoScrolling ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}>
        {currentSong && (
          <div className="flex flex-col items-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
             <button 
               onClick={scrollToTop}
               className="w-11 h-11 bg-[#1c1c1c] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group border-4 border-white mb-1"
               title="Voltar ao Início"
             >
               <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
             </button>

             {isAutoScrolling && (
               <div className="flex flex-col gap-1.5 mb-2 bg-[#1c1c1c] p-1.5 rounded-2xl shadow-2xl border border-white/10 animate-in zoom-in-95 origin-bottom">
                 {[2, 1.5, 1, 0.5].map((speed) => (
                   <button
                     key={speed}
                     onClick={() => setScrollSpeed(speed)}
                     className={`w-9 h-9 rounded-xl text-[10px] font-black flex items-center justify-center transition-all ${
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
             <button 
               onClick={() => setIsAutoScrolling(!isAutoScrolling)}
               className={`w-13 h-13 rounded-full flex items-center justify-center shadow-2xl transition-all border-4 border-white ${
                 isAutoScrolling 
                  ? 'bg-[#38cc63] text-white shadow-[#38cc63]/40 scale-110' 
                  : 'bg-[#1c1c1c] text-white hover:bg-gray-800'
               }`}
               title="Auto Rolagem"
             >
               <div className="relative">
                 <span className={`transition-all ${isAutoScrolling ? 'animate-bounce' : ''}`}>
                    <ArrowUpDown className="w-6 h-6" />
                 </span>
                 {isAutoScrolling && (
                   <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>
                 )}
               </div>
             </button>
          </div>
        )}
      </div>

      <Tuner isOpen={isTunerOpen} onClose={() => setIsTunerOpen(false)} />
      <Metronome isOpen={isMetronomeOpen} onClose={() => setIsMetronomeOpen(false)} />
      <SongSubmission 
        isOpen={isSubmissionOpen} 
        onClose={() => setIsSubmissionOpen(false)} 
        onSubmit={handleSongSubmission} 
      />
    </div>
  );
};

export default App;
