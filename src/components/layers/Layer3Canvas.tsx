"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Layer3CanvasProps {
  chapter: number;
  setChapter: (n: number) => void;
  paragraphs: string[];
  loading: boolean;
  error: string | null;
  depth: number;
  go: (delta: number) => void;
  titleOpacity: any;
  titleScale: any;
  topCanvasRef: React.RefObject<HTMLDivElement | null>;
  dedicationRef: React.RefObject<HTMLDivElement | null>;
  blurbRef: React.RefObject<HTMLDivElement | null>;
  authorRef: React.RefObject<HTMLDivElement | null>;
  tocRef: React.RefObject<HTMLDivElement | null>;
  manuscriptRef: React.RefObject<HTMLDivElement | null>;
  TITLES: Record<number, string>;
  CHAPTER_NUMS: number[];
  state: any;
}

function DynamicWord({ word, depth, state, isDescent }: { word: string; depth: number; state: any; isDescent: boolean }) {
  const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
  
  let color = isDescent ? state.descentColor : state.baseColor;
  if (["stardust", "universe", "stars", "sacred", "dreamwalker", "visionary"].includes(cleanWord)) {
    color = state.sacredColor || "#38bdf8";
  } else if (depth > 0.15) {
    color = depth > 0.55 ? "#0e7490" : "#06b6d4";
  }

  // FIX: Altered fallback default parameter to clean inline layout formatting rules
  let className = "inline transition-all duration-500 mx-[0.02em]";
  let inlineStyle: React.CSSProperties = { color };

  // Promote to inline-block blocks strictly if visual transformation rules are flagged
  if (["big", "huge", "giant", "god", "infinite", "oppressive"].includes(cleanWord)) {
    inlineStyle.fontWeight = "800";
    inlineStyle.transform = "scale(1.12)";
    className = "inline-block uppercase tracking-wide px-0.5 transition-all duration-500";
  } else if (["small", "minute", "stardust", "cells", "dust"].includes(cleanWord)) {
    inlineStyle.fontSize = "0.78em";
    inlineStyle.fontFamily = "monospace";
    inlineStyle.opacity = 0.55;
    className = "inline tracking-tighter transition-all duration-500";
  }

  if (["shake", "tremble", "fracture", "shattering", "conflict", "pit"].includes(cleanWord)) {
    className += " animate-word-shake";
  }

  return <span className={className} style={inlineStyle}>{word}</span>;
}

function MorphingParagraph({ text, isDescent, state, depth }: any) {
  const cleaned = text.replace(/\r/g, "");
  const tokens = cleaned.split(/(\s+|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <p 
      className="text-justify mb-6 font-serif select-text" 
      style={{ 
        fontSize: `${1.25 * state.fontScale}rem`, 
        lineHeight: state.lineHeight, 
        letterSpacing: `${state.letterSpacing}em`, 
        textIndent: "3rem" 
      }}
    >
      {tokens.map((tok: string, i: number) => {
        if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
        if (tok.startsWith("**") && tok.endsWith("**")) {
          return (
            <strong key={i} style={{ color: state.properColor, fontWeight: 600 }} className="inline-block scale-105">
              {tok.slice(2, -2)}
            </strong>
          );
        }
        return <DynamicWord key={i} word={tok} depth={depth} state={state} isDescent={isDescent} />;
      })}
    </p>
  );
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
  const jumpTo = (elementRef: React.RefObject<HTMLDivElement | null>) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <article className="relative z-20 px-6 max-w-2xl mx-auto flex flex-col pb-40 bg-transparent">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes wordShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-1px, 1px) rotate(-1deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          60% { transform: translate(-1px, -1px) rotate(1deg); }
          80% { transform: translate(1px, 1px) rotate(-1deg); }
        }
        .animate-word-shake {
          display: inline-block !important;
          animation: wordShake 0.25s infinite linear !important;
        }
      `}} />

      {/* FULL VIEWPORT TITLE COVER PAGE VIEW CONTAINER */}
      <motion.div 
        topCanvasRef={topCanvasRef} 
        style={{ opacity: titleOpacity, scale: titleScale }}
        className="min-h-screen flex flex-col justify-between items-center text-center pt-32 pb-16 relative animate-fade"
      >
        <div className="flex-1 flex flex-col justify-center items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-zinc-100 uppercase tracking-[0.5em] text-4xl md:text-6xl font-[var(--font-hebrew)] leading-tight max-w-2xl font-bold select-none"
          >
            THE WEIGHT OF THE SKY
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="text-cyan-600 font-mono text-[10px] uppercase tracking-[0.4em] mt-4 select-none"
          >
            An Archetypal Tale
          </motion.p>

          <div className="w-12 h-[1px] bg-zinc-800 my-8" />
          
          <div className="flex flex-wrap justify-center gap-2.5 font-mono text-[9px] tracking-widest max-w-md">
            <button 
              onClick={() => jumpTo(manuscriptRef)}
              className="px-5 py-2.5 bg-cyan-600 text-zinc-950 font-bold hover:bg-cyan-400 transition-all shadow-md uppercase tracking-[0.15em] border border-cyan-500 rounded-sm"
            >
              Begin Reading
            </button>
            <button onClick={() => jumpTo(dedicationRef)} className="px-4 py-2.5 border border-zinc-800 bg-black/60 hover:border-cyan-500 hover:text-cyan-400 transition-all rounded-sm">
              Dedicated To
            </button>
            <button onClick={() => jumpTo(blurbRef)} className="px-4 py-2.5 border border-zinc-800 bg-black/60 hover:border-cyan-500 hover:text-cyan-400 transition-all rounded-sm">
              The Blurb
            </button>
            <button onClick={() => jumpTo(authorRef)} className="px-4 py-2.5 border border-zinc-800 bg-black/60 hover:border-cyan-500 hover:text-cyan-400 transition-all rounded-sm">
              About Author
            </button>
            <button onClick={() => jumpTo(tocRef)} className="px-4 py-2.5 border border-zinc-800 bg-black/60 hover:border-cyan-500 hover:text-cyan-400 transition-all rounded-sm">
              Table of Contents
            </button>
          </div>
        </div>

        <div className="w-full text-center select-none pt-4">
          <p className="text-zinc-500 font-mono text-[8px] uppercase tracking-[0.3em]">
            By Michael Alonza Prentice Ware
          </p>
          <ChevronDown size={14} className="text-zinc-600 animate-bounce mx-auto mt-4 opacity-40" />
        </div>
      </motion.div>

      {/* VERBATIM ACCREDITATION DEDICATION BLOCK */}
      <div ref={dedicationRef} className="min-h-[40vh] flex flex-col justify-center items-center text-center scroll-mt-20">
        <p className="text-cyan-600 font-mono text-[8px] uppercase tracking-[0.3em] mb-4">// ACCREDITATION</p>
        <p className="text-zinc-200 font-serif italic text-xl max-w-md leading-relaxed select-text">
          "James Lee Ware (In order to keep Curious)"
        </p>
      </div>

      {/* VERBATIM SUMMARY SYNOPSIS BLURB BLOCK */}
      <div ref={blurbRef} className="min-h-[50vh] flex flex-col justify-center items-center scroll-mt-20">
        <p className="text-cyan-600 font-mono text-[8px] uppercase tracking-[0.3em] mb-4">// BLURB SUMMARY</p>
        <div className="bg-zinc-950/40 border border-zinc-900/60 p-6 rounded-sm text-justify max-w-lg select-text">
          <p className="text-zinc-300 text-xs font-serif tracking-wide leading-relaxed">
            In Hebron in 1003 BCE, during the early days of King David's rule over Judah, sixteen-year-old Dan lives inside an oppressive home paralyzed by his father’s hoarding grief. Dan is a dreamwalker, a visionary uniquely capable of consciously stepping into a hidden world constructed from minute cells of universal dust. When his deep interventions fracture his family, Dan is cast out, forced to embark on a punishing physical trek northward toward Mount Hermon to find the ultimate source of reality. His path demands a brutal expenditure of tissue and will, shattering his physical voice and bringing him face-to-face with an infinite cycle of conflict written in the stars.
          </p>
        </div>
      </div>

      {/* VERBATIM BIOGRAPHY AUTHOR BLOCK */}
      <div ref={authorRef} className="min-h-[50vh] flex flex-col justify-center items-center text-center scroll-mt-20">
        <p className="text-cyan-600 font-mono text-[8px] uppercase tracking-[0.3em] mb-4">// AUTHOR BIOGRAPHY</p>
        <div className="max-w-lg bg-zinc-950/20 border border-zinc-900/40 p-6 rounded-sm text-justify select-text flex flex-col items-center gap-4">
          <p className="text-zinc-300 text-xs font-serif tracking-wide leading-relaxed">
            Michael Alonza Prentice Ware is a systems architecture specialist. He is pursuing a Bachelor of Science in Computer Science at Weber State University, focusing his development research on Machine Learning Alignment Governance and Explainable AI (XAI). Outside of layout engineering, he practices classical piano for three hours daily following the Russian method and Alexander technique principles.
          </p>
        </div>
      </div>

      {/* CANONICAL MATRIX SECTIONS */}
      <div ref={tocRef} className="min-h-[70vh] flex flex-col justify-center scroll-mt-20 border-t border-b border-zinc-900/40 py-12">
        <p className="text-cyan-600 font-mono text-[8px] uppercase tracking-[0.3em] mb-8 text-center">// COMPLETE CANONICAL MATRIX</p>
        <div className="max-w-md mx-auto w-full space-y-6 font-mono text-xs px-4">
          
          <section className="space-y-1.5">
            <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-1">PART I: THE JOURNEY (Chapters 1–9)</p>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => { setChapter(num); setTimeout(() => { manuscriptRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
                className={`flex justify-between w-full text-left pb-0.5 transition-colors ${chapter === num ? "text-cyan-400" : "text-zinc-400 hover:text-zinc-200"}`}
              >
                <span className="font-serif italic">{TITLES[num] || `Chapter ${num}`}</span>
                <span className="text-[9px] opacity-30">NODE 0{num}</span>
              </button>
            ))}
          </section>

          <section className="space-y-1.5">
            <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-1">PART II: THE DECEPTION & REVEAL (Chapters 10–17)</p>
            {[10, 11, 12, 13, 14, 15, 16, 17].map((num) => {
              const isPending = TITLES[num] === undefined;
              return (
                <button
                  key={num}
                  disabled={isPending}
                  onClick={() => { if (!isPending) { setChapter(num); setTimeout(() => { manuscriptRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100); } }}
                  className={`flex justify-between w-full text-left pb-0.5 transition-colors ${isPending ? "text-zinc-700 cursor-not-allowed" : chapter === num ? "text-cyan-400" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  <span className="font-serif italic">{isPending ? `Chapter ${num}: [Staging Node: Unwritten]` : TITLES[num]}</span>
                  <span className="text-[9px] opacity-30">NODE {num}</span>
                </button>
              );
            })}
          </section>

          <section className="space-y-1.5">
            <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-1">PART III: THE COSMIC UNION (Chapters 18–24)</p>
            {[18, 19, 20, 21, 22, 23, 24].map((num) => (
              <div key={num} className="flex justify-between w-full text-left pb-0.5 text-zinc-700 select-none">
                <span className="font-serif italic">Chapter {num}: [Staging Node: Unwritten]</span>
                <span className="text-[9px] opacity-20">NODE {num}</span>
              </div>
            ))}
          </section>

          <section className="space-y-1.5">
            <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-1">EPILOGUE</p>
            <div className="flex justify-between w-full text-left pb-0.5 text-zinc-400">
              <span className="font-serif italic">The Unresolved Question: Why</span>
              <span className="text-[9px] opacity-30">NODE 25</span>
            </div>
          </section>

        </div>
      </div>

      {/* CONTINUOUS MANUSCRIPT WITH FILM OVERLAY MASK FADE INGRESS */}
      <div 
        ref={manuscriptRef} 
        className="pt-24 min-h-[60vh] scroll-mt-16 transition-all duration-300"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, white 14%, white 84%, transparent 99%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, white 14%, white 84%, transparent 99%)'
        }}
      >
        <h2 className="text-zinc-400 uppercase tracking-[0.7em] text-[11px] text-center mb-16 font-mono select-none">
          {TITLES[chapter] || `Chapter ${chapter}`}
        </h2>
        
        {loading && (
          <p className="text-zinc-500 text-center text-xs uppercase tracking-widest font-mono animate-pulse select-none">
            Parsing active manuscript stream data node...
          </p>
        )}
        
        {error && (
          <div className="text-center p-4 border border-red-900/30 bg-red-950/10 rounded-sm select-none">
            <p className="text-red-400 font-mono text-xs">Extraction Failed: {error}</p>
          </div>
        )}
        
        {!loading && !error && paragraphs.length === 0 && (
          <p className="text-zinc-600 text-center text-xs font-mono select-none">CHAPTER MANUSCRIPT ARRAY NULL</p>
        )}

        <div className="space-y-6">
          {paragraphs.map((para, i) => (
            <div key={`${chapter}-${i}`} data-para={i}>
              <MorphingParagraph text={para} isDescent={i > 12} state={state} depth={depth} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-32 flex justify-between items-center border-t border-zinc-900/60 pt-6 font-mono text-[9px] tracking-widest text-zinc-400 select-none">
        <button
          onClick={() => go(-1)}
          disabled={CHAPTER_NUMS.indexOf(chapter) === 0}
          className="flex items-center gap-1 hover:text-white transition-colors disabled:text-zinc-800 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={12} /> PREV BLOCK
        </button>
        <button
          onClick={() => go(1)}
          disabled={CHAPTER_NUMS.indexOf(chapter) === CHAPTER_NUMS.length - 1}
          className="flex items-center gap-1 hover:text-white transition-colors disabled:text-zinc-800 disabled:cursor-not-allowed"
        >
          NEXT BLOCK <ChevronRight size={12} />
        </button>
      </div>

    </article>
  );
}
