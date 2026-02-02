
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Mic, MicOff, Settings2, Music, Zap, Volume2, Info, Activity, ArrowLeft } from 'lucide-react';

interface TunerProps {
  isOpen: boolean;
  onClose: () => void;
}

const INSTRUMENTS_TUNING = [
  { name: 'Cromático', notes: [] },
  { name: 'Guitarra', notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
  { name: 'Baixo', notes: ['E1', 'A1', 'D2', 'G2'] },
  { name: 'Ukulele', notes: ['G4', 'C4', 'E4', 'A4'] },
  { name: 'Violino', notes: ['G3', 'D4', 'A4', 'E5'] },
  { name: 'Banjo', notes: ['G4', 'D3', 'G3', 'B3', 'D4'] },
  { name: 'Bandolim', notes: ['G3', 'D4', 'A4', 'E5'] },
  { name: 'Piano', notes: [] },
];

const NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const Tuner: React.FC<TunerProps> = ({ isOpen, onClose }) => {
  const [activeInstrument, setActiveInstrument] = useState('Cromático');
  const [isListening, setIsListening] = useState(false);
  const [pitch, setPitch] = useState<number | null>(null);
  const [note, setNote] = useState<string>("-");
  const [detune, setDetune] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const micStream = useRef<MediaStream | null>(null);
  const animationFrame = useRef<number | null>(null);

  const getNoteFromFrequency = (frequency: number) => {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69;
  };

  const getFrequencyFromNoteNumber = (note: number) => {
    return 440 * Math.pow(2, (note - 69) / 12);
  };

  const centsOffFromPitch = (frequency: number, note: number) => {
    return Math.floor((1200 * Math.log(frequency / getFrequencyFromNoteNumber(note))) / Math.log(2));
  };

  const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
    let SIZE = buffer.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      let val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break; }

    buffer = buffer.slice(r1, r2);
    SIZE = buffer.length;

    let c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++)
      for (let j = 0; j < SIZE - i; j++)
        c[i] = c[i] + buffer[j] * buffer[j + i];

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  };

  const updatePitch = useCallback(() => {
    if (!analyser.current) return;
    const buffer = new Float32Array(2048);
    analyser.current.getFloatTimeDomainData(buffer);
    const ac = autoCorrelate(buffer, audioContext.current!.sampleRate);

    if (ac !== -1) {
      setPitch(ac);
      const noteNum = getNoteFromFrequency(ac);
      setNote(NOTE_STRINGS[noteNum % 12]);
      setDetune(centsOffFromPitch(ac, noteNum));
    } else {
      // Don't clear note immediately to avoid flickering
    }

    animationFrame.current = requestAnimationFrame(updatePitch);
  }, []);

  const startListening = async () => {
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream.current = stream;
      
      const source = audioContext.current.createMediaStreamSource(stream);
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 2048;
      source.connect(analyser.current);
      
      setIsListening(true);
      setError(null);
      updatePitch();
    } catch (err) {
      console.error(err);
      setError("Permissão de microfone negada ou não disponível.");
    }
  };

  const stopListening = () => {
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    if (micStream.current) micStream.current.getTracks().forEach(t => t.stop());
    setIsListening(false);
    setPitch(null);
    setNote("-");
    setDetune(0);
  };

  useEffect(() => {
    if (!isOpen) stopListening();
    return () => stopListening();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#1c1c1c] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#38cc63] rounded-2xl flex items-center justify-center shadow-lg shadow-[#38cc63]/20">
              <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <div>
              <h3 className="text-white font-black text-xl tracking-tight uppercase">Afinador Master</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-[#38cc63] animate-pulse' : 'bg-red-500'}`}></span>
                {isListening ? 'Escutando em tempo real' : 'Microfone desligado'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 bg-[#38cc63] hover:bg-[#2da34f] text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-[#38cc63]/20"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 pt-6">
          {/* Instrument Selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-10 pb-2">
            {INSTRUMENTS_TUNING.map((inst) => (
              <button
                key={inst.name}
                onClick={() => setActiveInstrument(inst.name)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border-2 ${
                  activeInstrument === inst.name 
                    ? 'bg-[#38cc63] border-[#38cc63] text-white shadow-lg shadow-[#38cc63]/20' 
                    : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                {inst.name}
              </button>
            ))}
          </div>

          {/* Tuner Gauge Visualizer */}
          <div className="relative flex flex-col items-center justify-center py-10">
            {/* Needle Gauge */}
            <div className="relative w-full h-40 flex items-end justify-center px-10">
              <div className="absolute inset-x-10 h-1 bg-white/10 rounded-full bottom-0 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-150 rounded-full ${Math.abs(detune) < 5 ? 'bg-[#38cc63]' : 'bg-red-500'}`}
                  style={{ width: '4px', position: 'absolute', left: `${50 + (detune / 100) * 100}%`, transform: 'translateX(-50%)' }}
                ></div>
              </div>
              
              {/* Scale marks */}
              <div className="absolute inset-x-10 bottom-2 flex justify-between text-[8px] font-black text-white/20 uppercase tracking-tighter">
                <span>Bemol</span>
                <span className="text-white/40">Ideal</span>
                <span>Sustenido</span>
              </div>

              {/* Central Display */}
              <div className="flex flex-col items-center">
                <div className={`text-8xl font-black transition-colors duration-200 ${isListening && Math.abs(detune) < 5 ? 'text-[#38cc63]' : 'text-white'}`}>
                  {note}
                </div>
                <div className="text-gray-400 text-xs font-mono font-bold mt-2">
                  {pitch ? `${pitch.toFixed(1)} Hz` : '--- Hz'}
                </div>
              </div>
            </div>

            {/* Cents Indicator */}
            <div className="mt-8 flex items-center gap-6">
               <div className={`flex flex-col items-center transition-opacity ${detune < -5 ? 'opacity-100' : 'opacity-20'}`}>
                 <span className="text-[10px] font-black text-red-500 uppercase">Flat</span>
               </div>
               <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${Math.abs(detune) < 5 ? 'border-[#38cc63] bg-[#38cc63]/10 scale-125' : 'border-white/10'}`}>
                 <Activity className={`w-5 h-5 ${Math.abs(detune) < 5 ? 'text-[#38cc63]' : 'text-gray-500'}`} />
               </div>
               <div className={`flex flex-col items-center transition-opacity ${detune > 5 ? 'opacity-100' : 'opacity-20'}`}>
                 <span className="text-[10px] font-black text-red-500 uppercase">Sharp</span>
               </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center text-xs font-bold flex items-center gap-3">
              <MicOff className="w-4 h-4" /> {error}
            </div>
          )}

          {/* Reference Notes (if specific instrument selected) */}
          {activeInstrument !== 'Cromático' && activeInstrument !== 'Piano' && (
            <div className="mt-10">
              <h4 className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-4 text-center">Notas de Referência</h4>
              <div className="flex justify-center gap-3">
                {INSTRUMENTS_TUNING.find(i => i.name === activeInstrument)?.notes.map((n) => (
                  <button 
                    key={n}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-gray-400 hover:bg-[#38cc63] hover:text-white hover:border-[#38cc63] transition-all uppercase"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-12">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl ${
                isListening 
                  ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600' 
                  : 'bg-[#38cc63] text-white shadow-[#38cc63]/20 hover:bg-[#2da34f]'
              }`}
            >
              {isListening ? (
                <><MicOff className="w-5 h-5" /> Parar Afinador</>
              ) : (
                <><Mic className="w-5 h-5" /> Começar Afinação</>
              )}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-6 bg-white/5 text-center">
          <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <Info className="w-3 h-3" /> Fique em um ambiente silencioso para melhor precisão
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tuner;
