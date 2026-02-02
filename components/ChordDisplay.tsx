
import React, { useState, useCallback, useMemo } from 'react';
import ChordDiagram from './ChordDiagram';

interface ChordDisplayProps {
  content: string;
  fontSize: number;
  instrument?: string;
}

const ChordHover: React.FC<{ chord: string, children: React.ReactNode, fontSize: number, instrument?: string }> = React.memo(({ chord, children, fontSize, instrument }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    // No mobile, o click abre/fecha o diagrama. No desktop, o hover cuida disso.
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setIsHovered(prev => !prev);
    }
  }, []);

  return (
    <span 
      className="relative inline-block group"
      onMouseEnter={() => window.innerWidth > 768 && setIsHovered(true)}
      onMouseLeave={() => window.innerWidth > 768 && setIsHovered(false)}
      onClick={handleToggle}
    >
      <span className={`font-bold font-mono transition-all duration-200 rounded px-1 cursor-pointer ${
        isHovered ? 'bg-[#38cc63] text-white shadow-lg' : 'text-[#38cc63] hover:bg-[#38cc63]/10'
      }`}>
        {children}
      </span>
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[150] transition-all duration-300 transform origin-bottom scale-100 opacity-100 pointer-events-none">
           <ChordDiagram chord={chord} instrument={instrument} />
           <div className="w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2 shadow-lg"></div>
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
         <div key={idx} className="overflow-x-auto no-scrollbar">
           <div className="h-10 flex items-end min-w-max" style={{ fontSize: `${fontSize + 1}px` }}>
              {chords.map((part, pIdx) => {
                if (part.trim() === "") return <span key={pIdx} className="whitespace-pre">{part}</span>;
                return <ChordHover key={pIdx} chord={part.trim()} fontSize={fontSize} instrument={instrument}>{part}</ChordHover>;
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
        chordLineElements.push(<ChordHover key={`c-${pIdx}`} chord={chord} fontSize={fontSize} instrument={instrument}>{chord}</ChordHover>);
        currentPos += chord.length;
      } else {
        lyricsLine += part;
      }
    });

    return (
      <div key={idx} className="mb-4 group relative font-mono overflow-x-auto no-scrollbar">
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
