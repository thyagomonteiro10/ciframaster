
import React, { useState } from 'react';
import { X, Play, Pause, Plus, Minus, Timer } from 'lucide-react';

const Metronome: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-[#1c1c1c] rounded-[2.5rem] p-8 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#22c55e] rounded-xl flex items-center justify-center shadow-lg shadow-[#22c55e]/20"><Timer className="text-white w-6 h-6" /></div>
              <h3 className="text-white font-black text-xl uppercase tracking-tight">Metrônomo</h3>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="flex flex-col items-center mb-10">
           <div className="text-8xl font-black text-white">{bpm}</div>
           <div className="text-[#22c55e] font-black uppercase tracking-widest text-xs">BPM</div>
           <div className="flex items-center gap-6 mt-8">
              <button onClick={() => setBpm(b => Math.max(40, b - 1))} className="w-12 h-12 rounded-full bg-white/5 text-white border border-white/10 flex items-center justify-center hover:bg-[#22c55e]/10 transition-all"><Minus /></button>
              <button onClick={() => setBpm(b => Math.min(240, b + 1))} className="w-12 h-12 rounded-full bg-white/5 text-white border border-white/10 flex items-center justify-center hover:bg-[#22c55e]/10 transition-all"><Plus /></button>
           </div>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} className={`w-full py-6 rounded-2xl font-black uppercase transition-all shadow-lg ${isPlaying ? 'bg-red-500 text-white' : 'bg-[#22c55e] text-white shadow-[#22c55e]/20'}`}>
          {isPlaying ? 'Parar' : 'Iniciar'}
        </button>
      </div>
    </div>
  );
};

export default Metronome;
