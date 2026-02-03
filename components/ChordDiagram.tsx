
import React from 'react';
import { INSTRUMENT_CHORDS } from '../constants';

interface ChordDiagramProps {
  chord: string;
  instrument?: string;
}

const ChordDiagram: React.FC<ChordDiagramProps> = React.memo(({ chord, instrument = 'Violão' }) => {
  const normalizedChord = chord.trim();
  const instrumentData = INSTRUMENT_CHORDS[instrument] || INSTRUMENT_CHORDS['Violão'];
  const baseChord = normalizedChord.match(/^[A-G][#b]?[m]?/)?.[0] || 'C';
  const shape = instrumentData[normalizedChord] || instrumentData[baseChord];

  if (!shape) return <div className="p-4 bg-white border rounded shadow">Sem mapa</div>;

  const strings = 6;
  const fretsToDisplay = 5;
  const width = 80;
  const height = 100;
  const margin = 10;
  const stringGap = (width - 2 * margin) / (strings - 1);
  const fretGap = (height - 2 * margin) / fretsToDisplay;

  return (
    <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100">
      <div className="text-[14px] font-black text-gray-900 mb-2 text-center">{chord}</div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {Array.from({ length: fretsToDisplay + 1 }).map((_, i) => (
          <line key={i} x1={margin} y1={margin + i * fretGap} x2={width - margin} y2={margin + i * fretGap} stroke="#eee" strokeWidth="1" />
        ))}
        {Array.from({ length: strings }).map((_, i) => (
          <line key={i} x1={margin + i * stringGap} y1={margin} x2={margin + i * stringGap} y2={margin + fretsToDisplay * fretGap} stroke="#ddd" strokeWidth="1" />
        ))}
        {shape.barre !== undefined && <rect x={margin - 2} y={margin + (shape.barre - 1) * fretGap + 5} width={width - 2 * margin + 4} height={6} rx="3" fill="#22c55e" />}
        {shape.frets.map((fret, stringIdx) => {
          if (typeof fret !== 'number' || fret === 0) return null;
          return <circle key={stringIdx} cx={margin + stringIdx * stringGap} cy={margin + (fret - 0.5) * fretGap} r="6" fill="#22c55e" />;
        })}
      </svg>
    </div>
  );
});

export default ChordDiagram;
