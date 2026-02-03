
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Mic, MicOff, Activity, Hash, Music2, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

const Tuner: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState("-");
  const [detune, setDetune] = useState(0);
  const [notation, setNotation] = useState<'#' | 'b'>('#');
  const [frequency, setFrequency] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

  const COLOR_IN_TUNE = "#00ff66"; // Verde Neon
  const COLOR_OUT_TUNE = "#ff0044"; // Vermelho vibrante
  const isInTune = Math.abs(detune) < 3 && note !== "-";

  const stopTuner = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setNote("-");
    setDetune(0);
    setFrequency(0);
  }, []);

  const startTuner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096; // Aumentado para melhor resolução em baixas frequências
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsListening(true);
      updatePitch();
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
      alert("Permissão de microfone negada ou não disponível.");
    }
  };

  const updatePitch = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyserRef.current.getFloatTimeDomainData(buffer);

    const freq = autoCorrelate(buffer, audioContextRef.current!.sampleRate);

    if (freq !== -1) {
      setFrequency(freq);
      const midiNote = 12 * (Math.log2(freq / 440)) + 69;
      const roundedNote = Math.round(midiNote);
      const diff = (midiNote - roundedNote) * 100;

      const noteName = notation === '#' 
        ? notesSharp[roundedNote % 12] 
        : notesFlat[roundedNote % 12];

      setNote(noteName);
      setDetune(diff);
    }

    animationFrameRef.current = requestAnimationFrame(updatePitch);
  };

  const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
    let size = buffer.length;
    let rms = 0;
    for (let i = 0; i < size; i++) rms += buffer[i] * buffer[i];
    rms = Math.sqrt(rms / size);
    if (rms < 0.005) return -1; // Sensibilidade ajustada

    let r1 = 0, r2 = size - 1, thres = 0.2;
    for (let i = 0; i < size / 2; i++) if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < size / 2; i++) if (Math.abs(buffer[size - i]) < thres) { r2 = size - i; break; }

    const buf = buffer.slice(r1, r2);
    size = buf.length;
    const c = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - i; j++) c[i] = c[i] + buf[j] * buf[j + i];
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < size; i++) {
      if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
    }
    let T0 = maxpos;
    const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  };

  useEffect(() => {
    return () => stopTuner();
  }, [stopTuner]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/98 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-[#050505] rounded-[4rem] p-10 shadow-[0_0_100px_rgba(0,0,0,0.9)] border border-white/10 overflow-hidden">
        
        {/* Glow de Fundo Dinâmico */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[150px] transition-all duration-1000 opacity-20"
          style={{ background: isInTune ? `radial-gradient(circle, ${COLOR_IN_TUNE} 0%, transparent 70%)` : `radial-gradient(circle, ${COLOR_OUT_TUNE} 0%, transparent 70%)` }}
        ></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => { stopTuner(); onClose(); }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-[#00ff66] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-[#00ff66]/30"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
              <div className="w-12 h-12 bg-[#111] rounded-xl flex items-center justify-center border border-white/10">
                <Activity className={`${isInTune ? 'text-[#00ff66]' : 'text-gray-600'} w-6 h-6 transition-colors duration-200`} />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 bg-white/5 p-1.5 rounded-[1.25rem] border border-white/10">
              <button 
                onClick={() => setNotation('#')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${notation === '#' ? 'bg-[#00ff66] text-black shadow-[0_0_20px_rgba(0,255,102,0.4)]' : 'text-gray-500 hover:text-white'}`}
              >
                #
              </button>
              <button 
                onClick={() => setNotation('b')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${notation === 'b' ? 'bg-[#00ff66] text-black shadow-[0_0_20px_rgba(0,255,102,0.4)]' : 'text-gray-500 hover:text-white'}`}
              >
                b
              </button>
            </div>

            <button onClick={() => { stopTuner(); onClose(); }} className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            
            {/* Visualização de Nota Principal */}
            <div className="relative mb-4">
              <div 
                className={`text-[12rem] leading-none font-black transition-all duration-100 select-none ${isInTune ? 'text-[#00ff66]' : 'text-white'}`}
                style={{ 
                  textShadow: isInTune ? `0 0 60px ${COLOR_IN_TUNE}aa` : '0 0 30px rgba(255,255,255,0.1)',
                  filter: isInTune ? 'brightness(1.2)' : 'none'
                }}
              >
                {note}
              </div>
            </div>
            
            <div className={`text-xs font-black uppercase tracking-[0.6em] mb-12 transition-colors ${isInTune ? 'text-[#00ff66]' : 'text-gray-700'}`}>
              {note === "-" ? "Toque uma corda" : isInTune ? 'PERFEITO' : 'AJUSTE'}
            </div>

            {/* Fita Cromática de Precisão */}
            <div className="w-full relative h-28 flex items-center justify-center overflow-hidden rounded-3xl bg-white/5 border border-white/5 px-4">
              
              {/* Marcador Central Fixo */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#00ff66] z-20 shadow-[0_0_15px_#00ff66]">
                 <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#00ff66] rotate-45"></div>
              </div>

              {/* Trilho de Notas */}
              <div className="w-full relative h-full flex items-center">
                 {/* Escala de Detune */}
                 <div className="absolute inset-x-0 h-10 flex justify-between px-10">
                    {Array.from({length: 21}).map((_, i) => {
                      const pos = i - 10;
                      return (
                        <div 
                          key={i} 
                          className={`w-0.5 rounded-full transition-all duration-300 ${pos === 0 ? 'h-full bg-[#00ff66]/40' : i % 5 === 0 ? 'h-3/4 bg-white/20' : 'h-1/4 bg-white/10'}`}
                        ></div>
                      );
                    })}
                 </div>

                 {/* Agulha Neon */}
                 <div 
                    className={`absolute h-20 w-1.5 rounded-full transition-all duration-150 ease-out z-10 ${isInTune ? 'bg-[#00ff66]' : 'bg-[#ff0044]'}`}
                    style={{ 
                      left: `calc(50% + ${detune * 0.45}%)`,
                      boxShadow: isInTune 
                        ? `0 0 25px ${COLOR_IN_TUNE}, 0 0 50px ${COLOR_IN_TUNE}66` 
                        : `0 0 25px ${COLOR_OUT_TUNE}, 0 0 50px ${COLOR_OUT_TUNE}66`,
                      transform: `translateX(-50%) scale(${note === "-" ? 0 : 1})`,
                      opacity: note === "-" ? 0 : 1
                    }}
                 ></div>
              </div>
            </div>
            
            {/* Rótulos de Direção */}
            <div className="flex justify-between w-full mt-6 px-10 text-[9px] font-black uppercase tracking-[0.2em] text-gray-800">
              <span className={detune < -10 ? "text-[#ff0044] animate-pulse" : ""}>Muito Baixo</span>
              <span className={isInTune ? "text-[#00ff66]" : ""}>Centro</span>
              <span className={detune > 10 ? "text-[#ff0044] animate-pulse" : ""}>Muito Alto</span>
            </div>
          </div>

          {/* Botão de Ação */}
          <button 
            onClick={() => isListening ? stopTuner() : startTuner()} 
            className={`w-full mt-12 py-8 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl transition-all active:scale-[0.97] flex items-center justify-center gap-5 border-t border-white/10 ${
              isListening 
                ? 'bg-[#ff0044] text-white shadow-[#ff0044]/40' 
                : 'bg-[#00ff66] text-black shadow-[#00ff66]/40'
            }`}
          >
            {isListening ? (
              <><MicOff className="w-5 h-5" /> Desligar Afinador</>
            ) : (
              <><Mic className="w-5 h-5" /> Iniciar Afinador</>
            )}
          </button>
          
          <p className="mt-8 text-center text-gray-700 text-[8px] font-black uppercase tracking-[0.3em]">
            Algoritmo de Precisão Master • 440Hz Reference
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tuner;
