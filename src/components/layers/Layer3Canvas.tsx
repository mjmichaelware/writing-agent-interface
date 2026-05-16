"use client";

import React, { useMemo, useEffect, useState } from "react";
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
  
  // High-precision scroll hooks for the background fade
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const backdropOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    <div ref={topCanvasRef} className="w-full relative z-20 font-serif text-zinc-100 select-text antialiased">
      
      {/* ========================================================================= */}
      {/* THE MASTER CSS ENGINE: BESPOKE CINEMATIC STYLING                          */}
      {/* ========================================================================= */}
      <style dangerouslySetInnerHTML={{__html: `
        /* CORE VARIABLES */
        :root {
          --cyan-glow: rgba(34, 211, 238, 0.6);
          --cyan-core: #22d3ee;
          --void-black: #020203;
          --glass-surface: rgba(10, 10, 12, 0.45);
          --glass-border: rgba(255, 255, 255, 0.08);
          --text-primary: #f4f4f5;
          --text-muted: #a1a1aa;
        }

        /* AMBIENT ANIMATIONS */
        @keyframes etherealBreathe {
          0% { text-shadow: 0 0 20px rgba(255,255,255,0.1), 0 0 40px rgba(34,211,238,0.05); }
          50% { text-shadow: 0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(34,211,238,0.2); }
          100% { text-shadow: 0 0 20px rgba(255,255,255,0.1), 0 0 40px rgba(34,211,238,0.05); }
        }

        @keyframes lightSweep {
          0% { transform: translateX(-150%) skewX(-45deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(200%) skewX(-45deg); opacity: 0; }
        }

        @keyframes subtleFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }

        @keyframes borderPulse {
          0% { border-color: rgba(255,255,255,0.05); }
          50% { border-color: rgba(34,211,238,0.3); box-shadow: 0 0 15px rgba(34,211,238,0.1); }
          100% { border-color: rgba(255,255,255,0.05); }
        }

        /* TITLE PAGE TYPOGRAPHY */
        .cinematic-master-title {
          font-family: var(--font-hebrew), Georgia, serif;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ffffff;
          line-height: 1.1;
          text-align: center;
          mix-blend-mode: overlay; /* Blends text dynamically into the moon boy image */
          animation: etherealBreathe 6s infinite ease-in-out;
          position: relative;
        }
        
        .cinematic-master-title::after {
          content: 'The Weight\\A of the Sky';
          white-space: pre;
          position: absolute;
          inset: 0;
          color: transparent;
          text-shadow: 0 2px 20px rgba(0,0,0,0.8);
          mix-blend-mode: normal;
          z-index: -1;
        }

        .cinematic-subtitle {
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.6em;
          color: rgba(34, 211, 238, 0.8);
          text-transform: uppercase;
          position: relative;
        }

        /* BESPOKE BUTTON ARCHITECTURE */
        .glass-nav-mesh {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 5rem;
          position: relative;
          z-index: 30;
        }

        .ethereal-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          padding: 12px 20px;
          position: relative;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ethereal-btn::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0%;
          height: 1px;
          background: var(--cyan-core);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateX(-50%);
        }

        .ethereal-btn:hover {
          color: #ffffff;
          text-shadow: 0 0 8px rgba(255,255,255,0.4);
          transform: translateY(-2px);
        }

        .ethereal-btn:hover::before {
          width: 100%;
          box-shadow: 0 0 10px var(--cyan-core);
        }

        .primary-action-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255,255,255,0.15);
          color: #ffffff;
          font-family: monospace;
          font-size: 10px;
          font-weight: bold;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          padding: 14px 32px;
          border-radius: 2px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.5s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .primary-action-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-150%) skewX(-45deg);
          transition: all 0.5s;
        }

        .primary-action-btn:hover {
          background: rgba(34, 211, 238, 0.1);
          border-color: rgba(34, 211, 238, 0.5);
          color: #ffffff;
          box-shadow: 0 0 25px rgba(34, 211, 238, 0.2), inset 0 0 10px rgba(34, 211, 238, 0.1);
          transform: translateY(-2px);
        }

        .primary-action-btn:hover::before {
          animation: lightSweep 1.5s ease-out;
        }

        /* SECTION FORMATTING */
        .content-glass-wrapper {
          position: relative;
          background: radial-gradient(circle at center, rgba(10,10,12,0.6) 0%, rgba(2,2,3,0.95) 100%);
          border-top: 1px solid rgba(255,255,255,0.03);
          box-shadow: 0 -20px 50px rgba(0,0,0,0.8);
          padding-top: 4rem;
        }

        .section-header-line {
          font-family: monospace;
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.4em;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .section-header-line::before,
        .section-header-line::after {
          content: '';
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          flex-grow: 1;
          max-width: 100px;
          margin: 0 20px;
        }

        .prose-block {
          font-family: Georgia, serif;
          font-size: 1.05rem;
          line-height: 2.2;
          color: #d4d4d8;
          text-align: justify;
          text-justify: inter-word;
          margin-bottom: 2rem;
          text-shadow: 0 1px 2px rgba(0,0,0,0.8);
        }

        /* TABLE OF CONTENTS ARCHITECTURE */
        .toc-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .toc-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 16px 8px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          background: transparent;
        }

        .toc-row::before {
          content: '';
          position: absolute;
          left: 0; bottom: -1px;
          height: 1px;
          width: 0%;
          background: var(--cyan-core);
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toc-row:hover {
          background: linear-gradient(90deg, rgba(34,211,238,0.03) 0%, transparent 100%);
          padding-left: 16px;
        }

        .toc-row:hover::before {
          width: 100%;
          box-shadow: 0 0 10px var(--cyan-core);
        }

        .toc-row-title {
          font-family: Georgia, serif;
          font-size: 1.1rem;
          color: #a1a1aa;
          transition: color 0.4s ease;
        }

        .toc-row:hover .toc-row-title {
          color: #ffffff;
          text-shadow: 0 0 8px rgba(255,255,255,0.3);
        }

        .toc-row-meta {
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 0.25em;
          color: rgba(255,255,255,0.2);
          transition: color 0.4s ease;
        }

        .toc-row:hover .toc-row-meta {
          color: var(--cyan-core);
        }

        .toc-disabled {
          cursor: not-allowed;
          opacity: 0.4;
          padding: 16px 8px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
      `}} />

      {/* ========================================================================= */}
      {/* 1. CINEMATIC LANDING (TITLE PAGE)                                         */}
      {/* ========================================================================= */}
      <section id="title-page" className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        
        {/* Full Bleed Moon Boy Background with Multi-stop Gradient Melting */}
        <motion.div style={{ opacity: backdropOpacity }} className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="/assets/bg.png" 
            alt="Moon Boy" 
            className="w-full h-full object-cover mix-blend-luminosity opacity-80" 
          />
          {/* Intense gradient map to merge the photo perfectly into Layer 1 void */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#020203]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-transparent to-transparent h-1/3 bottom-0" />
        </motion.div>

        {/* Title Elements */}
        {isMounted && (
          <div className="relative z-10 flex flex-col items-center w-full px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl cinematic-master-title"
            >
              The Weight<br />of the Sky
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, letterSpacing: "0.2em" }} 
              animate={{ opacity: 1, letterSpacing: "0.6em" }} 
              transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
              className="cinematic-subtitle mt-8"
            >
              An Archetypal Tale
            </motion.p>

            {/* Navigation Mesh */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1.2, duration: 1.2 }}
              className="glass-nav-mesh"
            >
              <button onClick={() => scrollToSection("dedication")} className="ethereal-btn">Dedication</button>
              <button onClick={() => scrollToSection("blurb")} className="ethereal-btn">Synopsis</button>
              <button onClick={() => scrollToSection("about")} className="ethereal-btn">Author</button>
              <button onClick={handleBeginReading} className="primary-action-btn">Begin Reading</button>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 2, duration: 2 }}
              className="absolute -bottom-[35vh] text-[8px] text-zinc-600 tracking-[0.5em] uppercase font-mono"
            >
              By Michael Alonza Prentice Ware
            </motion.p>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* TEXT CONTENT WRAPPER (Glassmorphism & Depth)                              */}
      {/* ========================================================================= */}
      <div className="content-glass-wrapper">
        <div className="max-w-2xl mx-auto px-6 space-y-48 pb-40 relative z-10">
          
          {/* 2. DEDICATION */}
          <section id="dedication" className="min-h-[40vh] flex flex-col items-center justify-center text-center scroll-mt-32">
            <p className="text-zinc-200 font-serif italic text-2xl md:text-3xl leading-relaxed tracking-wider drop-shadow-lg" style={{ animation: 'subtleFloat 6s ease-in-out infinite' }}>
              "James Lee Ware<br/>
              <span className="text-lg text-zinc-500 mt-8 block font-mono uppercase tracking-[0.2em] not-italic opacity-60">
                (In order to keep Curious)
              </span>"
            </p>
          </section>

          {/* 3. SYNOPSIS */}
          <section id="blurb" className="min-h-[50vh] flex flex-col justify-center scroll-mt-32">
            <div className="section-header-line">Synopsis</div>
            <div className="relative">
              {/* Subtle decorative quote line */}
              <div className="absolute -left-6 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-cyan-900/40 to-transparent" />
              <p className="prose-block">
                In Hebron in 1003 BCE, during the early days of King David's rule over Judah, sixteen-year-old Dan lives inside an oppressive home paralyzed by his father's hoarding grief. Dan is a dreamwalker, a visionary uniquely capable of consciously stepping into a hidden world constructed from minute cells of universal dust.
              </p>
              <p className="prose-block">
                When his deep interventions fracture his family, Dan is cast out, forced to embark on a punishing physical trek northward toward Mount Hermon to find the ultimate source of reality. His path demands a brutal expenditure of tissue and will, shattering his physical voice and bringing him face-to-face with an infinite cycle of conflict written in the stars.
              </p>
            </div>
          </section>

          {/* 4. ABOUT THE AUTHOR */}
          <section id="about" className="min-h-[40vh] flex flex-col justify-center scroll-mt-32">
            <div className="section-header-line">Operator Biography</div>
            <div className="relative">
              <div className="absolute -right-6 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-zinc-800/60 to-transparent" />
              <p className="prose-block">
                Michael Alonza Prentice Ware is a systems architecture specialist. He is pursuing a Bachelor of Science in Computer Science at Weber State University, focusing his development research on Machine Learning Alignment Governance and Explainable AI (XAI).
              </p>
              <p className="prose-block">
                Outside of layout engineering, he practices classical piano for three hours daily following the Russian method and Alexander technique principles.
              </p>
            </div>
          </section>

          {/* 5. TABLE OF CONTENTS */}
          <section id="toc" className="min-h-screen scroll-mt-32">
            <div className="section-header-line">Table of Contents</div>
            
            <div className="space-y-24 max-w-xl mx-auto">
              
              {/* PART I */}
              <div>
                <h3 className="text-cyan-400/80 font-mono tracking-[0.4em] text-[10px] uppercase mb-10 text-center">
                  Part I: The Journey
                </h3>
                <div className="toc-grid">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button key={num} onClick={() => handleLoadChapter(num)} className="toc-row">
                      <span className="toc-row-title">{TITLES[num]}</span>
                      <span className="toc-row-meta">CHAPTER {num}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PART II */}
              <div>
                <h3 className="text-cyan-400/80 font-mono tracking-[0.4em] text-[10px] uppercase mb-10 text-center">
                  Part II: The Deception & Reveal
                </h3>
                <div className="toc-grid">
                  {[10, 11].map(num => (
                    <button key={num} onClick={() => handleLoadChapter(num)} className="toc-row">
                      <span className="toc-row-title">{TITLES[num]}</span>
                      <span className="toc-row-meta">CHAPTER {num}</span>
                    </button>
                  ))}
                  <div className="toc-disabled">
                    <span className="font-serif text-zinc-500 italic">[Pending]</span>
                    <span className="font-mono text-[8px] tracking-[0.2em] text-zinc-700">CHAPTER 12</span>
                  </div>
                  <button onClick={() => handleLoadChapter(13)} className="toc-row">
                    <span className="toc-row-title">{TITLES[13]}</span>
                    <span className="toc-row-meta">CHAPTER 13</span>
                  </button>
                  <div className="toc-disabled">
                    <span className="font-serif text-zinc-500 italic">[Pending]</span>
                    <span className="font-mono text-[8px] tracking-[0.2em] text-zinc-700">CHAPTERS 14–17</span>
                  </div>
                </div>
              </div>

              {/* PART III & EPILOGUE */}
              <div>
                <h3 className="text-cyan-400/80 font-mono tracking-[0.4em] text-[10px] uppercase mb-10 text-center">
                  Part III: The Cosmic Union
                </h3>
                <div className="toc-disabled mb-16">
                  <span className="font-serif text-zinc-500 italic">[Pending]</span>
                  <span className="font-mono text-[8px] tracking-[0.2em] text-zinc-700">CHAPTERS 18–24</span>
                </div>
                
                <h3 className="text-zinc-600 font-mono tracking-[0.4em] text-[9px] uppercase mb-8 text-center">
                  Epilogue
                </h3>
                <div className="flex justify-center items-center opacity-50 py-4 border-b border-zinc-900/30">
                  <span className="text-zinc-500 font-serif italic tracking-wide">The Unresolved Question: Why</span>
                </div>
              </div>
            </div>
          </section>

          {/* 6. PROSE READING LOOP */}
          <section id="reading" className="min-h-screen scroll-mt-24">
            {chapter ? (
              <ManuscriptCore
                manuscriptRef={topCanvasRef}
                tocRef={topCanvasRef}
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
              <div className="flex flex-col items-center justify-center h-[50vh] opacity-60 select-none">
                <span className="font-mono text-[9px] text-zinc-600 tracking-[0.4em] uppercase mb-6" style={{ animation: 'etherealBreathe 4s infinite' }}>
                  Awaiting Initialization
                </span>
                <button onClick={handleBeginReading} className="ethereal-btn" style={{ color: '#fff' }}>
                  Begin The Journey
                </button>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
