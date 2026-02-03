
import React from 'react';
import { INSTRUMENT_CHORDS, ChordShape } from '../constants';

interface ChordDiagramProps {
  chord: string;
  instrument?: string;
}

const ChordDiagram: React.FC<ChordDiagramProps> = React.memo(({ chord, instrument = 'Violão' }) => {
  const normalizedChord = chord.trim();
  const instrumentData = INSTRUMENT_CHORDS[instrument] || INSTRUMENT_CHORDS['Violão'];
  
  const baseChord = normalizedChord.match(/^[A-G][#b]?[m]?/)?.[0] || 'C';
  const shape: ChordShape | undefined = instrumentData[normalizedChord] || instrumentData[baseChord];

  if (!shape) return (
    <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2">
      <div className="text-[10px] font-black text-gray-400 uppercase">Acorde {normalizedChord}</div>
      <div className="text-[8px] font-bold text-gray-300 uppercase">Não mapeado</div>
    </div>
  );

  const strings = instrument === 'Ukulele' ? 4 : 6;
  const fretsToDisplay = 5;
  const width = 100;
  const height = 120;
  const margin = 15;
  const stringGap = (width - 2 * margin) / (strings - 1);
  const fretGap = (height - 2 * margin) / fretsToDisplay;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-2xl border border-gray-100 min-w-[140px]">
      <div className="text-[14px] font-black text-gray-950 mb-3 text-center uppercase tracking-tight">{chord}</div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <line x1={margin} y1={margin} x2={width - margin} y2={margin} stroke="#1c1c1c" strokeWidth="4" />
        
        {Array.from({ length: fretsToDisplay + 1 }).map((_, i) => (
          <line key={i} x1={margin} y1={margin + i * fretGap} x2={width - margin} y2={margin + i * fretGap} stroke="#eee" strokeWidth="1.5" />
        ))}
        
        {Array.from({ length: strings }).map((_, i) => (
          <line key={i} x1={margin + i * stringGap} y1={margin} x2={margin + i * stringGap} y2={margin + fretsToDisplay * fretGap} stroke="#ccc" strokeWidth="1.5" />
        ))}

        {shape.barre !== undefined && (
          <rect 
            x={margin - 3} 
            y={margin + (shape.barre - 1) * fretGap + fretGap/4} 
            width={width - 2 * margin + 6} 
            height={8} 
            rx="4" 
            fill="#22c55e" 
            className="opacity-90"
          />
        )}

        {shape.frets.map((fret, stringIdx) => {
          if (typeof fret !== 'number' || fret === 0) return null;
          
          const x = margin + stringIdx * stringGap;
          const y = margin + (fret - 0.5) * fretGap;
          
          return (
            <g key={stringIdx}>
              <circle cx={x} cy={y} r="8" fill="#22c55e" />
              {shape.fingers && shape.fingers[stringIdx] > 0 && (
                <text x={x} y={y + 3} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                  {shape.fingers[stringIdx]}
                </text>
              )}
            </g>
          );
        })}

        {shape.frets.map((fret, stringIdx) => {
          if (fret === 'x') {
            return (
              <text key={stringIdx} x={margin + stringIdx * stringGap} y={margin - 5} textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="black">
                ✕
              </text>
            );
          }
          if (fret === 0) {
            return (
              <circle key={stringIdx} cx={margin + stringIdx * stringGap} cy={margin - 5} r="2.5" fill="none" stroke="#22c55e" strokeWidth="1" />
            );
          }
          return null;
        })}

        {shape.baseFret && shape.baseFret > 1 && (
          <text x={width - 5} y={margin + fretGap/2 + 3} fontSize="10" fontWeight="bold" fill="#999">
            {shape.baseFret}
          </text>
        )}
      </svg>
      <div className="mt-3 text-[9px] font-black text-gray-400 text-center uppercase tracking-widest">{instrument}</div>
    </div>
  );
});

export default ChordDiagram;
