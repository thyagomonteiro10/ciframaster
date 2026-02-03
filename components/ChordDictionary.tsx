
import React from 'react';
import { X, BookOpen, Guitar, Music, Keyboard } from 'lucide-react';
import ChordDiagram from './ChordDiagram';

interface ChordDictionaryProps {
  isOpen: boolean;
  onClose: () => void;
  chords: string[];
  instrument: string;
  onInstrumentChange: (inst: string) => void;
}

const ChordDictionary: React.FC<ChordDictionaryProps> = ({ 
  isOpen, 
  onClose, 
  chords, 
  instrument,
  onInstrumentChange 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1c1c1c] rounded-xl flex items-center justify-center shadow-lg border border-[#22c55e]">
              <BookOpen className="text-[#22c55e] w-6 h-6" />
            </div>
            <div>
              <h3 className="text-gray-900 font-black text-xl uppercase tracking-tight">Dicionário de Acordes</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{chords.length} acordes encontrados nesta música</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl hidden md:flex">
            {['Violão', 'Guitarra', 'Teclado', 'Ukulele'].map((inst) => (
              <button
                key={inst}
                onClick={() => onInstrumentChange(inst)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                  instrument === inst ? 'bg-white text-[#22c55e] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {inst}
              </button>
            ))}
          </div>

          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto no-scrollbar">
          {chords.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {chords.map((chord) => (
                <div key={chord} className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                   <ChordDiagram chord={chord} instrument={instrument} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
               <Music className="w-16 h-16 text-gray-100 mb-4" />
               <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Nenhum acorde detectado automaticamente.</p>
            </div>
          )}
        </div>

        {/* Footer Mobile Instrument Selector */}
        <div className="p-4 bg-gray-50 border-t md:hidden flex justify-around">
            <button onClick={() => onInstrumentChange('Violão')} className={`p-2 ${instrument === 'Violão' ? 'text-[#22c55e]' : 'text-gray-400'}`}><Guitar /></button>
            <button onClick={() => onInstrumentChange('Teclado')} className={`p-2 ${instrument === 'Teclado' ? 'text-[#22c55e]' : 'text-gray-400'}`}><Keyboard /></button>
            <button onClick={() => onInstrumentChange('Ukulele')} className={`p-2 ${instrument === 'Ukulele' ? 'text-[#22c55e]' : 'text-gray-400'}`}><Music /></button>
        </div>
      </div>
    </div>
  );
};

export default ChordDictionary;
