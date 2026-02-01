
import React, { useState } from 'react';
import ChordDiagram from './ChordDiagram';

interface ChordDisplayProps {
  content: string;
  fontSize: number;
}

const ChordHover: React.FC<{ chord: string, children: React.ReactNode, fontSize: number }> = ({ chord, children, fontSize }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => setIsHovered(!isHovered);

  return (
    <span 
      className="relative inline-block group cursor-pointer md:cursor-help"
      onMouseEnter={() => window.innerWidth > 768 && setIsHovered(true)}
      onMouseLeave={() => window.innerWidth > 768 && setIsHovered(false)}
      onClick={handleToggle}
    >
      <span className="text-purple-600 font-black font-mono transition-colors group-hover:bg-purple-100 rounded px-0.5">
        {children}
      </span>
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[100] animate-in fade-in zoom-in duration-200">
           <ChordDiagram chord={chord} />
           <div className="w-3 h-3 bg-white border-r border-b border-purple-100 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
        </div>
      )}
    </span>
  );
};

const ChordDisplay: React.FC<ChordDisplayProps> = ({ content, fontSize }) => {
  const lines = content.trim().split('\n');

  const renderLine = (line: string, idx: number) => {
    // Detectar tabs
    const isTab = /^[A-G]?[|]/.test(line.trim()) || line.includes('--') || line.includes('|-');

    if (isTab) {
      return (
        <div key={idx} className="overflow-x-auto no-scrollbar py-1">
          <div className="text-gray-400 font-mono whitespace-pre select-none min-w-max" style={{ fontSize: `${fontSize - 2}px` }}>
            {line.split(/([0-9]+|h|p|\/|\\)/g).map((part, pIdx) => {
              const isDigit = /^[0-9]+$/.test(part);
              return <span key={pIdx} className={isDigit ? "text-purple-900 font-black" : ""}>{part}</span>;
            })}
          </div>
        </div>
      );
    }

    // Detectar linhas só de acordes (sem colchetes)
    const isOnlyChords = line.trim().length > 0 && !line.includes('[') && 
                         /^[A-G][#b]?[m]?[0-9M]?(\s+[A-G][#b]?[m]?[0-9M]?)*$/.test(line.trim());

    if (isOnlyChords) {
       const chords = line.split(/(\s+)/);
       return (
         <div key={idx} className="overflow-x-auto no-scrollbar">
           <div className="h-8 flex items-end min-w-max" style={{ fontSize: `${fontSize + 2}px` }}>
              {chords.map((part, pIdx) => {
                if (part.trim() === "") return <span key={pIdx} className="whitespace-pre">{part}</span>;
                return <ChordHover key={pIdx} chord={part} fontSize={fontSize}>{part}</ChordHover>;
              })}
           </div>
         </div>
       );
    }

    // Linhas normais com letra e acordes entre colchetes
    const parts = line.split(/(\[.*?\])/g);
    const hasChords = parts.some(p => p.startsWith('[') && p.endsWith(']'));

    if (!hasChords) {
      // Se for uma linha vazia no código, renderiza um espaço para manter o ritmo visual das estrofes
      const isBlank = line.trim() === "";
      return (
        <div key={idx} className={`${isBlank ? 'h-6' : 'mb-2'} text-gray-800 font-mono whitespace-pre font-medium`} style={{ fontSize: `${fontSize}px` }}>
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
        chordLineElements.push(<ChordHover key={`c-${pIdx}`} chord={chord} fontSize={fontSize}>{chord}</ChordHover>);
        currentPos += chord.length;
      } else {
        lyricsLine += part;
      }
    });

    return (
      <div key={idx} className="mb-6 group relative font-mono overflow-x-auto no-scrollbar">
        <div className="min-w-max">
          <div className="h-7 flex items-end whitespace-pre" style={{ fontSize: `${fontSize + 1}px` }}>
            {chordLineElements}
          </div>
          <div className="text-gray-800 whitespace-pre font-medium" style={{ fontSize: `${fontSize}px` }}>
            {lyricsLine || '\u00A0'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="leading-tight tracking-tight pt-4 md:pt-8 border-t border-gray-50 pb-20">
      {lines.map((line, idx) => renderLine(line, idx))}
    </div>
  );
};

export default ChordDisplay;
