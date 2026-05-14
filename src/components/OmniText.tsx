"use client";
import React, { useMemo } from 'react';
import { useSidebarDispatch, useSidebarState } from '@/context/SidebarContext';
import { tokenize, isWordToken } from '@/utils/tokenize';

const Word = React.memo(function Word({ text, isSelected, index }: { text: string; isSelected: boolean; index: number }) {
  const { select } = useSidebarDispatch();
  const isWord = isWordToken(text);
  return (
    <span 
      {...(isWord && index >= 0 ? { 'data-word-index': index } : {})} 
      onClick={isWord ? () => select(text) : undefined} 
      className={`${isWord ? 'cursor-pointer hover:bg-zinc-800' : ''} ${isSelected ? 'bg-amber-900/40 text-amber-200 ring-1 ring-amber-700/50' : ''} transition-colors rounded px-0.5`}
    >
      {text}
    </span>
  );
});

export const OmniText = ({ content }: { content: string }) => {
  const { activeLower } = useSidebarState();
  const tokens = useMemo(
    () => tokenize(content).map(t => [t, t.normalize('NFC').toLocaleLowerCase()] as const),
    [content]
  );
  
  let counter = 0;

  return (
    <div className="text-2xl md:text-3xl leading-[2.1] font-serif">
      {tokens.map(([t, n], i) => {
        const isWord = isWordToken(t);
        const currentIndex = isWord ? counter++ : -1;
        return <Word key={i} index={currentIndex} text={t} isSelected={activeLower === n} />;
      })}
    </div>
  );
};
