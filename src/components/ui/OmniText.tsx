import React, { useMemo } from 'react';
import { useSidebarState, useSidebarDispatch } from '@/context/SidebarContext';
import { tokenize } from '@/services/memory-engine/text-processor';

const Word = React.memo(({ text, isSelected, normalized }: { 
  text: string; 
  isSelected: boolean; 
  normalized: string 
}) => {
  const { select } = useSidebarDispatch();
  const isWord = /[\p{L}\p{M}]/u.test(text);

  return (
    <span
      onClick={isWord ? () => select(text) : undefined}
      className={`
        ${isWord ? 'cursor-pointer hover:bg-zinc-800' : ''}
        ${isSelected ? 'bg-amber-900/40 text-amber-200 ring-1 ring-amber-700/50' : ''}
        transition-colors duration-150 rounded px-0.5
      `}
    >
      {text}
    </span>
  );
});

export const OmniText = ({ content }: { content: string }) => {
  const { activeLower } = useSidebarState();
  
  const tokens = useMemo(() => 
    tokenize(content).map(t => ({
      original: t,
      normalized: t.normalize('NFC').toLocaleLowerCase()
    })), [content]);

  return (
    <div className="text-2xl md:text-3xl leading-[1.9] font-serif selection:bg-amber-900/30">
      {tokens.map((token, i) => (
        <Word 
          key={i} 
          text={token.original} 
          normalized={token.normalized}
          isSelected={activeLower === token.normalized} 
        />
      ))}
    </div>
  );
};
