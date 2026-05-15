"use client";
import React, { useState } from 'react';
import { useSidebarDispatch } from '@/context/SidebarContext';
import { EMAWord } from '@/core/types';

const Word = React.memo(({ word }: { word: EMAWord }) => {
  const { select } = useSidebarDispatch();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      data-word-index={word.index}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => select(word.text)}
      style={{ color: word.color || 'inherit', fontFamily: word.font || 'inherit' }}
      className="relative cursor-pointer hover:bg-zinc-800 transition-colors rounded px-0.5 group"
    >
      {word.text}
      {(word.reference || word.foreshadowing) && isHovered && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-zinc-950 border border-amber-900/40 text-[9px] leading-tight z-50 shadow-2xl">
          {word.reference && <div className="text-amber-500 mb-1 uppercase tracking-tighter">Ref: {word.reference}</div>}
          {word.foreshadowing && <div className="text-cyan-500 italic">Sync: {word.foreshadowing}</div>}
        </span>
      )}
    </span>
  );
});

export const OmniText = ({ emaWords }: { emaWords: EMAWord[] }) => {
  return (
    <div className="text-2xl md:text-3xl leading-[2.1] font-serif text-justify">
      {emaWords.map((w, i) => (
        <React.Fragment key={i}>
          <Word word={w} />
          {" "}
        </React.Fragment>
      ))}
    </div>
  );
};
