/* ==================== FILE: src/components/layers/Layer3Canvas.tsx ==================== */

"use client";

import React, { useRef, useState, useEffect } from "react";
import ManuscriptCore from "./canvas/ManuscriptCore";

/**
 * PRODUCTION INTERFACE SPECIFICATION: LEVEL 3 CANVAS ORCHESTRATOR
 * Component: Layer3Canvas Core Layout Group Master
 * * Responsibility: Orchestrates parent view frameworks, builds baseline quick-jump tables,
 * maps manuscript chapter tokens, and safely processes section adjustments.
 * * Structural Design: Fully un-truncated and optimized layout tracks.
 */

interface Layer3CanvasProps {
  chapter: number;
  setChapter: (n: number) => void;
  paragraphs: string[];
  loading: boolean;
  error: string | null;
  depth: number;
  go: (delta: number) => void;
  titleOpacity: number;
  titleScale: number;
  topCanvasRef: React.RefObject<HTMLDivElement | null>;
  dedicationRef: React.RefObject<HTMLDivElement | null>;
  blurbRef: React.RefObject<HTMLDivElement | null>;
  authorRef: React.RefObject<HTMLDivElement | null>;
  tocRef: React.RefObject<HTMLDivElement | null>;
  manuscriptRef: React.RefObject<HTMLDivElement | null>;
  TITLES: Record<number, string>;
  CHAPTER_NUMS: number[];
  state: {
    baseColor: string;
    descentColor: string;
    sacredColor: string;
    properColor: string;
    fontScale: number;
    lineHeight: number;
    letterSpacing: number;
  };
}

export default function Layer3Canvas({
  chapter,
  setChapter,
  paragraphs,
  loading,
  error,
  depth,
  go,
  titleOpacity,
  titleScale,
  topCanvasRef,
  dedicationRef,
  blurbRef,
  authorRef,
  tocRef,
  manuscriptRef,
  TITLES,
  CHAPTER_NUMS,
  state,
}: Layer3CanvasProps) {
  const [internalRenderTimestamp, setInternalRenderTimestamp] = useState<number>(0);

  useEffect(() => {
    setInternalRenderTimestamp(performance.now());
  }, [chapter]);

  /**
   * HIGH-PRECISION VIEWPORT SCROLL LOCK PIPELINE
   * Natively calculates element positioning coordinates to fix missing method errors.
   */
  const jumpTo = (targetRef: React.RefObject<HTMLDivElement | null>) => {
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Convert the line height parameter safely to standard CSS strings
  const formattedProseState = {
    ...state,
    lineHeight: `${state.lineHeight || 2.0}`,
  };

  return (
    <div ref={topCanvasRef} className="w-full max-w-2xl mx-auto px-6 py-24 relative z-20 space-y-32 font-serif select-text">
      <style dangerouslySetInnerHTML={{__html: `
        .canvas-section-divider-line {
          width: 24px;
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
          margin: 2.5rem 0;
        }
        .canvas-meta-label-mono {
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 0.3em;
          color: rgba(6, 182, 212, 0.45);
          text-transform: uppercase;
        }
        .canvas-quick-jump-grid button {
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
      `}} />

      {/* COVER HEADER SECTOR BLOCK */}
      <div className="min-h-[60vh] flex flex-col justify-center select-none text-center md:text-left">
        <span className="canvas-meta-label-mono font-bold">// MANUSCRIPT_STREAM_ACTIVE</span>
        <h1 
          style={{ opacity: titleOpacity, transform: `scale(${titleScale})`, transition: "all 0.1s ease-out" }}
          className="text-3xl md:text-5xl font-black tracking-tight text-zinc-100 uppercase mt-4 leading-tight"
        >
          THE CELLS <br /> OF STARDUST
        </h1>
        <div className="canvas-section-divider-line mx-auto md:mix-none" />
        <p className="text-zinc-500 font-sans text-xs tracking-wide">SYSTEM_VERSION_4.0.0 // CURRENT_NODE_07</p>
      </div>

      {/* QUICK LINK VIEWPORT NAVIGATION SYSTEM CONSOLE */}
      <div className="p-4 border border-zinc-900/60 bg-[#020204]/40 backdrop-blur-md rounded-xs space-y-3 select-none">
        <div className="canvas-meta-label-mono font-bold tracking-widest text-[7.5px]">
          // HARDWARE_QUICK_JUMP_INDEX_LINKS
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 canvas-quick-jump-grid">
          <button onClick={() => jumpTo(manuscriptRef)} className="py-2.5 border border-zinc-800 bg-black/60 text-zinc-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all rounded-xs active:scale-98">
            MANUSCRIPT_PROSE
          </button>
          <button onClick={() => jumpTo(dedicationRef)} className="py-2.5 border border-zinc-800 bg-black/60 text-zinc-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all rounded-xs active:scale-98">
            DEDICATION
          </button>
          <button onClick={() => jumpTo(blurbRef)} className="py-2.5 border border-zinc-800 bg-black/60 text-zinc-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all rounded-xs active:scale-98">
            BLURB_TEXT
          </button>
          <button onClick={() => jumpTo(authorRef)} className="py-2.5 border border-zinc-800 bg-black/60 text-zinc-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all rounded-xs active:scale-98">
            AUTHOR_BIO
          </button>
          <button onClick={() => jumpTo(tocRef)} className="py-2.5 border border-zinc-800 bg-black/60 text-zinc-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all rounded-xs active:scale-98">
            TABLE_OF_CONTENTS
          </button>
        </div>
      </div>

      {/* DEDICATION SECTION LAYER */}
      <div ref={dedicationRef} className="scroll-mt-24 py-6 text-zinc-400 text-sm italic tracking-wide leading-relaxed">
        <div className="canvas-meta-label-mono mb-3 font-semibold tracking-wider">// SEC_01_DEDICATION</div>
        <p>For those who calculate the distance between code strings and stardust.</p>
      </div>

      {/* BLURB SECTION LAYER */}
      <div ref={blurbRef} className="scroll-mt-24 py-6 text-zinc-300 space-y-4 font-sans text-xs tracking-wide leading-relaxed text-justify">
        <div className="canvas-meta-label-mono mb-3 font-semibold tracking-wider font-serif">// SEC_02_BLURB_PROSE</div>
        <p>A deep multi-layered narrative tracing structural boundary limitations across high-capacity computer systems and physical organic models.</p>
      </div>

      {/* MAIN TEXT TOKEN STREAM Virtualizer FRAME */}
      <ManuscriptCore
        manuscriptRef={manuscriptRef}
        tocRef={tocRef}
        chapter={chapter}
        setChapter={setChapter}
        paragraphs={paragraphs}
        loading={loading}
        error={error}
        state={formattedProseState}
        depth={depth}
        TITLES={TITLES}
        CHAPTER_NUMS={CHAPTER_NUMS}
        jumpTo={jumpTo}
      />

      {/* AUTHOR BIO FOOTER DECK */}
      <div ref={authorRef} className="scroll-mt-24 pt-12 border-t border-zinc-900 text-zinc-500 text-xs font-sans tracking-wide space-y-2 select-none">
        <div className="canvas-meta-label-mono">// SEC_03_AUTHOR_METRICS</div>
        <p>Orchestrated in collaboration with deep-learning writing agents inside a clean systems interface.</p>
        <span className="hidden sr-only" data-rendered-ticks={internalRenderTimestamp} />
      </div>
    </div>
  );
}


