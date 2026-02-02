
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Play, Pause, Grid, Printer, Music, Heart, X, Bot, Link as LinkIcon, 
  Globe, ChevronRight, Menu, Search, Video, Settings, ChevronDown, 
  Maximize2, Type as FontIcon, Minus, Plus, Share2, Guitar, Star, Users, Flame, Disc, ArrowLeft, CheckCircle2, Bookmark,
  Scissors, ArrowUpDown, Type, Eye, PlusCircle, Timer, Book, Edit, Activity, Folder, ExternalLink, Info
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

      <div className="py-12 text-center bg-gray-50 rounded-3xl border border-gray-100 px-6">
        <Bot className="w-12 h-12 text-[#38cc63]/20 mx-auto mb-4" />
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
          Encontre pastas exclusivas de artistas ou peça ao João para buscar qualquer música.
        </p>
      </div>
    </div>
  );

  const renderArtistsView = () => {
    const artists = groupedContent[selectedGenre!] || {};
    const artistNames = Object.keys(artists);

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-[10px] font-black text-[#38cc63] uppercase tracking-[0.2em] mb-8 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar aos Gêneros
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-100 pb-10">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase mb-2">{selectedGenre}</h1>
            <div className="flex items-center gap-4">
               <div className="w-16 h-1 bg-[#38cc63]"></div>
               <p className="text-xl font-bold text-gray-400">Selecione um Artista</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artistNames.map((artist) => {
            const artistSongs = artists[artist];
            const artistImage = artistSongs[0]?.imageUrl;

            return (
              <button 
                key={artist}
                onClick={() => handleArtistClick(artist)}
                className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#38cc63] hover:shadow-xl transition-all text-left"
              >
                <div className="h-32 bg-gray-50 flex items-center justify-center border-b border-gray-100 group-hover:bg-[#38cc63]/5 transition-colors relative overflow-hidden">
                  {artistImage ? (
                    <>
                      <img src={artistImage} alt={artist} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </>
                  ) : (
                    <Folder className="w-12 h-12 text-gray-200 group-hover:text-[#38cc63]/40 transition-colors" />
                  )}
                   <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm text-[9px] font-black text-gray-400 group-hover:text-[#38cc63]">
                      {artistSongs.length} MÚSICAS
                   </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                     <h3 className="font-black text-gray-900 uppercase tracking-tight group-hover:text-[#38cc63] transition-colors">{artist}</h3>
                     <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Pasta do Artista</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#38cc63] group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSongsView = () => {
    const songs = groupedContent[selectedGenre!]?.[selectedArtist!] || [];

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-[10px] font-black text-[#38cc63] uppercase tracking-[0.2em] mb-8 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para {selectedGenre}
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-100 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="px-2 py-1 bg-gray-100 text-[9px] font-black text-gray-400 rounded uppercase">{selectedGenre}</span>
               <span className="text-gray-300">/</span>
               <span className="text-[9px] font-black text-[#38cc63] uppercase">Pasta do Artista</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase mb-2">{selectedArtist}</h1>
            <p className="text-gray-400 font-medium">{songs.length} cifras disponíveis nesta coleção.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.map((song, idx) => (
            <div 
              key={song.id}
              onClick={() => handleSongSelect(song)}
              className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#38cc63] hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#38cc63] uppercase tracking-widest">#{idx + 1}</span>
                  {song.verified && <CheckCircle2 className="w-3 h-3 text-[#38cc63] fill-[#38cc63]/10" />}
                </div>
                <h4 className="font-bold text-gray-800 text-lg truncate pr-4 group-hover:text-[#38cc63] transition-colors">{song.title}</h4>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">{song.difficulty}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#38cc63] group-hover:text-white transition-all shadow-inner">
                <Play className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SidebarButton = ({ icon: Icon, label, onClick, children }: any) => (
    <div className="flex flex-col gap-1 w-full">
      <button 
        onClick={onClick}
        className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all group"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
          <span className="text-[12px] text-gray-600 font-medium">{label}</span>
        </div>
        {children}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col font-sans">
      <header className="bg-[#1c1c1c] text-white sticky top-0 z-[60] h-14 md:h-16 flex items-center shadow-lg">
        <div className="max-w-[1280px] mx-auto w-full px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setCurrentSong(null); setSelectedGenre(null); setSelectedArtist(null); }}>
            <div className="bg-[#38cc63] p-2 rounded-lg">
              <Music className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-xl md:text-2xl tracking-tight hidden sm:block uppercase">CIFRA<span className="text-[#38cc63]"> MASTER</span></span>
          </div>
          
          <div className="flex-1 max-w-2xl relative">
            <SearchInput onSearch={handleSearch} isLoading={isLoading} />
          </div>

          <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-tight opacity-80">
            {GENRES.slice(0, 6).map(g => (
              <button key={g} onClick={() => handleGenreClick(g)} className={`transition-colors ${selectedGenre === g ? 'text-[#38cc63]' : 'hover:text-[#38cc63]'}`}>{g}</button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-600 border border-white/20 hidden md:block overflow-hidden">
               <img 
                 src="https://ui-avatars.com/api/?name=User&background=38cc63&color=fff" 
                 alt="User" 
                 width="32" 
                 height="32" 
                 loading="lazy" 
               />
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 h-10 flex items-center overflow-x-auto no-scrollbar shadow-sm">
        <div className="max-w-[1280px] mx-auto w-full px-4 flex items-center gap-8 whitespace-nowrap">
          {INSTRUMENTS.map(inst => (
            <button 
              key={inst} 
              onClick={() => setSelectedInstrument(inst)}
              className={`text-[11px] font-black uppercase tracking-widest h-full border-b-2 transition-all ${selectedInstrument === inst ? 'border-[#38cc63] text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {inst}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 max-w-[1280px] mx-auto w-full px-4 pt-6 gap-6 mb-20">
        <main className="flex-1 min-w-0 bg-white rounded-t-xl border border-gray-200 border-b-0 p-4 md:p-10 shadow-sm relative">
          {!currentSong && !selectedGenre && renderHome()}
          {selectedGenre && !selectedArtist && !currentSong && renderArtistsView()}
          {selectedArtist && !currentSong && renderSongsView()}
          
          {currentSong && (
            <div className="flex flex-col xl:flex-row gap-10">
              <aside className="hidden xl:flex flex-col gap-2 w-[220px] shrink-0 sticky top-24 h-fit">
                <button 
                  onClick={handleBack}
                  className="flex items-center gap-2 text-[10px] font-black text-[#38cc63] uppercase tracking-[0.2em] mb-4 hover:translate-x-[-4px] transition-transform"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar à Pasta
                </button>

                <SidebarButton icon={Scissors} label="Simplificar cifra" onClick={() => {}} />
                <SidebarButton icon={ArrowUpDown} label="Auto rolagem" onClick={() => setIsAutoScrolling(!isAutoScrolling)}>
                   <div className={`w-3 h-3 rounded-full ${isAutoScrolling ? 'bg-[#38cc63] animate-pulse' : 'bg-gray-200'}`}></div>
                </SidebarButton>

                <div className="bg-white border border-gray-200 rounded-lg p-1 flex items-center justify-between group px-3 py-1">
                   <div className="flex items-center gap-3">
                     <Type className="w-4 h-4 text-gray-400" />
                     <span className="text-[12px] text-gray-600 font-medium">Texto</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <button onClick={() => setFontSize(s => Math.max(10, s - 1))} className="p-1 hover:bg-gray-100 rounded text-gray-400"><Minus className="w-3 h-3" /></button>
                     <button onClick={() => setFontSize(s => Math.min(30, s + 1))} className="p-1 hover:bg-gray-100 rounded text-gray-400"><Plus className="w-3 h-3" /></button>
                   </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-1 flex items-center justify-between px-3 py-1">
                   <div className="flex items-center gap-3">
                     <Music className="w-4 h-4 text-gray-400" />
                     <span className="text-[12px] text-gray-600 font-medium">½ Tom</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <button onClick={() => setTransposition(t => t - 1)} className="p-1 hover:bg-gray-100 rounded text-gray-400"><Minus className="w-3 h-3" /></button>
                     <button onClick={() => setTransposition(t => t + 1)} className="p-1 hover:bg-gray-100 rounded text-gray-400"><Plus className="w-3 h-3" /></button>
                   </div>
                </div>

                <SidebarButton icon={Grid} label="Acordes" onClick={() => setShowChordsInSidebar(!showChordsInSidebar)} />
                <SidebarButton icon={Activity} label="Afinação" onClick={() => {}} />
                <SidebarButton icon={Bookmark} label="Capotraste" onClick={() => {}} />
                <SidebarButton icon={Eye} label="Exibir" onClick={() => {}} />
                
                <div className="h-[1px] bg-gray-100 my-2"></div>
                <SidebarButton icon={PlusCircle} label="Adicionar à lista" onClick={() => {}} />
                <div className="h-[1px] bg-gray-100 my-2"></div>
                <SidebarButton icon={Timer} label="Metrônomo" onClick={() => {}} />
                <SidebarButton icon={Book} label="Dicionário" onClick={() => {}} />
                <div className="h-[1px] bg-gray-100 my-2"></div>
                <SidebarButton icon={Edit} label="Corrigir" onClick={() => {}} />
                <SidebarButton icon={Printer} label="Imprimir" onClick={() => window.print()} />
              </aside>

              <div className="flex-1 min-w-0">
                <div className="mb-12">
                  <button 
                    onClick={handleBack}
                    className="flex xl:hidden items-center gap-2 text-[10px] font-black text-[#38cc63] uppercase tracking-[0.2em] mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>
                  
                  {/* Badge de busca em tempo real se a cifra veio da internet */}
                  {currentSong.id.startsWith('web-') && (
                    <div className="mb-6 p-2.5 bg-[#38cc63]/5 border border-[#38cc63]/10 rounded-lg flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-[#38cc63]" />
                          <span className="text-[#38cc63] font-black text-[10px] uppercase tracking-widest">Busca em tempo real ativa</span>
                       </div>
                       <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#38cc63] text-white rounded text-[8px] font-black uppercase tracking-tighter">
                          Versão Atualizada
                       </div>
                    </div>
                  )}

                  {currentSong.capo && (
                    <div className="mb-6 p-2.5 bg-[#ff7a00]/5 border border-[#ff7a00]/10 rounded-lg flex items-center gap-2">
                       <Bookmark className="w-4 h-4 text-[#ff7a00]" />
                       <span className="text-[#ff7a00] font-black text-[10px] uppercase tracking-widest">Capotraste na {currentSong.capo}ª casa</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4 text-[#38cc63] font-black text-[10px] uppercase tracking-[0.2em]">
                    <Music className="w-4 h-4" /> {currentSong.genre} • {currentSong.tuning || 'Afinação Padrão'}
                    {currentSong.verified && <span className="ml-2 flex items-center gap-1 text-[#38cc63]"><CheckCircle2 className="w-3 h-3" /> VERIFICADA</span>}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-none mb-3 uppercase">{currentSong.title}</h2>
                  <h3 className="text-xl md:text-2xl font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">{currentSong.artist}</h3>
                </div>

                <ChordDisplay content={transposedContent} fontSize={fontSize} instrument={selectedInstrument} />

                {/* Exibição das fontes de Grounding */}
                {currentSong.sources && currentSong.sources.length > 0 && (
                  <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                       <Info className="w-4 h-4" /> Fontes Consultadas via Google
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {currentSong.sources.map((source, sIdx) => (
                        <a 
                          key={sIdx}
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[11px] font-bold text-gray-600 hover:border-[#38cc63] hover:text-[#38cc63] transition-all"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {source.title.split('|')[0].trim()}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-24 pt-12 border-t border-gray-100">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <Grid className="w-5 h-5" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 tracking-tight uppercase">Acordes da Música</h4>
                  </div>
                  <div className="flex flex-wrap gap-x-10 gap-y-12">
                    {songChords.map(chord => (
                      <div key={chord} className="transform hover:scale-105 transition-transform">
                        <ChordDiagram chord={chord} instrument={selectedInstrument} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="hidden 2xl:block w-[180px] shrink-0">
                <div className="sticky top-24 space-y-8">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-widest text-center">Acordes Rápidos</h4>
                    <div className="grid grid-cols-1 gap-y-10">
                      {songChords.slice(0, 4).map(chord => (
                        <div key={chord} className="transform scale-[0.7] -my-6">
                           <ChordDiagram chord={chord} instrument={selectedInstrument} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-white border-t border-gray-200 py-16 mt-0">
        <div className="max-w-[1280px] mx-auto px-4 text-center">
           <div className="flex items-center justify-center gap-3 mb-8 opacity-40">
              <Music className="w-8 h-8 text-gray-900" />
              <span className="font-black text-2xl tracking-tighter uppercase">CIFRA<span className="text-[#38cc63]"> MASTER</span></span>
           </div>
           <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed">A maior galeria de cifras inteligentes alimentada por Inteligência Artificial do Brasil.</p>
        </div>
      </footer>

      {!isJoaoOpen && (
        <button 
          onClick={() => setIsJoaoOpen(true)} 
          className="fixed bottom-8 right-8 w-16 h-16 md:w-20 md:h-20 bg-[#1c1c1c] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[80] group border-4 border-white"
          aria-label="Abrir assistente João"
        >
          <Guitar className="text-yellow-400 w-8 h-8 md:w-10 md:h-10 transition-transform" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-pulse"></div>
        </button>
      )}

      <JoaoAssistant isOpen={isJoaoOpen} onClose={() => setIsJoaoOpen(false)} onSongFound={handleSongSelect} />
    </div>
  );
};

export default App;
