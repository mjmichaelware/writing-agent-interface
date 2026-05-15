"use client";
import React, { useMemo } from 'react';
import { useSidebarDispatch, useSidebarState } from '@/context/SidebarContext';
import { EMAWord } from '@/core/types';

const Word = React.memo(function Word({ word }: { word: EMAWord }) {
  const { select } = useSidebarDispatch();
  const { activeLower } = useSidebarState();
  const isSelected = activeLower === word.text.normalize('NFC').toLocaleLowerCase();

  return (
    <span
      data-word-index={word.index}
      onClick={() => select(word.text)}
      style={{ color: word.color || 'inherit', fontFamily: word.font || 'inherit' }}
      className={`cursor-pointer transition-colors rounded px-0.5 hover:bg-zinc-800 ${isSelected ? 'bg-amber-900/40 text-amber-200 ring-1 ring-amber-700/50' : ''}`}
    >
      {word.text}
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
