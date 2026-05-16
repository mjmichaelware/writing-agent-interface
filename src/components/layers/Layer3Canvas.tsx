"use client";

import React, { useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  go,
  topCanvasRef,
  scrollContainerRef,
  TITLES,
  CHAPTER_NUMS,
  state,
}: Layer3CanvasProps) {
  
  // FRAMER MOTION FIX: Opacity fade on scroll
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const backdropOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBeginReading = () => {
    if (!chapter) setChapter(1);
    scrollToSection("reading");
  };

  const handleLoadChapter = (num: number) => {
    setChapter(num);
    setTimeout(() => scrollToSection("reading"), 100);
  };

  const formattedProseState = useMemo(() => ({
    ...state,
    lineHeight: `${state?.lineHeight || 2.0}`,
  }), [state]);

  return (
    <div ref={topCanvasRef} className="w-full relative z-20 font-serif bg-transparent text-zinc-100 select-text antialiased">
      
      {/* 1. TITLE PAGE (First surface, min-h-screen) */}
      <section id="title-page" className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Full Bleed Moon Boy Background with fade out on scroll */}
        <motion.div style={{ opacity: backdropOpacity }} className="absolute inset-0 z-0 pointer-events-none">
          <img src="/bg.png" alt="Moon Boy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center w-full px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-black text-white uppercase tracking-[0.2em] drop-shadow-2xl"
            style={{ fontFamily: 'var(--font-hebrew), serif' }}
          >
            THE WEIGHT OF THE SKY
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6, duration: 1 }}
            className="text-cyan-400 font-mono text-xs md:text-sm uppercase tracking-[0.4em] mt-6 font-bold"
          >
            An Archetypal Tale
          </motion.p>

          {/* Interactive Navigation Row */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.9, duration: 1 }}
            className="flex flex-wrap justify-center gap-4 mt-16 max-w-2xl font-mono"
          >
            <button onClick={() => scrollToSection("dedication")} className="px-5 py-2 border border-zinc-700 hover:border-cyan-500 hover:text-cyan-400 text-[10px] tracking-widest uppercase transition-all bg-black/40 backdrop-blur-sm rounded-xs">
              Dedication
            </button>
            <button onClick={() => scrollToSection("blurb")} className="px-5 py-2 border border-zinc-700 hover:border-cyan-500 hover:text-cyan-400 text-[10px] tracking-widest uppercase transition-all bg-black/40 backdrop-blur-sm rounded-xs">
              The Blurb
            </button>
            <button onClick={() => scrollToSection("about")} className="px-5 py-2 border border-zinc-700 hover:border-cyan-500 hover:text-cyan-400 text-[10px] tracking-widest uppercase transition-all bg-black/40 backdrop-blur-sm rounded-xs">
              About the Author
            </button>
            <button onClick={handleBeginReading} className="px-6 py-2 border border-zinc-200 bg-zinc-100 text-black font-bold hover:bg-cyan-400 hover:border-cyan-400 hover:text-black text-[10px] tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-xs">
              Begin Reading
            </button>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute -bottom-[35vh] text-zinc-500 font-mono text-[9px] tracking-[0.3em] uppercase"
          >
            By Michael Alonza Prentice Ware
          </motion.p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 space-y-40 pb-40">
        
        {/* 2. DEDICATION */}
        <section id="dedication" className="min-h-[40vh] flex flex-col items-center justify-center text-center scroll-mt-32">
          <div className="font-mono text-[8px] text-cyan-500/50 tracking-[0.3em] uppercase mb-8">
            // Dedication_Node
          </div>
          <p className="text-zinc-300 font-serif italic text-2xl md:text-3xl leading-relaxed tracking-wide">
            "James Lee Ware<br/><span className="text-lg text-zinc-500 mt-4 block">(In order to keep Curious)</span>"
          </p>
        </section>

        {/* 3. THE BLURB */}
        <section id="blurb" className="min-h-[50vh] flex flex-col justify-center scroll-mt-32">
          <div className="font-mono text-[8px] text-cyan-500/50 tracking-[0.3em] uppercase mb-8 border-b border-zinc-900 pb-2">
            // Synopsis_Matrix
          </div>
          <div className="space-y-6 text-zinc-200 text-sm md:text-base leading-loose tracking-wide text-justify font-serif">
            <p className="indent-8">
              In Hebron in 1003 BCE, during the early days of King David's rule over Judah, sixteen-year-old Dan lives inside an oppressive home paralyzed by his father's hoarding grief. Dan is a dreamwalker, a visionary uniquely capable of consciously stepping into a hidden world constructed from minute cells of universal dust.
            </p>
            <p>
              When his deep interventions fracture his family, Dan is cast out, forced to embark on a punishing physical trek northward toward Mount Hermon to find the ultimate source of reality. His path demands a brutal expenditure of tissue and will, shattering his physical voice and bringing him face-to-face with an infinite cycle of conflict written in the stars.
            </p>
          </div>
        </section>

        {/* 4. ABOUT THE AUTHOR */}
        <section id="about" className="min-h-[40vh] flex flex-col justify-center scroll-mt-32">
          <div className="font-mono text-[8px] text-cyan-500/50 tracking-[0.3em] uppercase mb-8 border-b border-zinc-900 pb-2">
            // Operator_Biography
          </div>
          <div className="space-y-6 text-zinc-300 text-sm leading-loose tracking-wide text-justify font-serif">
            <p className="indent-8">
              Michael Alonza Prentice Ware is a systems architecture specialist. He is pursuing a Bachelor of Science in Computer Science at Weber State University, focusing his development research on Machine Learning Alignment Governance and Explainable AI (XAI).
            </p>
            <p>
              Outside of layout engineering, he practices classical piano for three hours daily following the Russian method and Alexander technique principles.
            </p>
          </div>
        </section>

        {/* 5. TABLE OF CONTENTS */}
        <section id="toc" className="min-h-screen scroll-mt-32">
          <div className="font-mono text-[8px] text-cyan-500/50 tracking-[0.3em] uppercase mb-12 border-b border-zinc-900 pb-2 text-center">
            // Concordance_Index
          </div>
          
          <div className="space-y-16 font-serif">
            {/* PART I */}
            <div>
              <h3 className="text-cyan-400 font-bold tracking-[0.2em] text-sm uppercase mb-6 text-center">Part I: The Journey</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button key={num} onClick={() => handleLoadChapter(num)} className="text-left p-4 border border-zinc-900 bg-zinc-950/30 hover:border-cyan-900 hover:bg-cyan-950/20 transition-all rounded-xs group">
                    <span className="font-mono text-[9px] text-zinc-500 group-hover:text-cyan-400 block mb-1">CHAPTER {num}</span>
                    <span className="text-zinc-200 group-hover:text-white tracking-wide">{TITLES[num]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PART II */}
            <div>
              <h3 className="text-cyan-400 font-bold tracking-[0.2em] text-sm uppercase mb-6 text-center">Part II: The Deception & Reveal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[10, 11].map(num => (
                  <button key={num} onClick={() => handleLoadChapter(num)} className="text-left p-4 border border-zinc-900 bg-zinc-950/30 hover:border-cyan-900 hover:bg-cyan-950/20 transition-all rounded-xs group">
                    <span className="font-mono text-[9px] text-zinc-500 group-hover:text-cyan-400 block mb-1">CHAPTER {num}</span>
                    <span className="text-zinc-200 group-hover:text-white tracking-wide">{TITLES[num]}</span>
                  </button>
                ))}
                {/* Pending Chapters */}
                <div className="text-left p-4 border border-zinc-900/40 bg-transparent opacity-50 cursor-not-allowed rounded-xs">
                  <span className="font-mono text-[9px] text-zinc-600 block mb-1">CHAPTER 12</span>
                  <span className="text-zinc-500 italic tracking-wide">[Pending]</span>
                </div>
                <button onClick={() => handleLoadChapter(13)} className="text-left p-4 border border-zinc-900 bg-zinc-950/30 hover:border-cyan-900 hover:bg-cyan-950/20 transition-all rounded-xs group">
                  <span className="font-mono text-[9px] text-zinc-500 group-hover:text-cyan-400 block mb-1">CHAPTER 13</span>
                  <span className="text-zinc-200 group-hover:text-white tracking-wide">{TITLES[13]}</span>
                </button>
                <div className="text-left p-4 border border-zinc-900/40 bg-transparent opacity-50 cursor-not-allowed rounded-xs md:col-span-2">
                  <span className="font-mono text-[9px] text-zinc-600 block mb-1">CHAPTERS 14–17</span>
                  <span className="text-zinc-500 italic tracking-wide">[Pending]</span>
                </div>
              </div>
            </div>

            {/* PART III & EPILOGUE */}
            <div>
              <h3 className="text-cyan-400 font-bold tracking-[0.2em] text-sm uppercase mb-6 text-center">Part III: The Cosmic Union</h3>
              <div className="text-center p-4 border border-zinc-900/40 bg-transparent opacity-50 cursor-not-allowed rounded-xs mb-12">
                <span className="font-mono text-[9px] text-zinc-600 block mb-1">CHAPTERS 18–24</span>
                <span className="text-zinc-500 italic tracking-wide">[Pending]</span>
              </div>
              
              <h3 className="text-zinc-400 font-bold tracking-[0.2em] text-sm uppercase mb-6 text-center border-t border-zinc-900 pt-12">Epilogue</h3>
              <div className="text-center p-6 border border-zinc-900/40 bg-transparent opacity-50 cursor-not-allowed rounded-xs">
                <span className="text-zinc-500 italic tracking-wide">The Unresolved Question: Why</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. PROSE READING LOOP */}
        <section id="reading" className="min-h-screen scroll-mt-24">
          {chapter ? (
            <ManuscriptCore
              manuscriptRef={topCanvasRef} // Internal ref pass
              tocRef={topCanvasRef} // Internal ref pass
              chapter={chapter}
              setChapter={setChapter}
              paragraphs={paragraphs}
              loading={loading}
              error={error}
              state={formattedProseState}
              depth={depth}
              TITLES={TITLES}
              CHAPTER_NUMS={CHAPTER_NUMS}
              jumpTo={(ref) => scrollToSection("reading")}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] opacity-50 select-none">
              <span className="font-mono text-[9px] text-zinc-500 tracking-[0.3em] uppercase mb-4 animate-pulse">Awaiting Timeline Initialization</span>
              <button onClick={handleBeginReading} className="text-cyan-400 hover:text-cyan-300 text-xs tracking-widest uppercase font-bold transition-all border-b border-transparent hover:border-cyan-400 pb-1">
                Initialize Stream
              </button>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
