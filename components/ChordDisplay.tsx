
import React, { useState, useCallback, useMemo } from 'react';
import ChordDiagram from './ChordDiagram';

interface ChordDisplayProps {
  content: string;
  fontSize: number;
  instrument?: string;
}

const ChordInteraction: React.FC<{ chord: string, children: React.ReactNode, fontSize: number, instrument?: string }> = React.memo(({ chord, children, fontSize, instrument }) => {
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
      <span className={`font-bold font-mono transition-all duration-200 rounded px-1 cursor-pointer border-b-2 ${
        isPinned 
          ? 'bg-[#38cc63] text-white border-[#2da34f] shadow-md scale-105' 
          : isHovered 
            ? 'bg-[#38cc63]/20 text-[#38cc63] border-[#38cc63]' 
            : 'text-[#38cc63] border-transparent hover:border-[#38cc63]/40'
      }`}>
        {children}
      </span>
      {isOpen && (
        <div 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[999] animate-in fade-in zoom-in-95 duration-200 origin-bottom pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
           <div className="relative">
             <ChordDiagram chord={chord} instrument={instrument} />
             <div className="w-3 h-3 bg-white absolute -bottom-1.5 left-1/2 -translate-x-1/2 rotate-45 border-r border-b border-gray-100 shadow-[2px_2px_2px_-1px_rgba(0,0,0,0.05)]"></div>
           </div>
        </div>
      )}
    </span>
  );
});

const ChordDisplay: React.FC<ChordDisplayProps> = React.memo(({ content, fontSize, instrument }) => {
  const lines = useMemo(() => content.trim().split('\n'), [content]);

  const renderLine = useCallback((line: string, idx: number) => {
    const trimmedLine = line.trim();
    if (!trimmedLine && idx > 0 && lines[idx-1].trim() === "") return null;

    const isTab = /^[A-G]?[|]/.test(trimmedLine) || line.includes('--') || line.includes('|-');

    if (isTab) {
      return (
        <div key={idx} className="overflow-x-auto no-scrollbar py-1">
          <div className="text-gray-400 font-mono whitespace-pre select-none min-w-max" style={{ fontSize: `${fontSize - 2}px` }}>
            {line.split(/([0-9]+|h|p|\/|\\)/g).map((part, pIdx) => {
              const isDigit = /^[0-9]+$/.test(part);
              return <span key={pIdx} className={isDigit ? "text-[#38cc63] font-bold" : ""}>{part}</span>;
            })}
          </div>
        </div>
      );
    }

    const isOnlyChords = trimmedLine.length > 0 && !line.includes('[') && 
                         /^[A-G][#b]?[m]?[0-9M]?(\s+[A-G][#b]?[m]?[0-9M]?)*$/.test(trimmedLine);

    if (isOnlyChords) {
       const chords = line.split(/(\s+)/);
       return (
         <div key={idx} className="overflow-visible mb-2">
           <div className="h-10 flex items-end min-w-max" style={{ fontSize: `${fontSize + 1}px` }}>
              {chords.map((part, pIdx) => {
                if (part.trim() === "") return <span key={pIdx} className="whitespace-pre">{part}</span>;
                return <ChordInteraction key={pIdx} chord={part.trim()} fontSize={fontSize} instrument={instrument}>{part}</ChordInteraction>;
              })}
           </div>
         </div>
       );
    }

    const parts = line.split(/(\[.*?\])/g);
    const hasChords = parts.length > 1;

    if (!hasChords) {
      const isBlank = trimmedLine === "";
      return (
        <div key={idx} className={`${isBlank ? 'h-6' : 'mb-2'} text-gray-700 font-mono whitespace-pre`} style={{ fontSize: `${fontSize}px` }}>
          {line || '\u00A0'}
        </div>
      );
    }

    let chordLineElements: React.ReactNode[] = [];
    let lyricsLine = "";
    let currentPos = 0;

    parts.forEach((part, pIdx) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const chord = part.slice(1, -1);
        const spacesNeeded = lyricsLine.length - currentPos;
        if (spacesNeeded > 0) {
          chordLineElements.push(<span key={`s-${pIdx}`} className="whitespace-pre">{" ".repeat(spacesNeeded)}</span>);
          currentPos += spacesNeeded;
        }
        chordLineElements.push(<ChordInteraction key={`c-${pIdx}`} chord={chord} fontSize={fontSize} instrument={instrument}>{chord}</ChordInteraction>);
        currentPos += chord.length;
      } else {
        lyricsLine += part;
      }
    });

    return (
      <div key={idx} className="mb-4 group relative font-mono overflow-visible">
        <div className="min-w-max">
          <div className="h-8 flex items-end whitespace-pre" style={{ fontSize: `${fontSize}px` }}>
            {chordLineElements}
          </div>
          <div className="text-gray-700 whitespace-pre" style={{ fontSize: `${fontSize}px` }}>
            {lyricsLine || '\u00A0'}
          </div>
        </div>
      </div>
    );
  }, [fontSize, lines, instrument]);

  return (
    <div className="leading-tight pt-4 md:pt-8 border-t border-gray-100">
      {lines.map((line, idx) => renderLine(line, idx))}
    </div>
  );
});

export default ChordDisplay;
