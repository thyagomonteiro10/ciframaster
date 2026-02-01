
import React from 'react';
import { CHORD_SHAPES, ChordShape } from '../constants';

interface ChordDiagramProps {
  chord: string;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ chord }) => {
  const normalizedChord = chord.trim();
  const shape = CHORD_SHAPES[normalizedChord];

  if (!shape) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow-xl border border-purple-50 flex flex-col items-center min-w-[140px] opacity-60">
        <div className="text-lg font-black text-gray-400 mb-2">{chord}</div>
        <div className="w-20 h-24 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-300 text-center font-bold px-2">
          FORMA NÃO MAPEADA
        </div>
      </div>
    );
  }

  const strings = 6;
  const fretsToDisplay = 5;
  const width = 120;
  const height = 150;
  const margin = 20;
  const stringGap = (width - 2 * margin) / (strings - 1);
  const fretGap = (height - 2 * margin - 10) / fretsToDisplay;
  const baseFret = shape.baseFret || 0;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-xl border border-purple-50 flex flex-col items-center min-w-[150px] hover:border-purple-200 transition-colors">
      <div className="text-xl font-black text-purple-900 mb-3">{chord}</div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {baseFret <= 1 && (
          <line x1={margin} y1={margin} x2={width - margin} y2={margin} stroke="#1e1b4b" strokeWidth="4" />
        )}
        {Array.from({ length: fretsToDisplay + 1 }).map((_, i) => (
          <line key={i} x1={margin} y1={margin + i * fretGap} x2={width - margin} y2={margin + i * fretGap} stroke="#E5E7EB" strokeWidth="1.5" />
        ))}
        {Array.from({ length: strings }).map((_, i) => (
          <line key={i} x1={margin + i * stringGap} y1={margin} x2={margin + i * stringGap} y2={margin + fretsToDisplay * fretGap} stroke="#D1D5DB" strokeWidth="1.5" />
        ))}
        {baseFret > 1 && (
          <text x={margin - 8} y={margin + fretGap / 2 + 5} textAnchor="end" fontSize="11" fontWeight="900" fill="#1e1b4b">{baseFret}ª</text>
        )}
        {shape.barre !== undefined && (
          <rect x={margin - 3} y={margin + (shape.barre - baseFret >= 0 ? (shape.barre - baseFret + 0.5) : 0.5) * fretGap - 4} width={width - 2 * margin + 6} height={8} rx="4" fill="#8B5CF6" opacity="0.9" />
        )}
        {shape.frets.map((fret, stringIdx) => {
          if (fret === 'x') {
             return <text key={stringIdx} x={margin + stringIdx * stringGap} y={margin - 6} textAnchor="middle" fontSize="12" fontWeight="900" fill="#EF4444">✕</text>;
          }
          if (fret === 0) {
            return <circle key={stringIdx} cx={margin + stringIdx * stringGap} cy={margin - 10} r="3.5" fill="none" stroke="#D1D5DB" strokeWidth="2" />;
          }
          const relativeFret = baseFret > 0 ? (fret - baseFret + 1) : fret;
          if (relativeFret > fretsToDisplay || relativeFret < 1) return null;
          return (
            <g key={stringIdx}>
              <circle cx={margin + stringIdx * stringGap} cy={margin + (relativeFret - 0.5) * fretGap} r="8" fill="#1e1b4b" />
              {shape.fingers && shape.fingers[stringIdx] > 0 && (
                <text x={margin + stringIdx * stringGap} y={margin + (relativeFret - 0.5) * fretGap + 4} textAnchor="middle" fontSize="9" fontWeight="900" fill="white">{shape.fingers[stringIdx]}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ChordDiagram;
