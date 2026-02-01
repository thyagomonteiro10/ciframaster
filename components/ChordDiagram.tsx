
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
      <div className="flex flex-col items-center">
        <div className="text-[12px] font-black text-gray-400 mb-1">{chord}</div>
        <div className="w-16 h-20 border border-dashed border-gray-200 rounded flex items-center justify-center text-[8px] text-gray-300 text-center font-bold px-1 uppercase">
          ?
        </div>
      </div>
    );
  }

  const strings = 6;
  const fretsToDisplay = 5;
  const width = 80;
  const height = 100;
  const margin = 10;
  const stringGap = (width - 2 * margin) / (strings - 1);
  const fretGap = (height - 2 * margin) / fretsToDisplay;
  const baseFret = shape.baseFret || 0;

  return (
    <div className="flex flex-col items-center group">
      <div className="text-[14px] font-black text-gray-700 mb-2 group-hover:text-[#38cc63] transition-colors">{chord}</div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Nut (Pestana de cima) */}
        {baseFret <= 1 && (
          <line x1={margin} y1={margin} x2={width - margin} y2={margin} stroke="#333" strokeWidth="3" />
        )}
        {/* Trastes */}
        {Array.from({ length: fretsToDisplay + 1 }).map((_, i) => (
          <line key={i} x1={margin} y1={margin + i * fretGap} x2={width - margin} y2={margin + i * fretGap} stroke="#ccc" strokeWidth="1" />
        ))}
        {/* Cordas */}
        {Array.from({ length: strings }).map((_, i) => (
          <line key={i} x1={margin + i * stringGap} y1={margin} x2={margin + i * stringGap} y2={margin + fretsToDisplay * fretGap} stroke="#999" strokeWidth="1" />
        ))}
        {/* Número do Traste Base */}
        {baseFret > 1 && (
          <text x={margin - 4} y={margin + fretGap / 2 + 4} textAnchor="end" fontSize="10" fontWeight="900" fill="#333">{baseFret}</text>
        )}
        {/* Barre (Pestana) */}
        {shape.barre !== undefined && (
          <rect x={margin - 2} y={margin + (shape.barre - (baseFret || 1)) * fretGap + fretGap / 2 - 3} width={width - 2 * margin + 4} height={6} rx="3" fill="#38cc63" />
        )}
        {/* Dedos */}
        {shape.frets.map((fret, stringIdx) => {
          if (fret === 'x') {
             return <text key={stringIdx} x={margin + stringIdx * stringGap} y={margin - 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#EF4444">✕</text>;
          }
          if (fret === 0) {
            return <circle key={stringIdx} cx={margin + stringIdx * stringGap} cy={margin - 6} r="2.5" fill="none" stroke="#ccc" strokeWidth="1.5" />;
          }
          const relativeFret = baseFret > 0 ? (fret - baseFret + 1) : fret;
          if (relativeFret > fretsToDisplay || relativeFret < 1) return null;
          return (
            <g key={stringIdx}>
              <circle cx={margin + stringIdx * stringGap} cy={margin + (relativeFret - 0.5) * fretGap} r="6" fill="#38cc63" />
              {shape.fingers && shape.fingers[stringIdx] > 0 && (
                <text x={margin + stringIdx * stringGap} y={margin + (relativeFret - 0.5) * fretGap + 3} textAnchor="middle" fontSize="8" fontWeight="900" fill="white">{shape.fingers[stringIdx]}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ChordDiagram;
