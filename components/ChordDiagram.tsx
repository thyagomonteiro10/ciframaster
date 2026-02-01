
import React from 'react';
import { CHORD_SHAPES, ChordShape } from '../constants';

interface ChordDiagramProps {
  chord: string;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ chord }) => {
  // Limpar nome do acorde (remover variações de tom se necessário para busca na base)
  const normalizedChord = chord.trim();
  const shape = CHORD_SHAPES[normalizedChord];

  if (!shape) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-2xl border border-purple-100 flex flex-col items-center min-w-[120px]">
        <div className="text-lg font-black text-purple-900 mb-2">{chord}</div>
        <div className="text-[10px] text-gray-400 font-bold uppercase text-center">Acorde não<br/>encontrado</div>
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
    <div className="bg-white p-4 rounded-xl shadow-2xl border border-purple-100 flex flex-col items-center min-w-[140px]">
      <div className="text-lg font-black text-purple-900 mb-2">{chord}</div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Nut (Pestana base se for casa 0) */}
        {baseFret <= 1 && (
          <line x1={margin} y1={margin} x2={width - margin} y2={margin} stroke="#1e1b4b" strokeWidth="4" />
        )}
        
        {/* Frets */}
        {Array.from({ length: fretsToDisplay + 1 }).map((_, i) => (
          <line 
            key={i} 
            x1={margin} y1={margin + i * fretGap} 
            x2={width - margin} y2={margin + i * fretGap} 
            stroke="#e5e7eb" strokeWidth="1" 
          />
        ))}

        {/* Strings */}
        {Array.from({ length: strings }).map((_, i) => (
          <line 
            key={i} 
            x1={margin + i * stringGap} y1={margin} 
            x2={margin + i * stringGap} y2={margin + fretsToDisplay * fretGap} 
            stroke="#9ca3af" strokeWidth="1" 
          />
        ))}

        {/* Base Fret Number */}
        {baseFret > 1 && (
          <text 
            x={margin - 5} y={margin + fretGap / 2 + 4} 
            textAnchor="end" fontSize="10" fontWeight="black" fill="#1e1b4b"
          >
            {baseFret}ª
          </text>
        )}

        {/* Barre (Pestana) */}
        {shape.barre !== undefined && (
          <rect 
            x={margin - 2} 
            y={margin + (shape.barre - baseFret >= 0 ? (shape.barre - baseFret + 0.5) : 0.5) * fretGap - 5} 
            width={width - 2 * margin + 4} 
            height={10} 
            rx="5" 
            fill="#8b5cf6" 
            opacity="0.8"
          />
        )}

        {/* Dots (Fingers) */}
        {shape.frets.map((fret, stringIdx) => {
          if (fret === 'x') {
             return (
               <text 
                key={stringIdx} 
                x={margin + stringIdx * stringGap} y={margin - 5} 
                textAnchor="middle" fontSize="10" fontWeight="bold" fill="#9ca3af"
               >
                ✕
               </text>
             );
          }
          if (fret === 0) {
            return (
              <circle 
                key={stringIdx} 
                cx={margin + stringIdx * stringGap} cy={margin - 8} 
                r="3" fill="none" stroke="#9ca3af" strokeWidth="1.5" 
              />
            );
          }
          
          // Calcular posição relativa do traste exibido
          const relativeFret = baseFret > 0 ? (fret - baseFret + 1) : fret;
          if (relativeFret > fretsToDisplay || relativeFret < 1) return null;

          return (
            <g key={stringIdx}>
              <circle 
                cx={margin + stringIdx * stringGap} 
                cy={margin + (relativeFret - 0.5) * fretGap} 
                r="7" fill="#1e1b4b" 
              />
              {shape.fingers && shape.fingers[stringIdx] > 0 && (
                <text 
                  x={margin + stringIdx * stringGap} 
                  y={margin + (relativeFret - 0.5) * fretGap + 3} 
                  textAnchor="middle" fontSize="8" fontWeight="bold" fill="white"
                >
                  {shape.fingers[stringIdx]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ChordDiagram;
