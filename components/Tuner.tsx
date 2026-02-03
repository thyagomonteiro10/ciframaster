
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Mic, MicOff, Activity } from 'lucide-react';

const Tuner: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState("-");
  const [detune, setDetune] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#1c1c1c] rounded-[2.5rem] p-8 shadow-2xl border border-white/10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#22c55e] rounded-xl flex items-center justify-center shadow-lg shadow-[#22c55e]/20"><Activity className="text-white w-6 h-6" /></div>
            <h3 className="text-white font-black text-xl uppercase tracking-tight">Afinador</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>
        <div className="flex flex-col items-center justify-center py-10">
          <div className={`text-9xl font-black mb-4 ${Math.abs(detune) < 5 ? 'text-[#22c55e]' : 'text-white'}`}>{note}</div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-10 relative overflow-hidden">
             <div className={`absolute top-0 h-full w-2 ${Math.abs(detune) < 5 ? 'bg-[#22c55e]' : 'bg-red-500'}`} style={{ left: `${50 + (detune/2)}%` }}></div>
          </div>
        </div>
        <button onClick={() => setIsListening(!isListening)} className={`w-full py-5 rounded-2xl font-black uppercase shadow-lg transition-all ${isListening ? 'bg-red-500 text-white' : 'bg-[#22c55e] text-white shadow-[#22c55e]/20'}`}>
          {isListening ? 'Desligar Microfone' : 'Ativar Microfone'}
        </button>
      </div>
    </div>
  );
};

export default Tuner;
