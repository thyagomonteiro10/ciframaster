
import React, { useState, useMemo } from 'react';
import ChordDiagram from './ChordDiagram';

interface ChordDisplayProps {
  content: string;
  fontSize: number;
  instrument?: string;
}

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
      <span className={`font-mono transition-all duration-150 rounded cursor-pointer whitespace-pre ${
        isPinned 
          ? 'bg-[#22c55e] text-white shadow-md' 
          : isHovered 
            ? 'bg-[#22c55e] text-white' 
            : isHighlight
              ? 'text-[#16a34a] font-black'
              : 'text-[#16a34a] font-bold'
      }`} style={{ fontSize: `${fontSize}px`, padding: '0 1px' }}>
        {children}
      </span>
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[999] animate-in fade-in zoom-in-95 duration-200 origin-bottom pointer-events-auto">
           <ChordDiagram chord={chord} instrument={instrument} />
        </div>
      )}
    </span>
  );
});

const ChordDisplay: React.FC<ChordDisplayProps> = React.memo(({ content, fontSize, instrument }) => {
  const lines = useMemo(() => content.split('\n'), [content]);
  
  return (
    <div className="leading-none pt-6 border-t border-gray-100 flex flex-col pb-60 whitespace-pre-wrap overflow-x-auto no-scrollbar">
      {lines.map((line, idx) => {
        const parts = line.split(/(\[.*?\])/g);
        
        // Identifica se a linha é uma Tablatura ou apenas decorativa
        const isTab = line.includes('|') || line.includes('-') && (line.includes('e') || line.includes('b') || line.includes('g') || line.includes('D') || line.includes('A') || line.includes('E'));
        
        // Identifica se a linha contém apenas acordes (comum em arquivos de texto profissionais)
        const isChordOnlyLine = line.trim().length > 0 && line.trim().split(/\s+/).every(token => token.startsWith('[') && token.endsWith(']'));

        return (
          <div 
            key={idx} 
            className={`font-mono min-h-[1.2em] transition-colors duration-300 ${
              isTab ? 'text-gray-400 opacity-80 py-0.5' : 
              isChordOnlyLine ? 'py-1' : 'text-gray-800'
            }`} 
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: isTab ? '1.1' : '1.6',
              letterSpacing: '-0.02em'
            }}
          >
            {parts.map((part, pIdx) => {
               if (part.startsWith('[') && part.endsWith(']')) {
                 const chord = part.slice(1, -1);
                 
                 // Se o conteúdo for longo (ex: [Refrão]), renderiza como etiqueta
                 if (chord.length > 8) {
                   return (
                     <span key={pIdx} className="text-[#16a34a] font-black uppercase tracking-widest text-[0.75em] opacity-70 px-2 bg-[#22c55e]/5 rounded-md border border-[#22c55e]/10 mx-1 select-none">
                       {chord}
                     </span>
                   );
                 }
                 
                 // Renderiza o acorde mantendo os colchetes invisíveis para preservar o espaçamento monoespaçado (opcional)
                 // Mas aqui vamos renderizar apenas o nome do acorde para limpeza visual, 
                 // assumindo que o usuário quer a estética do "anexo"
                 return (
                   <ChordInteraction key={pIdx} chord={chord} fontSize={fontSize} instrument={instrument} isHighlight={true}>
                     {chord}
                   </ChordInteraction>
                 );
               }
               
               return <span key={pIdx} className="whitespace-pre">{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
});

export default ChordDisplay;
