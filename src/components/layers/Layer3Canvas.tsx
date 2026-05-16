"use client";

import React, { useEffect, useState } from "react";

import TitleCover from "./canvas/TitleCover";
import FrontMatter from "./canvas/FrontMatter";
import ManuscriptCore from "./canvas/ManuscriptCore";

interface Layer3CanvasProps {
  chapter: number | null;
  setChapter: (n: number) => void;
  paragraphs: string[];
  loading: boolean;
  error: string | null;
  depth: number;
  go: (delta: number) => void;
  topCanvasRef: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  TITLES: Record<number, string>;
  CHAPTER_NUMS: number[];
  state: any;
}

export default function Layer3Canvas({
  chapter,
  setChapter,
  paragraphs,
  loading,
  error,
  depth,
  topCanvasRef,
  TITLES,
  CHAPTER_NUMS,
  state
}: Layer3CanvasProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const jumpTo = (
    elementRef: React.RefObject<HTMLDivElement | null>
  ) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const dedicationRef = React.useRef<HTMLDivElement>(null);
  const blurbRef = React.useRef<HTMLDivElement>(null);
  const authorRef = React.useRef<HTMLDivElement>(null);
  const tocRef = React.useRef<HTMLDivElement>(null);
  const manuscriptRef = React.useRef<HTMLDivElement>(null);

  if (!isMounted) return null;

  return (
    <div className="relative z-20 w-full font-serif tracking-normal text-[var(--text-body)] antialiased">
      <TitleCover
        titleOpacity={Math.max(0, 1 - depth * 3)}
        titleScale={1 + depth * 0.1}
        topCanvasRef={topCanvasRef}
        manuscriptRef={manuscriptRef}
        dedicationRef={dedicationRef}
        blurbRef={blurbRef}
        authorRef={authorRef}
        tocRef={tocRef}
        jumpTo={jumpTo}
      />

      <FrontMatter
        dedicationRef={dedicationRef}
        blurbRef={blurbRef}
        authorRef={authorRef}
      />

      {chapter && (
        <ManuscriptCore
          manuscriptRef={manuscriptRef}
          tocRef={tocRef}
          chapter={chapter}
          setChapter={setChapter}
          paragraphs={paragraphs}
          loading={loading}
          error={error}
          state={state}
          depth={depth}
          TITLES={TITLES}
          CHAPTER_NUMS={CHAPTER_NUMS}
          jumpTo={jumpTo}
        />
      )}
    </div>
  );
}
