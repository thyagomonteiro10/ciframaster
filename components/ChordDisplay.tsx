
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
          ? 'bg-[#38cc63] text-white shadow-md scale-110' 
          : isHovered 
            ? 'bg-[#38cc63]/20 text-[#38cc63] scale-105' 
            : isHighlight
              ? 'text-[#38cc63] font-black'
              : 'text-[#38cc63] font-bold'
      }`} style={{ fontSize: isHighlight ? `${fontSize + 2}px` : 'inherit' }}>
        {children}
      </span>
      {isOpen && (
        <div 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[999] animate-in fade-in zoom-in-95 duration-200 origin-bottom pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
           <div className="relative">
             <ChordDiagram chord={chord} instrument={instrument} />
             <div className="w-2.5 h-2.5 bg-white absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 border-r border-b border-gray-100"></div>
           </div>
        </div>
      )}
    </span>
  );
});

const ChordDisplay: React.FC<ChordDisplayProps> = React.memo(({ content, fontSize, instrument }) => {
  const lines = useMemo(() => content.split('\n'), [content]);

  const renderLine = useCallback((line: string, idx: number) => {
    const trimmedLine = line.trim();
    const nextLine = lines[idx + 1]?.trim() || "";

    // 1. Tratamento de Tablaturas
    const isTab = /^[A-G]?[|]/.test(trimmedLine) || line.includes('--') || line.includes('|-');
    if (isTab) {
      return (
        <div key={idx} className="overflow-x-auto no-scrollbar py-1">
          <div className="text-gray-400 font-mono whitespace-pre select-none min-w-max" style={{ fontSize: `${fontSize - 2}px`, lineHeight: '1.2' }}>
            {line.split(/([0-9]+|h|p|\/|\\)/g).map((part, pIdx) => {
              const isDigit = /^[0-9]+$/.test(part);
              return <span key={pIdx} className={isDigit ? "text-[#38cc63] font-bold" : ""}>{part}</span>;
            })}
          </div>
        </div>
      );
    }

    // 2. Detecção de Seções (Intro, Solo, etc)
    const isSectionHeader = SECTION_KEYWORDS.some(keyword => 
      trimmedLine.toLowerCase().includes(keyword.toLowerCase()) && 
      (trimmedLine.startsWith('[') || trimmedLine.length < 20) &&
      !trimmedLine.includes('(') // Evita confundir (passagem 1) com cabeçalho de seção
    );

    if (isSectionHeader && !trimmedLine.includes('|')) {
       return (
         <div key={idx} className="mt-8 mb-3 flex items-center gap-3">
            <span className="bg-[#38cc63]/10 text-[#38cc63] px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-[0.2em] border border-[#38cc63]/20 shadow-sm">
              {trimmedLine.replace(/[\[\]]/g, '')}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-100 to-transparent"></div>
         </div>
       );
    }

    // 3. Processamento de Acordes e Passagens
    // Regex que separa Acordes [X], Passagens (X) e o restante do texto
    const parts = line.split(/(\[.*?\]|\(.*?\))/g);
    const hasChords = parts.some(p => p.startsWith('[') && p.endsWith(']'));

    if (!hasChords) {
      const isBlank = trimmedLine === "";
      return (
        <div key={idx} className={`${isBlank ? 'h-4' : 'mb-0'} text-gray-700 font-mono whitespace-pre leading-none flex items-center`} style={{ fontSize: `${fontSize}px`, minHeight: isBlank ? '0.5rem' : '1.2em' }}>
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
        const spacesBefore = lyricsLine.length - currentPos;
        if (spacesBefore > 0) {
          chordLineElements.push(<span key={`s-${pIdx}`} className="whitespace-pre">{" ".repeat(spacesBefore)}</span>);
          currentPos += spacesBefore;
        }
        chordLineElements.push(
          <ChordInteraction 
            key={`c-${pIdx}`} 
            chord={chord} 
            fontSize={fontSize} 
            instrument={instrument}
            isHighlight={true}
          >
            {chord}
          </ChordInteraction>
        );
        currentPos += chord.length;
      } else if (part.startsWith('(') && part.endsWith(')')) {
        const info = part.slice(1, -1);
        chordLineElements.push(
          <span key={`i-${pIdx}`} className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-[#38cc63]/10 border border-[#38cc63]/30 text-[#38cc63] text-[9px] font-black uppercase tracking-tighter align-middle mb-1">
            {info}
          </span>
        );
      } else {
        lyricsLine += part;
      }
    });

    const isOnlyChordsLine = lyricsLine.trim() === "";
    const nextLineHasChords = lines[idx + 1]?.includes('[');
    const shouldCollapse = isOnlyChordsLine && nextLine !== "" && !nextLineHasChords;

    if (isOnlyChordsLine) {
      return (
        <div 
          key={idx} 
          className={`overflow-visible font-mono whitespace-pre flex items-center relative z-10 transition-all ${shouldCollapse ? 'mb-[-8px]' : 'mb-2'}`} 
          style={{ height: '1.6em' }}
        >
          {chordLineElements}
        </div>
      );
    }

    return (
      <div key={idx} className="mb-0 group relative font-mono overflow-visible">
        <div className="min-w-max flex flex-col">
          <div className="h-5 flex items-end whitespace-pre relative z-10" style={{ fontSize: `${fontSize - 1}px`, lineHeight: '1' }}>
            {chordLineElements}
          </div>
          <div className="text-gray-700 whitespace-pre leading-none mt-[-2px] relative z-0" style={{ fontSize: `${fontSize}px` }}>
            {lyricsLine}
          </div>
        </div>
      </div>
    );
  }, [fontSize, instrument, lines]);

  return (
    <div className="leading-none pt-4 border-t border-gray-100 flex flex-col pb-32">
      {lines.map((line, idx) => renderLine(line, idx))}
    </div>
  );
});

export default ChordDisplay;
