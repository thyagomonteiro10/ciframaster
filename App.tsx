
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Play, Pause, Grid, Music, Heart, X, Bot, Link as LinkIcon, 
  Globe, ChevronRight, Menu, Search, Video, Settings, ChevronDown, 
  Maximize2, Type as FontIcon, Minus, Plus, Share2, Guitar, Star, Users, Flame, Disc, ArrowLeft, CheckCircle2,
  ArrowUpDown, Type, PlusCircle, Timer, Activity, Folder, ExternalLink, Info, Download, PlayCircle,
  Keyboard, Monitor, Youtube, Sparkles, Zap, AlertCircle, Eye, User, LogIn, Mail, Lock, LogOut, Home, ChevronUp, PlusSquare,
  Upload, FileJson, FileText, Save, Trash2, Smartphone
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
import DownloadModal from './components/DownloadModal';

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
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState('Violão');
  const [showChordsInSidebar, setShowChordsInSidebar] = useState(false);
  const [favorites, setFavorites] = useState<ExtendedSong[]>([]);
  const [userSongs, setUserSongs] = useState<ExtendedSong[]>([]);
  const [isFavFolderOpen, setIsFavFolderOpen] = useState(true);
  const [isUserSongsOpen, setIsUserSongsOpen] = useState(true);
  const [isViewMode, setIsViewMode] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
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
    installPrompt.userChoice.then((choiceResult: any) => {
      setInstallPrompt(null);
      setIsDownloadModalOpen(false);
    });
  };

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

  useEffect(() => {
    const savedUser = localStorage.getItem('cifra_master_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    const savedFavs = localStorage.getItem('cifra_master_favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) { console.error(e); }
    }

    const savedUserSongs = localStorage.getItem('cifra_master_user_songs');
    if (savedUserSongs) {
      try {
        setUserSongs(JSON.parse(savedUserSongs));
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cifra_master_favorites', JSON.stringify(favorites));
  }, [favorites]);

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
    setUserSongs(prev => [song, ...prev]);
    setIsUserSongsOpen(true);
  };

  const deleteUserSong = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Deseja excluir esta cifra do seu repertório local?")) {
      setUserSongs(prev => prev.filter(s => s.id !== id));
      if (currentSong?.id === id) setCurrentSong(null);
    }
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
    const userMatch = userSongs.find(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
    if (userMatch) { handleSongSelect(userMatch); return; }
    setIsLoading(true);
    const aiSong = await findChordsWithAI(query);
    if (aiSong) handleSongSelect(aiSong as ExtendedSong);
    setIsLoading(false);
  }, [handleSongSelect, userSongs]);

  const handleBack = () => {
    if (currentSong) { setCurrentSong(null); setIsViewMode(false); }
    else if (selectedArtist) setSelectedArtist(null);
    else if (selectedGenre) setSelectedGenre(null);
  };

  useEffect(() => {
    let interval: any;
    if (isAutoScrolling) interval = setInterval(() => { window.scrollBy(0, 1); }, 60 / scrollSpeed);
    return () => clearInterval(interval);
  }, [isAutoScrolling, scrollSpeed]);

  const transposedContent = useMemo(() => {
    if (!currentSong) return '';
    return transposeContent(currentSong.content, transposition);
  }, [currentSong, transposition]);

  const handleDownload = useCallback(() => {
    if (!currentSong) return;
    const blob = new Blob([transposedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentSong.artist} - ${currentSong.title}.txt`;
    link.click();
  }, [currentSong, transposedContent]);

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
    if (matches) matches.forEach(m => chords.add(m.slice(1, -1).trim()));
    return Array.from(chords);
  }, [currentSong]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
           <button onClick={() => setIsFavFolderOpen(!isFavFolderOpen)} className="w-full flex items-center justify-between p-4 bg-[#1c1c1c] rounded-2xl shadow-xl border border-white/5 hover:bg-gray-800 transition-all group">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-[#22c55e]/20 rounded-xl flex items-center justify-center border border-[#22c55e]/30">
                    <Heart className="text-[#22c55e] w-5 h-5 fill-[#22c55e]/20" />
                 </div>
                 <div className="text-left">
                    <h2 className="text-lg font-black text-white tracking-tight uppercase">Meus Favoritos</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{favorites.length} músicas</p>
                 </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isFavFolderOpen ? 'rotate-180' : ''}`} />
           </button>
           {isFavFolderOpen && favorites.length > 0 && (
             <div className="mt-3 grid grid-cols-1 gap-2 animate-in slide-in-from-top-2 duration-300 origin-top">
                {favorites.map((song) => (
                  <div key={song.id} onClick={() => handleSongSelect(song)} className="group flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-[#22c55e] transition-all cursor-pointer">
                    <div className="flex-1 min-w-0 pr-3">
                      <h4 className="font-bold text-gray-800 text-xs truncate group-hover:text-[#22c55e]">{song.title}</h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase truncate">{song.artist}</p>
                    </div>
                    <Play className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#22c55e]" />
                  </div>
                ))}
             </div>
           )}
        </div>

        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#22c55e]/30 transition-all group overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsUserSongsOpen(!isUserSongsOpen)}>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-[#22c55e]/10 group-hover:border-[#22c55e]/30 transition-all">
                      <Save className="text-gray-400 w-5 h-5 group-hover:text-[#22c55e] transition-colors" />
                   </div>
                   <div className="text-left">
                      <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">Minhas Cifras</h2>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{userSongs.length} enviadas</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                     onClick={(e) => { e.stopPropagation(); setIsSubmissionOpen(true); }}
                     className="p-2 bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e] hover:text-white rounded-lg transition-all"
                   >
                     <PlusSquare className="w-4 h-4" />
                   </button>
                   <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${isUserSongsOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {isUserSongsOpen && (
                <div className="px-4 pb-4 grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto no-scrollbar">
                    {userSongs.length > 0 ? userSongs.map((song) => (
                        <div key={song.id} onClick={() => handleSongSelect(song)} className="group flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-[#22c55e] transition-all cursor-pointer">
                          <div className="flex-1 min-w-0 pr-3">
                            <h4 className="font-bold text-gray-800 text-xs truncate group-hover:text-[#22c55e]">{song.title}</h4>
                            <div className="flex items-center gap-2">
                               <p className="text-[9px] text-gray-400 font-bold uppercase truncate">{song.artist}</p>
                               <span className="text-[7px] bg-gray-100 text-gray-400 px-1 rounded uppercase font-black">{song.genre}</span>
                            </div>
                          </div>
                          <button onClick={(e) => deleteUserSong(song.id, e)} className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                    )) : (
                      <div className="p-8 border-2 border-dashed border-gray-100 rounded-xl text-center text-[10px] text-gray-400 font-bold uppercase">
                        Nenhuma música enviada ainda.
                      </div>
                    )}
                </div>
              )}
           </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3"><Disc className="text-[#22c55e] w-7 h-7" /> Navegar por Ritmos</h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 mb-20">
        {GENRES.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)} className="group relative h-28 rounded-2xl overflow-hidden bg-gray-900 shadow-lg border-2 border-transparent hover:border-[#22c55e] transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/20 to-black opacity-60 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-4">
               <span className="text-white font-black text-sm uppercase tracking-widest">{genre}</span>
               <div className="w-8 h-0.5 bg-[#22c55e] mt-2 group-hover:w-16 transition-all"></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col font-sans relative">
      {!isViewMode && (
        <header className="bg-[#1c1c1c] text-white sticky top-0 z-[60] h-16 flex items-center shadow-lg px-4">
          <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 cursor-pointer" onClick={goHome}>
              {/* Logo Violão Preto e Verde */}
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
                <PlusSquare className="w-4 h-4 text-[#22c55e]" /> Enviar Música
              </button>
              <button onClick={handleInstallClick} className="flex items-center gap-2 px-4 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"><Smartphone className="w-4 h-4" /> Baixar APK</button>
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
        <main className={`flex-1 min-w-0 bg-white relative transition-all duration-300 ${isViewMode ? 'p-6 md:p-20' : 'rounded-xl border border-gray-200 p-4 md:p-10'} ${currentSong && !isViewMode ? 'flex flex-col md:flex-row gap-10' : ''}`}>
          {!currentSong && !selectedGenre && renderHome()}
          
          {selectedGenre && !selectedArtist && !currentSong && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-8">
                 <button onClick={handleBack} className="flex items-center gap-2 text-[10px] font-black text-[#22c55e] uppercase tracking-widest"><ArrowLeft className="w-4 h-4" /> Voltar</button>
                 <button onClick={() => setIsSubmissionOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#22c55e]/10 text-[#22c55e] rounded-xl text-[10px] font-black uppercase hover:bg-[#22c55e] hover:text-white transition-all">
                    <PlusCircle className="w-4 h-4" /> Add ao {selectedGenre}
                 </button>
              </div>
              <h1 className="text-5xl font-black uppercase mb-12 tracking-tight">{selectedGenre}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(groupedContent[selectedGenre!] || {}).map((artist) => (
                  <button key={artist} onClick={() => setSelectedArtist(artist)} className="group flex flex-col bg-white border border-gray-200 rounded-2xl p-5 text-left hover:border-[#22c55e] transition-all hover:shadow-lg">
                     <h3 className="font-black text-gray-900 uppercase group-hover:text-[#22c55e]">{artist}</h3>
                     <p className="text-[9px] text-gray-400 font-bold uppercase mt-2">{groupedContent[selectedGenre!][artist].length} músicas</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedArtist && !currentSong && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <button onClick={handleBack} className="flex items-center gap-2 text-[10px] font-black text-[#22c55e] uppercase mb-8 tracking-widest"><ArrowLeft className="w-4 h-4" /> Voltar</button>
              <h1 className="text-4xl font-black uppercase mb-12 tracking-tight">{selectedArtist}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(groupedContent[selectedGenre!]?.[selectedArtist!] || []).map((song) => (
                  <div key={song.id} onClick={() => handleSongSelect(song)} className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#22c55e] cursor-pointer transition-all hover:shadow-sm">
                    <h4 className="font-bold text-gray-800 text-lg group-hover:text-[#22c55e]">{song.title}</h4>
                    <div className="flex items-center gap-3">
                       {userSongs.some(us => us.id === song.id) && <span className="text-[8px] bg-green-50 text-[#22c55e] px-1.5 py-0.5 rounded font-black uppercase">Enviada</span>}
                       <Play className="w-4 h-4 text-[#22c55e]" />
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
                  <button onClick={handleBack} className="w-full bg-[#22c55e] text-white py-3 rounded-xl font-black text-[12px] uppercase shadow-lg mb-2"><ArrowLeft className="w-4 h-4 inline mr-2"/> {currentSong.artist}</button>
                  <SidebarButton icon={Activity} label="Afinador" onClick={() => setIsTunerOpen(true)} />
                  <SidebarButton icon={Timer} label="Metrônomo" onClick={() => setIsMetronomeOpen(true)} />
                  <SidebarButton icon={Heart} label={isCurrentFavorite ? "Remover" : "Favoritar"} onClick={() => toggleFavorite(currentSong)} active={isCurrentFavorite} />
                  <SidebarButton icon={Download} label="Baixar" onClick={handleDownload} />
                  <SidebarButton icon={Smartphone} label="Instalar App" onClick={handleInstallClick} primary />
                </aside>
              )}
              <div className="flex-1 min-w-0">
                <div className="mb-10">
                   <h2 className={`${isViewMode ? 'text-7xl' : 'text-5xl'} font-black text-gray-950 uppercase mb-2 tracking-tight`}>{currentSong.title}</h2>
                   <h3 className="text-xl font-medium text-gray-400">{currentSong.artist}</h3>
                </div>
                <ChordDisplay content={transposedContent} fontSize={fontSize} instrument={selectedInstrument} />
              </div>
            </>
          )}
        </main>
      </div>

      <div className={`fixed bottom-6 right-6 flex flex-col items-center gap-3 z-[80] ${isViewMode && !isAutoScrolling ? 'opacity-40 hover:opacity-100' : ''}`}>
        {currentSong && (
          <>
             <button onClick={scrollToTop} className="w-11 h-11 bg-[#1c1c1c] text-[#22c55e] rounded-full flex items-center justify-center shadow-2xl border-4 border-white"><ChevronUp className="w-5 h-5" /></button>
             <button onClick={() => setIsAutoScrolling(!isAutoScrolling)} className={`w-13 h-13 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transition-all ${isAutoScrolling ? 'bg-[#22c55e] text-white scale-110' : 'bg-[#1c1c1c] text-white'}`}><ArrowUpDown className="w-6 h-6" /></button>
          </>
        )}
      </div>

      <Tuner isOpen={isTunerOpen} onClose={() => setIsTunerOpen(false)} />
      <Metronome isOpen={isMetronomeOpen} onClose={() => setIsMetronomeOpen(false)} />
      <SongSubmission 
        isOpen={isSubmissionOpen} 
        onClose={() => setIsSubmissionOpen(false)} 
        onSubmit={handleSongSubmission} 
        defaultGenre={selectedGenre}
      />
      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} onInstall={handleInstallClick} isInstallAvailable={!!installPrompt} />
    </div>
  );
};

export default App;
