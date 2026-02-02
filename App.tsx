
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Play, Pause, Grid, Printer, Music, Heart, X, Bot, Link as LinkIcon, 
  Globe, ChevronRight, Menu, Search, Video, Settings, ChevronDown, 
  Maximize2, Type as FontIcon, Minus, Plus, Share2, Guitar, Star, Users, Flame, Disc, ArrowLeft, CheckCircle2, Bookmark,
  Scissors, ArrowUpDown, Type, Eye, PlusCircle, Timer, Book, Edit, Activity, Folder, ExternalLink, Info, Download, PlayCircle,
  Keyboard, Monitor, Youtube, Sparkles, Zap, AlertCircle
} from 'lucide-react';
import { ExtendedSong, ZEZE_SONGS, JULIANY_SOUZA_SONGS } from './constants';
import { findChordsWithAI } from './services/geminiService';
import { transposeContent } from './utils/musicUtils';
import SearchInput from './components/SearchInput';
import ChordDisplay from './components/ChordDisplay';
import ChordDiagram from './components/ChordDiagram';
import JoaoAssistant from './components/JoaoAssistant';
import Tuner from './components/Tuner';

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
  const [selectedInstrument, setSelectedInstrument] = useState('Violão');
  const [showChordsInSidebar, setShowChordsInSidebar] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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
    setIsVideoModalOpen(false);
    setIsAutoScrolling(false);
    setScrollSpeed(1);
    setShowChordsInSidebar(false);
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

  const renderHome = () => (
    <div className="py-2">
      <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Disc className="text-[#38cc63] w-8 h-8" /> Navegar por Ritmos
        </h1>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-[#38cc63]/10 text-[10px] font-black rounded-full text-[#38cc63] uppercase tracking-widest flex items-center gap-1.5">
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
      <header className="bg-[#1c1c1c] text-white sticky top-0 z-[60] h-16 flex items-center shadow-lg">
        <div className="max-w-[1280px] mx-auto w-full px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setCurrentSong(null); setSelectedGenre(null); setSelectedArtist(null); }}>
            <div className="bg-[#38cc63] p-2 rounded-lg"><Music className="text-white w-5 h-5" /></div>
            <span className="font-black text-2xl tracking-tight uppercase">CIFRA<span className="text-[#38cc63]"> MASTER</span></span>
          </div>
          <div className="flex-1 max-w-2xl"><SearchInput onSearch={handleSearch} isLoading={isLoading} /></div>
        </div>
      </header>

      <div className="flex-1 max-w-[1280px] mx-auto w-full px-4 pt-6 flex gap-6 mb-20 relative">
        <main className={`flex-1 min-w-0 bg-white rounded-xl border border-gray-200 p-4 md:p-10 shadow-sm relative transition-all duration-300 ${currentSong ? 'flex flex-col md:flex-row gap-10' : ''} ${showChordsInSidebar ? 'md:mr-[280px]' : ''}`}>
          {!currentSong && !selectedGenre && renderHome()}
          {selectedGenre && !selectedArtist && !currentSong && renderArtistsView()}
          {selectedArtist && !currentSong && renderSongsView()}
          
          {currentSong && (
            <>
              <aside className="w-full md:w-[200px] shrink-0 flex flex-col gap-2">
                <button 
                  onClick={() => setIsVideoModalOpen(true)}
                  className="w-full bg-[#38cc63] text-white py-3 rounded-xl font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#2da34f] transition-all mb-2 shadow-lg shadow-[#38cc63]/20 hover:scale-[1.02] active:scale-95 group"
                >
                   <Users className="w-4 h-4 group-hover:scale-110 transition-transform" /> {currentSong.artist}
                </button>

                <SidebarButton icon={Scissors} label="Simplificar cifra" onClick={() => {}} />
                
                <div className="flex flex-col gap-1">
                  <SidebarButton 
                    icon={ArrowUpDown} 
                    label="Auto rolagem" 
                    onClick={() => setIsAutoScrolling(!isAutoScrolling)} 
                    active={isAutoScrolling}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${isAutoScrolling ? 'bg-[#38cc63] shadow-[0_0_8px_#38cc63]' : 'bg-gray-200'}`}></div>
                  </SidebarButton>
                  
                  {isAutoScrolling && (
                    <div className="flex items-center justify-between p-1 bg-gray-50 rounded-xl border border-gray-100 animate-in slide-in-from-top-1 duration-200">
                      {[0.5, 1, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setScrollSpeed(speed)}
                          className={`flex-1 py-1 text-[9px] font-black rounded-lg transition-all ${
                            scrollSpeed === speed 
                              ? 'bg-[#38cc63] text-white shadow-sm' 
                              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

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
                  icon={Grid} 
                  label="Acordes" 
                  onClick={() => setShowChordsInSidebar(!showChordsInSidebar)} 
                  active={showChordsInSidebar}
                />
                
                <SidebarButton icon={Activity} label="Afinador" onClick={() => setIsTunerOpen(true)} />
                <SidebarButton icon={Bookmark} label="Capotraste" onClick={() => {}} />
                <SidebarButton icon={Eye} label="Exibir" onClick={() => {}} />
                
                <div className="my-2 border-t border-gray-100"></div>

                <SidebarButton icon={PlusCircle} label="Adicionar à lista" onClick={() => {}} />
                <SidebarButton icon={Timer} label="Metrônomo" onClick={() => {}} />
                <SidebarButton icon={Book} label="Dicionário" onClick={() => {}} />
                <SidebarButton icon={Edit} label="Corrigir" onClick={() => {}} />
                <SidebarButton icon={Printer} label="Imprimir" onClick={() => window.print()} />
                <SidebarButton icon={Download} label="Baixar cifra" onClick={() => {}} />

                <div className="mt-4 p-4 bg-[#38cc63] rounded-xl text-center shadow-lg shadow-[#38cc63]/20 cursor-pointer hover:scale-[1.02] transition-transform">
                   <div className="text-white font-black text-[12px] uppercase tracking-tighter">Cifra Master PRO</div>
                   <div className="text-white/80 text-[9px] font-bold mt-1 uppercase">Toque como um profissional</div>
                </div>
              </aside>

              <div className="flex-1 min-w-0">
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

                <div className="mb-10">
                   <div className="flex items-center gap-2 mb-4">
                     <span className="text-[10px] font-black text-[#38cc63] uppercase tracking-widest bg-[#38cc63]/10 px-2 py-0.5 rounded">Tom: {currentSong.originalKey || 'A'}</span>
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-none mb-2 uppercase">{currentSong.title}</h2>
                   <h3 className="text-xl font-medium text-gray-400">{currentSong.artist}</h3>
                </div>

                <ChordDisplay content={transposedContent} fontSize={fontSize} instrument={selectedInstrument} />

                {currentSong.sources && currentSong.sources.length > 0 && (
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

        {/* Floating Chord Panel (Drawer) */}
        {currentSong && (
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

      {/* Video Modal */}
      {isVideoModalOpen && currentSong && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl bg-[#1c1c1c] rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
            <div className="p-5 flex items-center justify-between border-b border-white/5 bg-[#1c1c1c]">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
                    <Youtube className="text-white w-6 h-6" />
                 </div>
                 <div className="hidden sm:block">
                   <h3 className="text-white font-black text-sm uppercase tracking-tight">{currentSong.title}</h3>
                   <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{currentSong.artist} • Oficial</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsVideoModalOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#38cc63] hover:bg-[#2da34f] text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-[#38cc63]/20"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar para a Cifra
                </button>
                <button 
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(currentSong.artist + ' ' + currentSong.title + ' oficial clipe')}`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 bg-black/40 flex items-center justify-center gap-4">
               <span className="text-white/60 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <Sparkles className="w-3 h-3 text-[#38cc63]" /> Player Cifra Master
               </span>
            </div>
          </div>
        </div>
      )}

      {!isJoaoOpen && (
        <button 
          onClick={() => setIsJoaoOpen(true)} 
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#1c1c1c] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[80] group border-4 border-white"
        >
          <Guitar className="text-yellow-400 w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#38cc63] rounded-full border-4 border-white"></div>
        </button>
      )}

      <JoaoAssistant isOpen={isJoaoOpen} onClose={() => setIsJoaoOpen(false)} onSongFound={handleSongSelect} />
      <Tuner isOpen={isTunerOpen} onClose={() => setIsTunerOpen(false)} />
    </div>
  );
};

export default App;
