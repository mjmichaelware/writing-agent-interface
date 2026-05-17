"use client";

import React, { useRef } from "react";

import TitleCover from "./canvas/front-matter/TitleCover";
import Dedication from "./canvas/front-matter/Dedication";
import Synopsis from "./canvas/front-matter/Synopsis";
import AboutAuthor from "./canvas/front-matter/AboutAuthor";
import TableOfContents from "./canvas/front-matter/TableOfContents";
import ManuscriptCore from "./canvas/ManuscriptCore";

import type { ControlPanelState } from "@/runtime/controlPanel";

interface Layer3CanvasProps {
  chapter: number | null;
  setChapter: (n: number | null) => void;
  paragraphs: string[];
  loading: boolean;
  error: string | null;
  depth: number;
  go: (delta: number) => void;
  topCanvasRef: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  TITLES: Record<number, string>;
  CHAPTER_NUMS: number[];
  state: ControlPanelState;
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
  state,
  topCanvasRef,
}: Layer3CanvasProps) {
  const manuscriptRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBeginReading = () => {
    if (chapter == null) setChapter(1);
    setTimeout(() => scrollTo("reading"), 100);
  };

  const handleLoadChapter = (n: number) => {
    setChapter(n);
    setTimeout(() => scrollTo("reading"), 100);
  };

  // Coerce lineHeight to string so it matches ManuscriptCore's current type.
  // Paste #8 widens ManuscriptCore's type to accept both and removes this.
  const proseState = {
    baseColor: state.baseColor,
    descentColor: state.descentColor,
    sacredColor: state.sacredColor,
    properColor: state.properColor,
    fontScale: state.fontScale,
    lineHeight: String(state.lineHeight),
    letterSpacing: state.letterSpacing,
  };

  return (
    <main ref={topCanvasRef} className="relative z-20">
      <TitleCover
        onJump={scrollTo}
        onBeginReading={handleBeginReading}
      />

      <div className="space-y-24 md:space-y-32 pt-16 pb-24">
        <Dedication />
        <Synopsis />
        <AboutAuthor />
        <TableOfContents
          TITLES={TITLES}
          onLoadChapter={handleLoadChapter}
        />

        {chapter == null ? (
          <section
            id="reading"
            className="min-h-[50vh] scroll-mt-20 flex items-center justify-center"
          >
            <p
              style={{
                fontFamily: "var(--font-prose)",
                fontStyle: "italic",
                color: "var(--text-muted)",
                padding: "4rem 1rem",
              }}
            >
              Choose a chapter to begin.
            </p>
          </section>
        ) : (
          <ManuscriptCore
            manuscriptRef={manuscriptRef}
            tocRef={manuscriptRef}
            chapter={chapter}
            setChapter={setChapter as (n: number) => void}
            paragraphs={paragraphs}
            loading={loading}
            error={error}
            state={proseState}
            depth={depth}
            TITLES={TITLES}
            CHAPTER_NUMS={CHAPTER_NUMS}
            jumpTo={() => scrollTo("reading")}
          />
        )}
      </div>
    </main>
  );
}
