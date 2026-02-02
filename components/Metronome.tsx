
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, Plus, Minus, Music, Timer, Volume2, ArrowLeft, Zap, Drum } from 'lucide-react';

interface MetronomeProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIME_SIGNATURES = [
  { label: '2/4', beats: 2 },
  { label: '3/4', beats: 3 },
  { label: '4/4', beats: 4 },
  { label: '6/8', beats: 6 },
];

const Metronome: React.FC<MetronomeProps> = ({ isOpen, onClose }) => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const audioContext = useRef<AudioContext | null>(null);
  const nextNoteTime = useRef(0);
  const timerID = useRef<number | null>(null);
  const lastTapTime = useRef<number>(0);

  const playClick = useCallback((time: number, isFirstBeat: boolean) => {
    if (!audioContext.current) return;
    
    const osc = audioContext.current.createOscillator();
    const envelope = audioContext.current.createGain();

    osc.frequency.value = isFirstBeat ? 1000 : 800;
    envelope.gain.value = volume;
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(envelope);
    envelope.connect(audioContext.current.destination);

    osc.start(time);
    osc.stop(time + 0.1);
  }, [volume]);

  const scheduler = useCallback(() => {
    while (nextNoteTime.current < audioContext.current!.currentTime + 0.1) {
      const isFirstBeat = currentBeat % beatsPerMeasure === 0;
      playClick(nextNoteTime.current, isFirstBeat);
      
      const secondsPerBeat = 60.0 / bpm;
      nextNoteTime.current += secondsPerBeat;
      
      setCurrentBeat(prev => (prev + 1) % beatsPerMeasure);
    }
    timerID.current = window.setTimeout(scheduler, 25);
  }, [bpm, beatsPerMeasure, currentBeat, playClick]);

  const startStop = () => {
    if (isPlaying) {
      if (timerID.current) clearTimeout(timerID.current);
      setIsPlaying(false);
      setCurrentBeat(0);
    } else {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      setIsPlaying(true);
      nextNoteTime.current = audioContext.current.currentTime;
      scheduler();
    }
  };

  const handleTap = () => {
    const now = Date.now();
    const diff = now - lastTapTime.current;
    if (diff < 2000 && diff > 200) {
      const newBpm = Math.round(60000 / diff);
      setBpm(Math.min(240, Math.max(40, newBpm)));
    }
    lastTapTime.current = now;
  };

  useEffect(() => {
    if (!isOpen && isPlaying) {
      startStop();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#1c1c1c] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#38cc63] rounded-2xl flex items-center justify-center shadow-lg shadow-[#38cc63]/20">
              <Timer className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-black text-xl tracking-tight uppercase">Metrônomo</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#38cc63] animate-pulse' : 'bg-gray-500'}`}></span>
                {isPlaying ? 'Ritmo Ativo' : 'Aguardando Início'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 pt-6">
          
          {/* BPM Main Display */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group cursor-pointer" onClick={handleTap}>
               <div className="text-8xl font-black text-white tracking-tighter transition-all group-hover:scale-105">{bpm}</div>
               <div className="text-[10px] font-black text-[#38cc63] uppercase tracking-widest text-center mt-[-10px]">BPM</div>
               <div className="absolute -inset-4 bg-[#38cc63]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            <div className="flex items-center gap-8 mt-6">
              <button 
                onClick={() => setBpm(b => Math.max(40, b - 1))}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all"
              >
                <Minus className="w-6 h-6" />
              </button>
              <input 
                type="range" 
                min="40" 
                max="240" 
                value={bpm} 
                onChange={(e) => setBpm(parseInt(e.target.value))}
                className="w-32 accent-[#38cc63] h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <button 
                onClick={() => setBpm(b => Math.min(240, b + 1))}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Visual Beat Indicator */}
          <div className="flex justify-center gap-4 mb-10 h-8 items-center">
             {Array.from({ length: beatsPerMeasure }).map((_, i) => (
               <div 
                 key={i} 
                 className={`transition-all duration-100 rounded-full ${
                   isPlaying && currentBeat === i 
                    ? i === 0 
                      ? 'w-6 h-6 bg-[#38cc63] shadow-[0_0_15px_#38cc63] scale-125' 
                      : 'w-5 h-5 bg-[#38cc63]/60 shadow-[0_0_10px_#38cc63/40] scale-110'
                    : 'w-4 h-4 bg-white/10 border border-white/5'
                 }`}
               ></div>
             ))}
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10">
             <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-3 text-center">Compasso</span>
                <div className="grid grid-cols-2 gap-2">
                   {TIME_SIGNATURES.map((sig) => (
                     <button
                       key={sig.label}
                       onClick={() => { setBeatsPerMeasure(sig.beats); setCurrentBeat(0); }}
                       className={`py-2 text-[10px] font-black rounded-xl transition-all ${
                         beatsPerMeasure === sig.beats 
                          ? 'bg-[#38cc63] text-white' 
                          : 'bg-white/5 text-gray-400 hover:text-white'
                       }`}
                     >
                       {sig.label}
                     </button>
                   ))}
                </div>
             </div>
             
             <div className="bg-white/5 p-4 rounded-3xl border border-white/5 flex flex-col items-center justify-center">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-3">Volume</span>
                <div className="flex items-center gap-3 w-full">
                   <Volume2 className="w-4 h-4 text-gray-400" />
                   <input 
                     type="range" 
                     min="0" 
                     max="1" 
                     step="0.1"
                     value={volume} 
                     onChange={(e) => setVolume(parseFloat(e.target.value))}
                     className="flex-1 accent-[#38cc63] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                   />
                </div>
                <button 
                  onClick={handleTap}
                  className="mt-4 w-full py-2 bg-[#38cc63]/10 text-[#38cc63] border border-[#38cc63]/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#38cc63] hover:text-white transition-all active:scale-95"
                >
                  Tap Tempo
                </button>
             </div>
          </div>

          {/* Main Action Button */}
          <button
            onClick={startStop}
            className={`w-full py-6 rounded-[2rem] font-black text-base uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-2xl ${
              isPlaying 
                ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600' 
                : 'bg-[#38cc63] text-white shadow-[#38cc63]/20 hover:bg-[#2da34f]'
            }`}
          >
            {isPlaying ? (
              <><Pause className="w-6 h-6 fill-white" /> Parar Metrônomo</>
            ) : (
              <><Play className="w-6 h-6 fill-white" /> Iniciar Batida</>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/5 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2">
             <Drum className="w-3 h-3 text-[#38cc63]" />
             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Beat Master Engine</span>
           </div>
           <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
           <div className="flex items-center gap-2">
             <Zap className="w-3 h-3 text-yellow-500" />
             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Latência Zero</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Metronome;
