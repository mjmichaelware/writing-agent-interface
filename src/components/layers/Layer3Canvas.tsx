"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Cpu, Eye, Info, BookOpen } from "lucide-react";

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
  topCanvasRef: React.RefObject<HTMLDivElement>;
  dedicationRef: React.RefObject<HTMLDivElement>;
  blurbRef: React.RefObject<HTMLDivElement>;
  authorRef: React.RefObject<HTMLDivElement>;
  tocRef: React.RefObject<HTMLDivElement>;
  manuscriptRef: React.RefObject<HTMLDivElement>;
  TITLES: Record<number, string>;
  CHAPTER_NUMS: number[];
  state: any;
}

function DynamicWord({ word }: { word: string; state: any }) {
  const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
  
  // FIXED: All red text coloration rules have been permanently purged from the token analyzer loop.
  let color = "#e4e4e7"; 
  let className = "inline transition-all duration-300 mx-[0.02em] hover:text-cyan-300 select-text cursor-default";
  let inlineStyle: React.CSSProperties = { color };

  if (["stardust", "universe", "stars", "sacred", "dreamwalker", "visionary", "sky", "heavens", "reality"].includes(cleanWord)) {
    color = "#22d3ee"; 
    inlineStyle.textShadow = "0 0 10px rgba(34,211,238,0.6)";
    className += " font-semibold tracking-wide";
  } else if (["megiddo", "stones", "walls", "heavy", "mound", "gate", "hermon", "iron", "rock", "soil", "mound"].includes(cleanWord)) {
    color = "#a1a1aa"; 
    className += " tracking-tight font-medium";
  }

  // FIXED: Transformations trigger seamlessly on single narrative focus markers
  if (["big", "huge", "infinite", "oppressive", "god", "lord", "weight", "brutal"].includes(cleanWord)) {
    inlineStyle.fontWeight = "900";
    inlineStyle.transform = "scale(1.05)";
    className += " inline-block uppercase font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-cyan-400 to-zinc-100 px-0.5";
  } else if (["small", "minute", "cells", "dust", "thin", "tissue"].includes(cleanWord)) {
    inlineStyle.fontSize = "0.85em";
    inlineStyle.fontFamily = "monospace";
    inlineStyle.opacity = 0.65;
    className += " font-mono tracking-tighter";
  }

  if (["shake", "tremble", "fracture", "shattering", "conflict", "crawling", "twisting"].includes(cleanWord)) {
    className += " animate-word-shake";
  } else if (["fall", "descent", "down", "dropped", "sinking", "plummeting"].includes(cleanWord)) {
    className += " animate-word-fall";
  }

  return <span className={className} style={inlineStyle}>{word}</span>;
}

function MorphingParagraph({ text, state }: { text: string; state: any }) {
  const cleaned = text.replace(/\r/g, "");
  const tokens = cleaned.split(/(\s+|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    // FIXED: Uses hardware-accelerated continuous viewport animation tracking to fade elements dynamically based on scroll position
    <p 
      className="scroll-fade-paragraph text-left mb-10 font-serif select-text tracking-normal bg-transparent text-zinc-300/90 transition-all duration-300" 
      style={{ 
        fontSize: `${1.22 * state.fontScale}rem`, 
        lineHeight: "2.0", 
        letterSpacing: `${state.letterSpacing}em`, 
        textIndent: "3.5rem" 
      }}
    >
      {tokens.map((tok: string, i: number) => {
        if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
        if (tok.startsWith("**") && tok.endsWith("**")) {
          return (
            <strong key={i} style={{ color: "#22d3ee", textShadow: "0 0 8px rgba(34,211,238,0.4)" }} className="inline-block font-bold font-sans tracking-wide">
              {tok.slice(2, -2)}
            </strong>
          );
        }
        return <DynamicWord key={i} word={tok} state={state} />;
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

  return (
    <article className="relative w-full max-w-2xl mx-auto flex flex-col pb-48 bg-transparent px-4 md:px-0 z-20">
      
      {/* Maximum Capacity Style Sheet Rules */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes wordShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-0.5px, 0.5px) rotate(-0.5deg); }
          40% { transform: translate(0.5px, -0.5px) rotate(0.5deg); }
          60% { transform: translate(-0.5px, -0.5px) rotate(0.5deg); }
          80% { transform: translate(0.5px, 0.5px) rotate(-0.5deg); }
        }
        @keyframes wordFall {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(2.5px); opacity: 0.8; }
        }
        @keyframes dynamicScrollFade {
          0% { opacity: 0; transform: translateY(8px); filter: blur(1px); }
          14% { opacity: 1; transform: translateY(0); filter: blur(0px); }
          86% { opacity: 1; transform: translateY(0); filter: blur(0px); }
          100% { opacity: 0; transform: translateY(-8px); filter: blur(1px); }
        }
        .animate-word-shake {
          display: inline-block !important;
          animation: wordShake 0.2s infinite linear !important;
        }
        .animate-word-fall {
          display: inline-block !important;
          animation: wordFall 1.8s infinite ease-in-out !important;
        }
        
        /* FIXED: Native CSS Viewport Timeline mapping to slide and fade text elements continuously on scroll */
        .scroll-fade-paragraph {
          animation: dynamicScrollFade linear both;
          animation-timeline: view();
          animation-range: entry 0% exit 100%;
        }
        
        .premium-panel {
          border: 1px solid rgba(6, 182, 212, 0.15);
          background: linear-gradient(145deg, rgba(8,8,10,0.8) 0%, rgba(2,2,4,0.9) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.9);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-panel:hover {
          border-color: rgba(6, 182, 212, 0.4);
          box-shadow: 0 25px 60px rgba(6, 182, 212, 0.12);
        }
        .premium-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.4), transparent);
          animation: scanline 8s infinite linear;
        }
      `}} />

      {/* VIEWPORT INITIALIZATION PANEL */}
      <motion.div 
        ref={topCanvasRef} 
        style={{ opacity: titleOpacity, scale: titleScale }}
        className="min-h-screen flex flex-col justify-between items-center text-center pt-32 pb-16 relative bg-transparent select-none"
      >
        <div className="flex-1 flex flex-col justify-center items-center w-full">
          <div className="font-mono text-[9px] tracking-[0.45em] text-cyan-500/60 mb-5 animate-pulse">// KERNEL_STREAM_ACTIVE</div>
          
          <h1 className="text-zinc-100 uppercase tracking-[0.55em] text-4xl md:text-6xl font-black leading-tight max-w-2xl drop-shadow-[0_4px_16px_rgba(0,0,0,1)]">
            THE WEIGHT OF THE SKY
          </h1>
          
          <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.5em] mt-4 font-bold tracking-widest">
            An Archetypal Tale
          </p>

          <div className="w-16 h-[1px] bg-cyan-500/30 my-10 shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
          
          <div className="grid grid-cols-2 gap-2 max-w-sm w-full px-4 font-mono text-[9px] tracking-widest">
            <button 
              onClick={() => jumpTo(manuscriptRef)}
              className="col-span-2 py-3.5 bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all rounded-xs font-bold shadow-lg active:scale-98"
            >
              CONNECT: MANUSCRIPT_STREAM
            </button>
            <button onClick={() => jumpTo(dedicationRef)} className="py-2.5 border border-zinc-800 bg-black/60 text-zinc-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all rounded-xs active:scale-98">
              DEDICATION
            </button>
            <button onClick={() => jumpTo(blurbRef)} className="py-2.5 border border-zinc-800 bg-black/60 text-zinc-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all rounded-xs active:scale-98">
              SYNOPSIS
            </button>
            <button onClick={() => jumpTo(authorRef)} className="py-2.5 border border-zinc-800 bg-black/60 text-zinc-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all rounded-xs active:scale-98">
              BIOGRAPHY
            </button>
            <button onClick={() => jumpTo(tocRef)} className="py-2.5 border border-zinc-800 bg-black/60 text-zinc-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-all rounded-xs active:scale-98">
              INDEX_MATRIX
            </button>
          </div>
        </div>

        <div className="w-full text-center pt-4">
          <p className="text-zinc-600 font-mono text-[8px] uppercase tracking-[0.35em]">
            By Michael Alonza Prentice Ware
          </p>
          <ChevronDown size={14} className="text-cyan-500/50 animate-bounce mx-auto mt-4" />
        </div>
      </motion.div>

      {/* FRONT MATTER: ACCREDITATION DEDICATION */}
      <div ref={dedicationRef} className="min-h-[45vh] flex flex-col justify-center items-center text-center scroll-mt-24 px-4 bg-transparent select-none">
        <p className="text-cyan-500 font-mono text-[8px] uppercase tracking-[0.4em] mb-4 font-bold">// CRITICAL_ACCREDITATION</p>
        <p className="text-zinc-100 font-serif italic text-2xl max-w-xl leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,1)]">
          "James Lee Ware (In order to keep Curious)"
        </p>
      </div>

      {/* FRONT MATTER: CORE SYNOPSIS CONTAINER */}
      <div ref={blurbRef} className="scroll-mt-24 py-10 bg-transparent">
        <div className="premium-panel p-6 md:p-8">
          <div className="flex justify-between items-center mb-5 font-mono text-[8px] text-cyan-400/70 select-none border-b border-zinc-900 pb-3 font-bold tracking-widest">
            <span className="flex items-center gap-1.5"><BookOpen size={11}/> // CORE_MANUSCRIPT_SYNOPSIS</span>
            <span>NODE_DATA_REF_01</span>
          </div>
          <p className="text-zinc-200 text-sm font-serif tracking-wide leading-relaxed text-justify text-indent">
            In Hebron in 1003 BCE, during the early days of King David's rule over Judah, sixteen-year-old Dan lives inside an oppressive home paralyzed by his father’s hoarding grief. Dan is a dreamwalker, a visionary uniquely capable of consciously stepping into a hidden world constructed from minute cells of universal dust. When his deep interventions fracture his family, Dan is cast out, forced to embark on a punishing physical trek northward toward Mount Hermon to find the ultimate source of reality. His path demands a brutal expenditure of tissue and will, shattering his physical voice and bringing him face-to-face with an infinite cycle of conflict written in the stars.
          </p>
        </div>
      </div>

      {/* FRONT MATTER: BIOGRAPHY METRICS */}
      <div ref={authorRef} className="scroll-mt-24 py-10 bg-transparent">
        <div className="premium-panel p-6 md:p-8">
          <div className="flex justify-between items-center mb-5 font-mono text-[8px] text-cyan-400/70 select-none border-b border-zinc-900 pb-3 font-bold tracking-widest">
            <span className="flex items-center gap-1.5"><Cpu size={11}/> // OPERATOR_BIOGRAPHY_METRICS</span>
            <span>NODE_DATA_REF_02</span>
          </div>
          <p className="text-zinc-200 text-sm font-serif tracking-wide leading-relaxed text-justify">
            Michael Alonza Prentice Ware is a systems architecture specialist. He is pursuing a Bachelor of Science in Computer Science at Weber State University, focusing his development research on Machine Learning Alignment Governance and Explainable AI (XAI). Outside of layout engineering, he practices classical piano for three hours daily following the Russian method and Alexander technique principles.
          </p>
        </div>
      </div>

      {/* CYBERNETIC INDEX INDEX TABLE OF CONTENTS */}
      <div ref={tocRef} className="scroll-mt-24 py-16 bg-transparent border-t border-b border-zinc-900/60 my-16">
        <p className="text-cyan-400 font-mono text-[9px] uppercase tracking-[0.45em] mb-10 text-center font-bold tracking-widest select-none">// INTEGRATED_MANUSCRIPT_INDEX</p>
        <div className="space-y-6">
          
          <div className="premium-panel p-5">
            <div className="text-[8px] uppercase tracking-[0.25em] text-cyan-400 font-mono font-bold border-b border-zinc-900 pb-3 mb-3 flex justify-between items-center select-none">
              <span>PART I: THE JOURNEY (Chapters 1–9)</span>
              <span className="text-cyan-600/60 font-mono">SYS_INDEX_M1</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => { setChapter(num); setTimeout(() => { manuscriptRef.current?.scrollIntoView({ behavior: "smooth" }); }, 60); }}
                  className={`group flex justify-between items-center w-full px-3 py-2.5 border rounded-xs font-mono text-xs transition-all duration-200 ${chapter === num ? "bg-cyan-950/40 border-cyan-500/60 text-cyan-400 font-bold shadow-inner" : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40"}`}
                >
                  <span className="font-serif italic tracking-wide group-hover:translate-x-1.5 transition-transform">{TITLES[num] || `Chapter ${num}`}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] opacity-40 font-mono">NODE_0{num}</span>
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${chapter === num ? "bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,1)] scale-110" : "bg-zinc-800"}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="premium-panel p-5">
            <div className="text-[8px] uppercase tracking-[0.25em] text-zinc-400 font-mono font-bold border-b border-zinc-900 pb-3 mb-3 flex justify-between items-center select-none">
              <span>PART II: THE DECEPTION & REVEAL (Chapters 10–17)</span>
              <span className="text-zinc-600">SYS_INDEX_M2</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {[10, 11, 12, 13, 14, 15, 16, 17].map((num) => {
                const isPending = TITLES[num] === undefined;
                return (
                  <button
                    key={num}
                    disabled={isPending}
                    onClick={() => { if (!isPending) { setChapter(num); setTimeout(() => { manuscriptRef.current?.scrollIntoView({ behavior: "smooth" }); }, 60); } }}
                    className={`group flex justify-between items-center w-full px-3 py-2.5 border rounded-xs font-mono text-xs transition-all ${isPending ? "border-transparent text-zinc-700 cursor-not-allowed select-none opacity-30" : chapter === num ? "bg-cyan-950/40 border-cyan-500/60 text-cyan-400 font-bold" : "border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40"}`}
                  >
                    <span className="font-serif italic tracking-wide">{isPending ? `Chapter ${num}: [Staging Node: Unwritten]` : TITLES[num]}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] opacity-40">NODE_{num}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${isPending ? "bg-zinc-900" : chapter === num ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" : "bg-zinc-800"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* MANUSCRIPT STREAM SEGMENT CONTAINER */}
      <div ref={manuscriptRef} className="pt-20 min-h-[80vh] scroll-mt-16 bg-transparent">
        <div className="relative z-20 bg-transparent">
          <h2 className="text-zinc-400 uppercase tracking-[0.72em] text-[11px] text-center mb-16 font-mono select-none drop-shadow-md">
            {TITLES[chapter] || `Chapter ${chapter}`}
          </h2>
          
          {loading && (
            <p className="text-cyan-500/60 text-center text-xs uppercase tracking-widest font-mono animate-pulse select-none py-12">
              STREAMING_ACTIVE_MANUSCRIPT_CORE_NODE...
            </p>
          )}
          
          {error && (
            <p className="text-red-400 font-mono text-xs text-center border border-red-900/30 bg-red-950/10 p-4 rounded-xs select-none">
              CRITICAL_EXTRACTION_FAILURE: {error}
            </p>
          )}

          <div className="space-y-4 bg-transparent">
            {!loading && !error && paragraphs.map((para, i) => (
              <div key={`${chapter}-${i}`} data-para={i} className="bg-transparent flex flex-col">
                <MorphingParagraph text={para} state={state} />
                
                {/* FIXED: Embeds explicit structural image portals directly below text thresholds */}
                {chapter === 7 && i === 3 && (
                  <div className="my-10 border border-cyan-500/20 p-2 bg-black/60 backdrop-blur-md rounded-xs shadow-2xl transition-all duration-300 hover:border-cyan-500/40">
                    <img src="/assets/agent-photos/flies.jpg" alt="Swarm Node" className="w-full h-56 object-cover opacity-75 border border-zinc-900 rounded-2xs" />
                    <div className="p-3 font-mono text-[8px] text-cyan-400/50 uppercase tracking-widest flex justify-between items-center select-none">
                      <span>// LANDMARK_REGISTRATION_NODE: FLIES_SWARM_DESCENT</span>
                      <span className="text-zinc-600">CH_07_E01</span>
                    </div>
                  </div>
                )}
                
                {chapter === 7 && i === 7 && (
                  <div className="my-10 border border-cyan-500/20 p-2 bg-black/60 backdrop-blur-md rounded-xs shadow-2xl transition-all duration-300 hover:border-cyan-500/40">
                    <img src="/assets/agent-photos/megiddo1.jpg" alt="Gates of Megiddo" className="w-full h-56 object-cover opacity-75 border border-zinc-900 rounded-2xs" />
                    <div className="p-3 font-mono text-[8px] text-cyan-400/50 uppercase tracking-widest flex justify-between items-center select-none">
                      <span>// LANDMARK_REGISTRATION_NODE: MEGIDDO_OUTER_FORTRESS</span>
                      <span className="text-zinc-600">CH_07_E02</span>
                    </div>
                  </div>
                )}
                
                {chapter === 7 && i === 11 && (
                  <div className="my-10 border border-cyan-500/20 p-2 bg-black/60 backdrop-blur-md rounded-xs shadow-2xl transition-all duration-300 hover:border-cyan-500/40">
                    <img src="/assets/agent-photos/megiddo2.jpg" alt="Town Descent" className="w-full h-56 object-cover opacity-75 border border-zinc-900 rounded-2xs" />
                    <div className="p-3 font-mono text-[8px] text-cyan-400/50 uppercase tracking-widest flex justify-between items-center select-none">
                      <span>// LANDMARK_REGISTRATION_NODE: MEGIDDO_INTERNAL_DESCENT</span>
                      <span className="text-zinc-600">CH_07_E03</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </article>
  );
}
