
import React from 'react';
import { INSTRUMENT_CHORDS } from '../constants';

interface ChordDiagramProps {
  chord: string;
  instrument?: string;
}

// Fixed: Define Container as a top-level component and explicitly type it as React.FC with children
// to ensure children are correctly recognized by TypeScript in JSX.
const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-2xl border border-gray-100 min-w-[120px]">
    {children}
  </div>
);

const ChordDiagram: React.FC<ChordDiagramProps> = React.memo(({ chord, instrument = 'Violão' }) => {
  const normalizedChord = chord.trim();
  const instrumentData = INSTRUMENT_CHORDS[instrument] || INSTRUMENT_CHORDS['Violão'];
  // Tenta match exato, senão tenta extrair a base (ex: Am7 -> A)
  const baseChord = normalizedChord.match(/^[A-G][#b]?[m]?/)?.[0] || 'C';
  const shape = instrumentData[normalizedChord] || instrumentData[baseChord];

  if (!shape) {
    return (
      <Container>
        <div className="text-[12px] font-black text-gray-400 mb-1">{chord}</div>
        <div className="w-16 h-20 border border-dashed border-gray-200 rounded flex items-center justify-center text-[10px] text-gray-300 text-center font-bold px-1 uppercase">
          SEM MAPA
        </div>
      </Container>
    );
  }

  // RENDERIZAÇÃO PARA TECLADO
  if (instrument === 'Teclado') {
    const keys = shape.keys || [];
    return (
      <Container>
        <div className="text-[14px] font-black text-gray-900 mb-2">{chord}</div>
        <div className="relative w-40 h-20 border border-gray-200 rounded overflow-hidden flex bg-white shadow-inner">
           {/* Teclas Brancas */}
           {Array.from({ length: 14 }).map((_, i) => (
             <div 
               key={i} 
               className={`flex-1 border-r border-gray-100 h-full relative ${keys.includes(i % 12) ? 'bg-[#38cc63]/20' : ''}`}
             >
                {keys.includes(i % 12) && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#38cc63]"></div>
                )}
             </div>
           ))}
           {/* Teclas Pretas */}
           <div className="absolute inset-0 pointer-events-none">
              {[1, 3, 6, 8, 10].map((keyIdx) => (
                <div 
                  key={keyIdx}
                  style={{ left: `${(keyIdx * 100) / 14}%`, width: '4.5%' }}
                  className={`absolute top-0 h-[60%] border border-black z-10 ${keys.includes(keyIdx) ? 'bg-[#38cc63]' : 'bg-black'}`}
                ></div>
              ))}
           </div>
        </div>
        <div className="mt-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Visualização Piano</div>
      </Container>
    );
  }

  // RENDERIZAÇÃO PARA INSTRUMENTOS DE CORDA (Fretboard)
  const strings = instrument === 'Ukulele' || instrument === 'Baixo' ? 4 : 6;
  const fretsToDisplay = 5;
  const width = 80;
  const height = 100;
  const margin = 10;
  const stringGap = (width - 2 * margin) / (strings - 1);
  const fretGap = (height - 2 * margin) / fretsToDisplay;
  const baseFret = shape.baseFret || 0;

  return (
    <Container>
      <div className="text-[14px] font-black text-gray-900 mb-2">{chord}</div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Nut */}
        {baseFret <= 1 && (
          <line x1={margin} y1={margin} x2={width - margin} y2={margin} stroke="#333" strokeWidth="3" />
        )}
        {/* Trastes */}
        {Array.from({ length: fretsToDisplay + 1 }).map((_, i) => (
          <line key={i} x1={margin} y1={margin + i * fretGap} x2={width - margin} y2={margin + i * fretGap} stroke="#eee" strokeWidth="1" />
        ))}
        {/* Cordas */}
        {Array.from({ length: strings }).map((_, i) => (
          <line key={i} x1={margin + i * stringGap} y1={margin} x2={margin + i * stringGap} y2={margin + fretsToDisplay * fretGap} stroke="#ddd" strokeWidth="1" />
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
            return <circle key={stringIdx} cx={margin + stringIdx * stringGap} cy={margin - 6} r="2.5" fill="none" stroke="#ddd" strokeWidth="1.5" />;
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
      <div className="mt-2 text-[8px] font-black text-gray-300 uppercase tracking-tighter">{instrument}</div>
    </Container>
  );
});

export default ChordDiagram;
