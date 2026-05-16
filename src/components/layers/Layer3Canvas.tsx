"use client";
import React, { useEffect, useState, useRef } from "react";
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
  TITLES,
  CHAPTER_NUMS,
  state
}: Layer3CanvasProps) {
  const [isMounted, setIsMounted] = useState(false);

  const dedicationRef = useRef<HTMLDivElement>(null);
  const blurbRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  const manuscriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (chapter === null) return;

    requestAnimationFrame(() => {
      manuscriptRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }, [chapter]);

  const jumpTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  if (!isMounted) return null;

  return (
    <div className="w-full relative z-20 font-serif text-[var(--text-body)]">
      <TitleCover
        titleOpacity={Math.max(0, 1 - depth * 3)}
        titleScale={1 + depth * 0.1}
        topCanvasRef={null}
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
        onChapterSelect={setChapter}
      />

      {chapter !== null && (
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
