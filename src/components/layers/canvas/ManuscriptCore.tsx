"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ManuscriptCoreProps {
  manuscriptRef: React.RefObject<HTMLDivElement | null>;
  tocRef: React.RefObject<HTMLDivElement | null>;

  chapter: number;
  setChapter: (n: number) => void;

  paragraphs: string[];

  loading: boolean;
  error: string | null;

  state: {
    baseColor: string;
    descentColor: string;
    sacredColor: string;
    properColor: string;
    fontScale: number;
    lineHeight: string;
    letterSpacing: number;
  };

  depth: number;

  TITLES: Record<number, string>;
  CHAPTER_NUMS: number[];

  jumpTo: (
    elementRef: React.RefObject<HTMLDivElement | null>
  ) => void;
}

export default function ManuscriptCore({
  manuscriptRef,
  chapter,
  setChapter,
  paragraphs,
  loading,
  error,
  state,
  depth,
  TITLES,
  CHAPTER_NUMS,
}: ManuscriptCoreProps) {
  const calculateWordVectors = (
    word: string,
    currentDepth: number,
    chapterIndex: number
  ): React.CSSProperties => {
    let hash = 0;

    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }

    const normalized =
      Math.abs(hash) / 2147483647;

    const narrativeGravity =
      chapterIndex / 25 + currentDepth;

    if (word.length > 4 && normalized > 0.6) {
      return {
        ["--arc-mass" as any]:
          (normalized * 0.9).toFixed(3),

        ["--arc-tension" as any]:
          (
            normalized *
            narrativeGravity *
            0.8
          ).toFixed(3),

        ["--arc-velocity" as any]:
          (
            normalized > 0.85
              ? -0.5
              : 0
          ).toFixed(3),
      };
    }

    return {
      ["--arc-mass" as any]: 0,
      ["--arc-tension" as any]: 0,
      ["--arc-velocity" as any]: 0,
    };
  };

  const renderVisceralProse = (
    text: string
  ) => {
    const tokens =
      text.split(/(\b\w+\b)/g);

    return tokens.map((token, index) => {
      if (/\w+/.test(token)) {
        const vectors =
          calculateWordVectors(
            token,
            depth,
            chapter
          );

        return (
          <span
            key={index}
            className="kinetic-token"
            style={vectors}
          >
            {token}
          </span>
        );
      }

      return (
        <React.Fragment key={index}>
          {token}
        </React.Fragment>
      );
    });
  };

  if (loading) {
    return (
      <div
        ref={manuscriptRef}
        className="w-full max-w-2xl mx-auto py-24 text-center"
      >
        <p className="font-serif text-lg text-zinc-500 italic">
          Retrieving canonical text...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        ref={manuscriptRef}
        className="w-full max-w-2xl mx-auto py-24 text-center"
      >
        <p className="font-serif text-lg text-[#6b2c2c] italic">
          This chapter is not yet available.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={manuscriptRef}
      id="reading"
      className="w-full max-w-2xl mx-auto py-16 px-4 md:px-0 relative z-20 font-serif"
      style={{
        fontSize: `${
          state?.fontScale || 1.125
        }rem`,

        lineHeight:
          state?.lineHeight || "1.7",

        letterSpacing: `${
          state?.letterSpacing || 0
        }em`,

        color:
          state?.baseColor ||
          "var(--text-body)",
      }}
    >
      <div className="mb-16 text-center">
        <p className="section-label mb-2">
          Chapter {chapter}
        </p>

        <h2 className="text-3xl text-[var(--sacred)] tracking-wide">
          {TITLES[chapter]}
        </h2>
      </div>

      <div className="prose-container">
        {paragraphs.map((para, i) => (
          <p
            key={i}
            data-para={i}
            className="manuscript-paragraph-segment"
          >
            {renderVisceralProse(para)}
          </p>
        ))}
      </div>

      <div className="mt-24 border-t border-[var(--text-muted)] opacity-20 pt-8 flex justify-between">
        <button
          onClick={() =>
            setChapter(
              Math.max(1, chapter - 1)
            )
          }
          disabled={chapter <= 1}
          className="text-[var(--text-muted)] hover:text-[var(--accent-gold)] flex items-center gap-2 transition-colors disabled:opacity-30 uppercase tracking-widest text-xs"
        >
          <ChevronLeft size={14} />
          Previous
        </button>

        <button
          onClick={() =>
            setChapter(
              Math.min(25, chapter + 1)
            )
          }
          disabled={
            !CHAPTER_NUMS.includes(
              chapter + 1
            )
          }
          className="text-[var(--text-muted)] hover:text-[var(--accent-gold)] flex items-center gap-2 transition-colors disabled:opacity-30 uppercase tracking-widest text-xs"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
