"use client";
import React, { useMemo } from 'react';
import { useSidebarDispatch, useSidebarState } from '@/context/SidebarContext';

const tokenize = (text: string) => text.match(/[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*|[^\p{L}\p{M}\s]+|\s+/gu) || [];

const Word = React.memo(function Word({ text, isSelected }: { text: string; isSelected: boolean }) {
  const { select } = useSidebarDispatch();
  const isWord = /[\p{L}\p{M}]/u.test(text);
  return (
    <span onClick={isWord ? () => select(text) : undefined} className={`${isWord ? 'cursor-pointer hover:bg-zinc-800' : ''} ${isSelected ? 'bg-amber-900/40 text-amber-200 ring-1 ring-amber-700/50' : ''} transition-colors rounded px-0.5`}>
      {text}
    </span>
  );
});

export const OmniText = ({ content }: { content: string }) => {
  const { activeLower } = useSidebarState();
  const tokens = useMemo(() => tokenize(content).map(t => [t, t.normalize('NFC').toLocaleLowerCase()]), [content]);
  return <div className="text-2xl md:text-3xl leading-[2.1] font-serif">{tokens.map(([t, n], i) => <Word key={i} text={t} isSelected={activeLower === n} />)}</div>;
};
