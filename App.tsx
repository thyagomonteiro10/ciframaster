
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Heart, X, Globe, ChevronDown, Minus, Plus, Guitar, Disc, ArrowLeft, 
  ArrowUpDown, Timer, Activity, Download, PlayCircle, Eye, User, 
  LogOut, ChevronUp, PlusSquare, Save, Trash2, Smartphone, Minimize2, BookOpen,
  FolderOpen, Music, Search, Play, Lock
} from 'lucide-react';
import { ExtendedSong, ZEZE_SONGS, JULIANY_SOUZA_SONGS, RICK_RENNER_SONGS, COMMUNITY_SONGS } from './constants';
import { findChordsWithAI } from './services/geminiService';
import { transposeContent } from './utils/musicUtils';
import SearchInput from './components/SearchInput';
import ChordDisplay from './components/ChordDisplay';
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
  
  const [favorites, setFavorites] = useState<ExtendedSong[]>([]);
  const [userSongs, setUserSongs] = useState<ExtendedSong[]>([]);
  const [userRepoTab, setUserRepoTab] = useState<'private' | 'public'>('private');
  
  const [communitySongs, setCommunitySongs] = useState<ExtendedSong[]>(() => {
    const saved = localStorage.getItem('cifra_master_public_vault');
    const base = [...COMMUNITY_SONGS, ...ZEZE_SONGS, ...JULIANY_SOUZA_SONGS, ...RICK_RENNER_SONGS];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filtra apenas o que é do usuário e combina com a base fixa
        const userAdded = parsed.filter((p: any) => p.id.startsWith('user-'));
        return [...userAdded, ...base];
      } catch (e) { return base; }
    }
    return base;
  });

  const [isFavFolderOpen, setIsFavFolderOpen] = useState(false);
  const [isUserSongsOpen, setIsUserSongsOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  const goHome = useCallback(() => {
    setCurrentSong(null);
    setSelectedGenre(null);
    setIsViewMode(false);
    setIsSubmissionOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleInstallClick = useCallback(() => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
        setInstallPrompt(null);
      });
    } else {
      setIsDownloadModalOpen(true);
    }
  }, [installPrompt]);

  const handleDownload = useCallback(() => {
    setIsDownloadModalOpen(true);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });
    
    const savedUser = localStorage.getItem('cifra_master_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    const savedFavs = localStorage.getItem('cifra_master_favorites');
    if (savedFavs) { try { setFavorites(JSON.parse(savedFavs)); } catch (e) {}}

    const savedUserSongs = localStorage.getItem('cifra_master_user_songs');
    if (savedUserSongs) { try { setUserSongs(JSON.parse(savedUserSongs)); } catch (e) {}}
  }, []);

  useEffect(() => {
    localStorage.setItem('cifra_master_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cifra_master_user_songs', JSON.stringify(userSongs));
  }, [userSongs]);

  useEffect(() => {
    // Salva apenas as músicas enviadas pelo usuário que são públicas
    const userSubmittedPublic = communitySongs.filter(s => s.id.startsWith('user-'));
    localStorage.setItem('cifra_master_public_vault', JSON.stringify(userSubmittedPublic));
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

  const handleSongSubmission = (song: ExtendedSong) => {
    if (song.isPublic) {
      setCommunitySongs(prev => [song, ...prev]);
      setUserRepoTab('public');
    } else {
      setUserSongs(prev => [song, ...prev]);
      setUserRepoTab('private');
    }
    setIsUserSongsOpen(true);
  };

  const deleteUserSong = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Deseja excluir esta cifra permanentemente?")) {
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
      interval = setInterval(() => { window.scrollBy(0, 1); }, 80 / scrollSpeed);
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

  const songsInSelectedGenre = useMemo(() => {
    if (!selectedGenre) return [];
    return communitySongs.filter(s => s.genre === selectedGenre);
  }, [communitySongs, selectedGenre]);

  const userPublicSongs = useMemo(() => {
    return communitySongs.filter(s => s.id.startsWith('user-'));
  }, [communitySongs]);

  const renderHome = () => (
    <div className="py-2 animate-in fade-in duration-500">
      {/* Hero Section Ultra Otimizada */}
      <div className="mb-6 rounded-[2rem] overflow-hidden relative group border border-white/10 shadow-xl h-[220px] flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1200&auto=format&fit=crop")',
              filter: 'brightness(0.25) saturate(1.2)' 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          
          <div className="relative z-10 p-6 md:p-8 max-w-2xl">
              <div className="flex items-center gap-2 text-[#22c55e] mb-2 animate-in slide-in-from-left-4 duration-500">
                  <div className="w-5 h-5 rounded-full bg-[#22c55e]/20 flex items-center justify-center border border-[#22c55e]/40">
                    <Globe className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em]">Rede Comunitária</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 leading-none text-white">
                CIFRAS <span className="text-[#22c55e]">POR RITMO</span>
              </h1>
              <p className="text-gray-400 max-w-xs text-xs font-medium mb-6">
                Acesse o acervo mestre e colabore agora!
              </p>
              <button 
                onClick={() => setIsSubmissionOpen(true)}
                className="px-6 py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2 border border-white/10"
              >
                <PlusSquare className="w-3.5 h-3.5" /> PUBLIQUE DO DISPOSITIVO
              </button>
          </div>
          
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#22c55e]/10 blur-[80px] rounded-full pointer-events-none"></div>
      </div>

      {/* Main Grid: Tuner + Folders Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button onClick={() => setIsTunerOpen(true)} className="w-full flex flex-row items-center justify-start gap-4 p-6 bg-[#050505] rounded-[2rem] shadow-lg border border-[#00ff66]/40 hover:border-[#00ff66] transition-all group overflow-hidden">
          <Activity className="text-[#00ff66] w-8 h-8 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Afinador</h2>
            <p className="text-[8px] font-black text-[#00ff66] uppercase tracking-[0.3em]">Mestre</p>
          </div>
        </button>

        <button onClick={() => setIsFavFolderOpen(!isFavFolderOpen)} className="p-5 bg-white rounded-[2rem] border border-gray-100 hover:border-[#22c55e]/30 transition-all flex flex-row items-center justify-between shadow-sm">
           <div className="flex flex-col text-left">
              <h3 className="font-black text-gray-900 uppercase text-[10px]">Favoritas</h3>
              <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Pessoal</p>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-lg font-black text-gray-900">{favorites.length}</span>
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-[#22c55e] fill-[#22c55e]/20' : 'text-gray-200'}`} />
           </div>
        </button>

        <button onClick={() => setIsUserSongsOpen(!isUserSongsOpen)} className="p-5 bg-white rounded-[2rem] border border-gray-100 hover:border-[#22c55e]/30 transition-all flex flex-row items-center justify-between shadow-sm">
           <div className="flex flex-col text-left">
              <h3 className="font-black text-gray-900 uppercase text-[10px]">Meu Repertório</h3>
              <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Arquivos</p>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-lg font-black text-gray-900">{userSongs.length + userPublicSongs.length}</span>
              <Save className={`w-5 h-5 ${userSongs.length + userPublicSongs.length > 0 ? 'text-[#22c55e]' : 'text-gray-200'}`} />
           </div>
        </button>
      </div>

      {/* Expandable Private Content */}
      <div className="space-y-3 mb-8">
        {isFavFolderOpen && favorites.length > 0 && (
          <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 animate-in slide-in-from-top-4 shadow-sm">
             <h3 className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Heart className="w-2.5 h-2.5 text-[#22c55e]" /> Favoritas</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {favorites.map((song) => (
                  <div key={song.id} onClick={() => handleSongSelect(song)} className="group flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-[#22c55e]/20">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-bold text-gray-900 text-[11px] truncate group-hover:text-[#22c55e]">{song.title}</h4>
                      <p className="text-[7px] text-gray-400 font-bold uppercase truncate">{song.artist}</p>
                    </div>
                    <Play className="w-2 h-2 text-gray-300 group-hover:text-[#22c55e]" />
                  </div>
                ))}
             </div>
          </div>
        )}

        {isUserSongsOpen && (
          <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 animate-in slide-in-from-top-4 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Save className="w-2.5 h-2.5 text-[#22c55e]" /> Meu Repertório
                </h3>
                <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
                   <button 
                    onClick={() => setUserRepoTab('private')}
                    className={`px-3 py-1 text-[7px] font-black uppercase rounded-md transition-all flex items-center gap-1.5 ${userRepoTab === 'private' ? 'bg-[#22c55e] text-white shadow-sm' : 'text-gray-400'}`}
                   >
                     <Lock className="w-2 h-2" /> Privado
                   </button>
                   <button 
                    onClick={() => setUserRepoTab('public')}
                    className={`px-3 py-1 text-[7px] font-black uppercase rounded-md transition-all flex items-center gap-1.5 ${userRepoTab === 'public' ? 'bg-[#22c55e] text-white shadow-sm' : 'text-gray-400'}`}
                   >
                     <Globe className="w-2 h-2" /> Público
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 min-h-[60px]">
                {(userRepoTab === 'private' ? userSongs : userPublicSongs).length > 0 ? (
                  (userRepoTab === 'private' ? userSongs : userPublicSongs).map((song) => (
                    <div key={song.id} onClick={() => handleSongSelect(song)} className="group flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-[#22c55e]/20">
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="font-bold text-gray-900 text-[11px] truncate group-hover:text-[#22c55e]">{song.title}</h4>
                        <p className="text-[7px] text-gray-400 font-bold uppercase truncate">{song.artist}</p>
                      </div>
                      <button onClick={(e) => deleteUserSong(song.id, e)} className="p-1.5 text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-4 text-center text-[8px] font-bold text-gray-300 uppercase">
                    Nenhuma cifra {userRepoTab === 'private' ? 'privada' : 'pública'} encontrada.
                  </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* PUBLIC FOLDERS SECTION */}
      <div className="flex items-center justify-between mb-5 border-b border-gray-200 pb-3">
        <h2 className="text-lg font-black text-gray-900 tracking-tighter flex items-center gap-2">
          <FolderOpen className="text-[#22c55e] w-5 h-5" /> PASTAS DA COMUNIDADE
        </h2>
        {selectedGenre && (
          <button onClick={() => setSelectedGenre(null)} className="flex items-center gap-2 text-[8px] font-black uppercase text-[#22c55e] bg-[#22c55e]/10 px-2 py-1 rounded-full hover:bg-[#22c55e] hover:text-white transition-all">
            <X className="w-2 h-2" /> Fechar
          </button>
        )}
      </div>

      {/* Pastas de Ritmos */}
      {!selectedGenre ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-12 animate-in slide-in-from-bottom-4 duration-500">
          {GENRES.map((genre) => (
            <button 
              key={genre} 
              onClick={() => setSelectedGenre(genre)}
              className="group flex flex-col items-center p-6 bg-[#1c1c1c] border border-white/5 rounded-[1.5rem] shadow hover:border-[#22c55e]/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-white/5 group-hover:bg-[#22c55e] transition-colors"></div>
              
              <div className="relative z-10 w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#22c55e]/20 group-hover:scale-105 transition-all border border-white/5 group-hover:border-[#22c55e]/30">
                 <Disc className="w-5 h-5 text-gray-500 group-hover:text-[#22c55e] transition-colors" />
              </div>
              
              <span className="relative z-10 text-[9px] font-black text-gray-300 group-hover:text-white uppercase tracking-widest transition-colors">{genre}</span>
              
              <div className="relative z-10 mt-1.5 text-[6px] font-black text-[#22c55e] uppercase tracking-tighter bg-[#22c55e]/10 px-1.5 py-0.5 rounded-full border border-[#22c55e]/20">
                {communitySongs.filter(s => s.genre === genre).length} ARQS
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
           <div className="bg-white p-6 rounded-[2rem] border border-[#22c55e]/20 shadow-lg min-h-[300px]">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-10 h-10 bg-[#1c1c1c] rounded-lg flex items-center justify-center border border-[#22c55e]/50">
                    <FolderOpen className="text-[#22c55e] w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">{selectedGenre}</h3>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Biblioteca</p>
                 </div>
              </div>

              {songsInSelectedGenre.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                   {songsInSelectedGenre.map((song) => (
                     <div 
                      key={song.id} 
                      onClick={() => handleSongSelect(song)} 
                      className="group flex flex-col p-4 bg-gray-50 rounded-[1.25rem] hover:bg-white hover:shadow-md hover:border-[#22c55e] border border-transparent transition-all cursor-pointer relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Music className="w-3.5 h-3.5 text-gray-200 group-hover:text-[#22c55e]" />
                        <span className="text-[6px] font-black uppercase text-gray-400 bg-white px-1 py-0.5 rounded border border-gray-100">{song.difficulty}</span>
                      </div>
                      <h4 className="font-black text-gray-900 text-xs truncate group-hover:text-[#22c55e] mb-0.5">{song.title}</h4>
                      <p className="text-[8px] text-gray-400 font-bold uppercase truncate mb-3">{song.artist}</p>
                      <div className="mt-auto pt-2 border-t border-gray-200/50 flex items-center justify-between">
                         <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-[#1c1c1c] rounded-full flex items-center justify-center border border-[#22c55e]/30">
                               <User className="w-2 h-2 text-[#22c55e]" />
                            </div>
                            <span className="text-[6px] text-gray-400 font-black uppercase truncate max-w-[60px]">{song.author || 'Mestre'}</span>
                         </div>
                         <PlayCircle className="w-4 h-4 text-gray-100 group-hover:text-[#22c55e] transition-all" />
                      </div>
                    </div>
                   ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                   <div className="w-16 h-16 bg-[#1c1c1c]/5 rounded-full flex items-center justify-center mb-4">
                      <Music className="w-8 h-8 text-[#1c1c1c]/10" />
                   </div>
                   <h4 className="text-md font-black text-gray-300 uppercase">Vazio</h4>
                   <button onClick={() => setIsSubmissionOpen(true)} className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg font-black text-[8px] uppercase tracking-widest hover:bg-[#22c55e] transition-all">
                      ENVIAR
                   </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );

  const SidebarButton = ({ icon: Icon, label, onClick, children, active, primary }: any) => (
    <button onClick={onClick} className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl border transition-all group ${
        primary ? 'bg-[#22c55e] border-[#22c55e] text-white shadow-lg' : active ? 'bg-[#22c55e]/5 border-[#22c55e]/30 text-[#22c55e]' : 'bg-white border-gray-100 hover:border-gray-400'
      }`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${primary ? 'text-white' : active ? 'text-[#22c55e]' : 'text-gray-400'}`} />
        <span className={`text-[10px] font-black uppercase tracking-widest ${primary ? 'text-white' : active ? 'text-[#22c55e]' : 'text-gray-600'}`}>{label}</span>
      </div>
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans relative">
      {!isViewMode && (
        <header className="bg-[#1c1c1c] text-white sticky top-0 z-[60] h-16 flex items-center shadow-lg px-4 border-b border-white/5">
          <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 cursor-pointer" onClick={goHome}>
              <div className="bg-[#1c1c1c] p-2 rounded-xl border border-[#22c55e] shadow-md shadow-[#22c55e]/20 flex items-center justify-center">
                <Guitar className="text-[#22c55e] w-5 h-5" />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase">CIFRA<span className="text-[#22c55e]">MASTER</span></span>
            </div>
            <div className="flex-1 max-w-xl mx-4"><SearchInput onSearch={handleSearch} isLoading={isLoading} /></div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSubmissionOpen(true)}
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#22c55e] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
              >
                <PlusSquare className="w-4 h-4" /> UPLOAD
              </button>
              <button onClick={handleInstallClick} className="flex items-center gap-2 px-5 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"><Smartphone className="w-4 h-4" /> APP</button>
              {currentUser ? (
                <button onClick={handleLogout} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-500 transition-all shadow-inner border border-white/5"><LogOut className="w-5 h-5" /></button>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl text-xs font-black shadow-lg"><User className="w-4 h-4" /> Entrar</button>
              )}
            </div>
          </div>
        </header>
      )}

      <div className={`flex-1 max-w-[1280px] mx-auto w-full pt-6 flex gap-6 relative ${isViewMode ? 'px-0 pt-0 max-w-none' : 'px-4'}`}>
        <main className={`flex-1 min-w-0 bg-white relative transition-all duration-300 ${isViewMode ? 'p-6 md:p-20 pt-10' : 'rounded-[2.5rem] border border-gray-100 p-6 md:p-12'} ${currentSong && !isViewMode ? 'flex flex-col md:flex-row gap-12' : ''}`}>
          
          {isViewMode && (
            <button 
              onClick={() => setIsViewMode(false)}
              className="fixed top-8 right-8 z-[100] w-14 h-14 bg-[#1c1c1c] text-[#22c55e] rounded-full flex items-center justify-center shadow-2xl hover:bg-black transition-all border-4 border-white"
            >
              <Minimize2 className="w-6 h-6" />
            </button>
          )}

          {!currentSong && renderHome()}
          
          {currentSong && (
            <>
              {!isViewMode && (
                <aside className="w-full md:w-[220px] shrink-0 flex flex-col gap-3">
                  <button onClick={handleBack} className="w-full bg-[#1c1c1c] text-[#22c55e] py-4 rounded-2xl font-black text-[12px] uppercase shadow-xl mb-4 flex items-center justify-center gap-2 hover:bg-black transition-all border border-[#22c55e]/20"><ArrowLeft className="w-4 h-4"/> Voltar</button>
                  <SidebarButton icon={Activity} label="Afinador" onClick={() => setIsTunerOpen(true)} />
                  <SidebarButton icon={Timer} label="Metrônomo" onClick={() => setIsMetronomeOpen(true)} />
                  <SidebarButton icon={Heart} label={favorites.some(f => f.id === currentSong.id) ? "Remover" : "Favoritar"} onClick={() => toggleFavorite(currentSong)} active={favorites.some(f => f.id === currentSong.id)} />
                  
                  <div className="mt-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col gap-5 shadow-inner">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] text-center">Ajustes Master</p>
                    <div className="flex items-center justify-between bg-white rounded-xl border p-1 shadow-sm">
                      <button onClick={() => setFontSize(Math.max(10, fontSize - 2))} className="p-3 text-gray-500 hover:text-[#22c55e] transition-colors"><Minus className="w-4 h-4" /></button>
                      <span className="text-xs font-black text-gray-900">{fontSize}</span>
                      <button onClick={() => setFontSize(Math.min(40, fontSize + 2))} className="p-3 text-gray-500 hover:text-[#22c55e] transition-colors"><Plus className="w-4 h-4" /></button>
                    </div>

                    <button onClick={() => setIsChordDictOpen(true)} className="w-full flex items-center justify-center gap-2 py-4 bg-[#1c1c1c] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#22c55e] transition-all shadow-md border border-[#22c55e]/30">
                      <BookOpen className="w-4 h-4 text-[#22c55e]" /> Dicionário
                    </button>

                    <button onClick={() => setIsViewMode(true)} className="w-full flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all border border-transparent">
                      <Eye className="w-4 h-4 text-[#22c55e]" /> Modo Leitura
                    </button>
                  </div>

                  <SidebarButton icon={Download} label="Baixar" onClick={handleDownload} />
                  <SidebarButton icon={Smartphone} label="Instalar App" onClick={handleInstallClick} primary />
                </aside>
              )}

              <div className={`flex-1 min-w-0 ${isViewMode ? 'mx-auto max-w-4xl' : ''}`}>
                <div className={`${isViewMode ? 'mb-16 text-center' : 'mb-12'}`}>
                   {currentSong.isPublic && (
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-full mb-6 animate-in slide-in-from-bottom-2">
                        <Globe className="w-3.5 h-3.5 text-[#22c55e]" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#22c55e]">Acervo Colaborativo</span>
                      </div>
                   )}
                   <h2 className={`${isViewMode ? 'text-7xl md:text-9xl' : 'text-6xl'} font-black text-gray-950 uppercase mb-3 tracking-tighter transition-all duration-700 leading-none`}>{currentSong.title}</h2>
                   <h3 className={`${isViewMode ? 'text-3xl' : 'text-2xl'} font-bold text-gray-300 transition-all duration-700 uppercase tracking-widest`}>{currentSong.artist}</h3>
                </div>
                <ChordDisplay content={transposedContent} fontSize={fontSize} instrument={selectedInstrument} />
                
                {currentSong.sources && currentSong.sources.length > 0 && (
                  <div className="mt-8 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Globe className="w-3 h-3" /> Fontes Analisadas pela IA:
                    </h4>
                    <ul className="space-y-3">
                      {currentSong.sources.map((source, idx) => (
                        <li key={idx}>
                          <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-[#22c55e] hover:underline flex items-center gap-2 font-bold uppercase tracking-tight">
                            <ArrowLeft className="w-3 h-3 rotate-180" /> {source.title || source.uri}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <div className={`fixed bottom-8 right-8 flex flex-col items-center gap-4 z-[80] transition-all duration-300 ${isViewMode && !isAutoScrolling ? 'opacity-40 hover:opacity-100' : ''}`}>
        {currentSong && (
          <>
             {isViewMode && (
                <div className="flex flex-col gap-3 mb-2 p-3 bg-[#1c1c1c] rounded-[2rem] shadow-2xl border-4 border-white animate-in slide-in-from-bottom-4">
                  <button onClick={() => setFontSize(Math.min(40, fontSize + 2))} className="w-12 h-12 flex items-center justify-center text-[#22c55e] hover:bg-white/10 rounded-full transition-all"><Plus className="w-6 h-6" /></button>
                  <button onClick={() => setIsChordDictOpen(true)} className="w-12 h-12 flex items-center justify-center text-[#22c55e] hover:bg-white/10 rounded-full transition-all"><BookOpen className="w-6 h-6" /></button>
                  <button onClick={() => setFontSize(Math.max(10, fontSize - 2))} className="w-12 h-12 flex items-center justify-center text-[#22c55e] hover:bg-white/10 rounded-full transition-all"><Minus className="w-6 h-6" /></button>
                </div>
             )}

             {isAutoScrolling && (
               <div className="flex flex-col gap-2.5 p-3 bg-[#1c1c1c] rounded-[2rem] shadow-2xl border-4 border-white animate-in slide-in-from-bottom-4 mb-2">
                 {SCROLL_SPEEDS.map(speed => (
                   <button 
                     key={speed} 
                     onClick={() => setScrollSpeed(speed)}
                     className={`w-12 h-12 flex items-center justify-center text-[11px] font-black rounded-full transition-all ${scrollSpeed === speed ? 'bg-[#22c55e] text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                   >
                     {speed}x
                   </button>
                 ))}
               </div>
             )}

             <button onClick={scrollToTop} className="w-14 h-14 bg-[#1c1c1c] text-[#22c55e] rounded-full flex items-center justify-center shadow-2xl border-4 border-white active:scale-90 transition-all hover:bg-black"><ChevronUp className="w-7 h-7" /></button>
             
             <div className="relative group">
                <button 
                  onClick={() => setIsAutoScrolling(!isAutoScrolling)} 
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transition-all active:scale-90 ${isAutoScrolling ? 'bg-[#22c55e] text-white scale-110 shadow-[#22c55e]/40' : 'bg-[#1c1c1c] text-white hover:bg-black'}`}
                >
                  <ArrowUpDown className="w-7 h-7" />
                </button>
                {isAutoScrolling && (
                  <div className="absolute -left-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#1c1c1c] text-[#22c55e] text-[9px] font-black rounded-lg border border-white/20 whitespace-nowrap animate-in fade-in zoom-in">
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="relative w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl border border-white/20 animate-in zoom-in-95">
              <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-8 right-8 text-gray-300 hover:text-gray-900 transition-all"><X className="w-6 h-6" /></button>
              <h3 className="text-4xl font-black text-gray-950 text-center uppercase tracking-tighter mb-4 leading-none text-balance">FAÇA SEU <br/><span className="text-[#22c55e]">LOGIN</span></h3>
              <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest mb-10">Sincronize sua biblioteca em qualquer lugar</p>
              <form onSubmit={handleLogin} className="space-y-4">
                  <input type="email" placeholder="E-mail" required className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#22c55e] rounded-2xl outline-none font-bold" />
                  <input type="password" placeholder="Senha" required className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#22c55e] rounded-2xl outline-none font-bold" />
                  <button type="submit" className="w-full py-5 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-2xl font-black text-sm uppercase shadow-xl active:scale-95 transition-all mt-4 tracking-widest">Acessar Estúdio</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
