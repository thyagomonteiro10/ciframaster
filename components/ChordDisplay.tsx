
import React, { useState, useCallback, useMemo } from 'react';
import ChordDiagram from './ChordDiagram';

interface ChordDisplayProps {
  content: string;
  fontSize: number;
  instrument?: string;
}

const SECTION_KEYWORDS = ['Intro', 'Solo', 'Refrão', 'Ponte', 'Bridge', 'Final', 'Outro', 'Instrumental', 'Parte', 'Passagem', 'Tab'];

const ChordInteraction: React.FC<{ chord: string, children: React.ReactNode, fontSize: number, instrument?: string, isHighlight?: boolean }> = React.memo(({ chord, children, fontSize, instrument, isHighlight }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isOpen = isHovered || isPinned;

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        setIsPinned(prev => !prev);
        e.stopPropagation();
      }}
    >
      <span className={`font-mono transition-all duration-200 rounded px-1 cursor-pointer ${
        isPinned 
          ? 'bg-[#22c55e] text-white shadow-md scale-110' 
          : isHovered 
            ? 'bg-[#22c55e]/20 text-[#22c55e] scale-105' 
            : isHighlight
              ? 'text-[#22c55e] font-black'
              : 'text-[#22c55e] font-bold'
      }`} style={{ fontSize: isHighlight ? `${fontSize + 2}px` : 'inherit' }}>
        {children}
      </span>
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[999] animate-in fade-in zoom-in-95 duration-200 origin-bottom pointer-events-auto">
           <ChordDiagram chord={chord} instrument={instrument} />
        </div>
      )}
    </span>
  );
});

const ChordDisplay: React.FC<ChordDisplayProps> = React.memo(({ content, fontSize, instrument }) => {
  const lines = useMemo(() => content.split('\n'), [content]);
  return (
    <div className="leading-none pt-4 border-t border-gray-100 flex flex-col pb-32">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        const parts = line.split(/(\[.*?\])/g);
        return (
          <div key={idx} className="mb-0 font-mono text-gray-700 min-h-[1.2em]" style={{ fontSize: `${fontSize}px` }}>
            {parts.map((part, pIdx) => {
               if (part.startsWith('[') && part.endsWith(']')) {
                 const chord = part.slice(1, -1);
                 return <ChordInteraction key={pIdx} chord={chord} fontSize={fontSize} instrument={instrument} isHighlight={true}>{chord}</ChordInteraction>;
               }
               return part;
            })}
          </div>
        );
      })}
    </div>
  );
});

export default ChordDisplay;
