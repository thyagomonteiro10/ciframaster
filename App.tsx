
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Play, Pause, Grid, Printer, Music, Heart, X, Bot, Link as LinkIcon, 
  Globe, ChevronRight, Menu, Search, Video, Settings, ChevronDown, 
  Maximize2, Type as FontIcon, Minus, Plus, Share2, Guitar, Star, Users, Flame, Disc, ArrowLeft, CheckCircle2, Bookmark,
  Scissors, ArrowUpDown, Type, Eye, PlusCircle, Timer, Book, Edit, Activity, Folder, ExternalLink, Info, Download, PlayCircle
} from 'lucide-react';
import { ExtendedSong, ZEZE_SONGS, JULIANY_SOUZA_SONGS } from './constants';
import { findChordsWithAI } from './services/geminiService';
import { transposeContent } from './utils/musicUtils';
import SearchInput from './components/SearchInput';
import ChordDisplay from './components/ChordDisplay';
import ChordDiagram from './components/ChordDiagram';
import JoaoAssistant from './components/JoaoAssistant';

const GENRES = ['Sertanejo', 'Rock', 'Pop', 'Reggae', 'Gospel', 'Forró', 'MPB', 'Samba', 'Sofrência'];
const INSTRUMENTS = ['Violão', 'Guitarra', 'Teclado', 'Ukulele', 'Baixo'];

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
  const [selectedInstrument, setSelectedInstrument] = useState('Violão');
  const [showChordsInSidebar, setShowChordsInSidebar] = useState(true);

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
      alert("Desculpe, mestre! Não conseguimos encontrar essa cifra na internet agora. Tente novamente com o nome do artista.");
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
      }, 50 / scrollSpeed);
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

  const SidebarButton = ({ icon: Icon, label, onClick, children, active, orange }: any) => (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl border transition-all group ${
        orange 
          ? 'bg-[#ff7a00] border-[#ff7a00] text-white' 
          : 'bg-white border-gray-200 hover:border-gray-400'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${orange ? 'text-white' : active ? 'text-[#38cc63]' : 'text-gray-400'}`} />
        <span className={`text-[11px] font-bold uppercase tracking-tight ${orange ? 'text-white' : 'text-gray-600'}`}>{label}</span>
      </div>
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col font-sans">
      <header className="bg-[#1c1c1c] text-white sticky top-0 z-[60] h-16 flex items-center shadow-lg">
        <div className="max-w-[1280px] mx-auto w-full px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setCurrentSong(null); setSelectedGenre(null); setSelectedArtist(null); }}>
            <div className="bg-[#38cc63] p-2 rounded-lg"><Music className="text-white w-5 h-5" /></div>
            <span className="font-black text-2xl tracking-tight uppercase">CIFRA<span className="text-[#38cc63]"> MASTER</span></span>
          </div>
          <div className="flex-1 max-w-2xl"><SearchInput onSearch={handleSearch} isLoading={isLoading} /></div>
        </div>
      </header>

      <div className="flex-1 max-w-[1280px] mx-auto w-full px-4 pt-6 flex gap-6 mb-20">
        <main className={`flex-1 min-w-0 bg-white rounded-xl border border-gray-200 p-4 md:p-10 shadow-sm relative ${currentSong ? 'flex flex-col md:flex-row gap-10' : ''}`}>
          {!currentSong && !selectedGenre && renderHome()}
          {selectedGenre && !selectedArtist && !currentSong && renderArtistsView()}
          {selectedArtist && !currentSong && renderSongsView()}
          
          {currentSong && (
            <>
              {/* BARRA LATERAL ESTILO CIFRA CLUB */}
              <aside className="w-full md:w-[200px] shrink-0 flex flex-col gap-2">
                <button 
                  className="w-full bg-[#ff7a00] text-white py-3 rounded-xl font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#e66e00] transition-colors mb-2 shadow-lg shadow-[#ff7a00]/20"
                >
                  <PlayCircle className="w-4 h-4" /> Videoaula
                </button>

                <SidebarButton icon={Scissors} label="Simplificar cifra" onClick={() => {}} />
                
                <SidebarButton icon={ArrowUpDown} label="Auto rolagem" onClick={() => setIsAutoScrolling(!isAutoScrolling)} active={isAutoScrolling}>
                  <div className={`w-2.5 h-2.5 rounded-full ${isAutoScrolling ? 'bg-[#38cc63] shadow-[0_0_8px_#38cc63]' : 'bg-gray-200'}`}></div>
                </SidebarButton>

                {/* Controle de Texto */}
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

                {/* Controle de Tom */}
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

                <SidebarButton icon={Grid} label="Acordes" onClick={() => setShowChordsInSidebar(!showChordsInSidebar)} />
                <SidebarButton icon={Activity} label="Afinação" onClick={() => {}} />
                <SidebarButton icon={Bookmark} label="Capotraste" onClick={() => {}} />
                <SidebarButton icon={Eye} label="Exibir" onClick={() => {}} />
                
                <div className="my-2 border-t border-gray-100"></div>

                <SidebarButton icon={PlusCircle} label="Adicionar à lista" onClick={() => {}} />
                <SidebarButton icon={Timer} label="Metrônomo" onClick={() => {}} />
                <SidebarButton icon={Book} label="Dicionário" onClick={() => {}} />
                <SidebarButton icon={Edit} label="Corrigir" onClick={() => {}} />
                <SidebarButton icon={Printer} label="Imprimir" onClick={() => window.print()} />
                <SidebarButton icon={Download} label="Baixar cifra" onClick={() => {}} />

                <div className="mt-4 p-4 bg-[#ff7a00] rounded-xl text-center shadow-lg shadow-[#ff7a00]/20 cursor-pointer hover:scale-[1.02] transition-transform">
                   <div className="text-white font-black text-[12px] uppercase tracking-tighter">Cifra Master PRO</div>
                   <div className="text-white/80 text-[9px] font-bold mt-1 uppercase">Toque como um profissional</div>
                </div>
              </aside>

              {/* CONTEÚDO DA MÚSICA */}
              <div className="flex-1 min-w-0">
                <div className="mb-10">
                   <div className="flex items-center gap-2 mb-4">
                     <span className="text-[10px] font-black text-[#ff7a00] uppercase tracking-widest bg-[#ff7a00]/10 px-2 py-0.5 rounded">Tom: {currentSong.originalKey || 'A'}</span>
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-none mb-2 uppercase">{currentSong.title}</h2>
                   <h3 className="text-xl font-medium text-gray-400">{currentSong.artist}</h3>
                </div>

                <ChordDisplay content={transposedContent} fontSize={fontSize} instrument={selectedInstrument} />

                <div className="mt-20 pt-10 border-t border-gray-100">
                  <h4 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight flex items-center gap-3">
                    <Grid className="w-6 h-6 text-[#38cc63]" /> Acordes Utilizados
                  </h4>
                  <div className="flex flex-wrap gap-8">
                    {songChords.map(chord => (
                      <ChordDiagram key={chord} chord={chord} instrument={selectedInstrument} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {!isJoaoOpen && (
        <button 
          onClick={() => setIsJoaoOpen(true)} 
          className="fixed bottom-8 right-8 w-16 h-16 bg-[#1c1c1c] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[80] group border-4 border-white"
        >
          <Bot className="text-[#38cc63] w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#38cc63] rounded-full border-4 border-white"></div>
        </button>
      )}

      <JoaoAssistant isOpen={isJoaoOpen} onClose={() => setIsJoaoOpen(false)} onSongFound={handleSongSelect} />
    </div>
  );
};

export default App;
