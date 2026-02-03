
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Mic, MicOff, Activity, Hash, Music2 } from 'lucide-react';

const Tuner: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState("-");
  const [detune, setDetune] = useState(0);
  const [notation, setNotation] = useState<'#' | 'b'>('#');

  // Cores de alta visibilidade
  const COLOR_IN_TUNE = "#00ff66"; // Verde Neon
  const COLOR_OUT_TUNE = "#ff0044"; // Vermelho vibrante
  const isInTune = Math.abs(detune) < 5 && note !== "-";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0a0a0a] rounded-[3rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden">
        
        {/* Background Glow decorativo */}
        <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[100px] transition-colors duration-500 ${isInTune ? 'bg-[#00ff66]/10' : 'bg-red-500/5'}`}></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#1c1c1c] rounded-2xl flex items-center justify-center shadow-xl border border-white/5">
                <Activity className={`${isInTune ? 'text-[#00ff66]' : 'text-gray-400'} w-7 h-7 transition-colors`} />
              </div>
              <div>
                <h3 className="text-white font-black text-2xl uppercase tracking-tighter">Afinador</h3>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Precisão Master</p>
              </div>
            </div>
            
            {/* Seletor de Notação # / b */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setNotation('#')}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${notation === '#' ? 'bg-[#00ff66] text-black shadow-[0_0_15px_#00ff66]' : 'text-gray-500 hover:text-white'}`}
              >
                <Hash className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setNotation('b')}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${notation === 'b' ? 'bg-[#00ff66] text-black shadow-[0_0_15px_#00ff66]' : 'text-gray-500 hover:text-white'}`}
              >
                <span className="font-black text-xl leading-none">b</span>
              </button>
            </div>

            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors ml-2">
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            <div 
              className={`text-[10rem] leading-none font-black transition-all duration-300 select-none ${isInTune ? 'text-[#00ff66]' : 'text-white'}`}
              style={{ 
                textShadow: isInTune ? `0 0 40px ${COLOR_IN_TUNE}66` : 'none',
                filter: isInTune ? 'brightness(1.2)' : 'none'
              }}
            >
              {note}
            </div>
            
            <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-12 text-gray-600">
              {isInTune ? 'Afinado' : 'Ajuste a Corda'}
            </div>

            {/* Meter de Precisão */}
            <div className="w-full relative h-16 flex items-end">
              {/* Escala */}
              <div className="absolute inset-0 flex justify-between px-2 opacity-20">
                {Array.from({length: 11}).map((_, i) => (
                  <div key={i} className={`w-0.5 ${i === 5 ? 'h-full bg-white' : 'h-1/2 bg-white'}`}></div>
                ))}
              </div>

              {/* Trilho da Agulha */}
              <div className="w-full h-1.5 bg-white/10 rounded-full relative overflow-visible">
                {/* Marcador Central */}
                <div className="absolute left-1/2 -top-4 -translate-x-1/2 w-0.5 h-10 bg-white/30"></div>
                
                {/* Agulha (Marcador Dinâmico) */}
                <div 
                  className={`absolute -top-6 h-14 w-1.5 rounded-full transition-all duration-150 ease-out shadow-xl ${isInTune ? 'bg-[#00ff66]' : 'bg-[#ff0044]'}`}
                  style={{ 
                    left: `${50 + (detune)}%`,
                    boxShadow: isInTune ? `0 0 20px ${COLOR_IN_TUNE}` : `0 0 20px ${COLOR_OUT_TUNE}`
                  }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between w-full mt-4 px-2 text-[9px] font-black uppercase tracking-widest text-gray-600">
              <span>Bemol</span>
              <span>Perfeito</span>
              <span>Sustenido</span>
            </div>
          </div>

          <button 
            onClick={() => setIsListening(!isListening)} 
            className={`w-full mt-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
              isListening 
                ? 'bg-[#ff0044] text-white shadow-[#ff0044]/20' 
                : 'bg-[#00ff66] text-black shadow-[#00ff66]/20'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            {isListening ? 'Desativar Microfone' : 'Ativar Microfone'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tuner;
