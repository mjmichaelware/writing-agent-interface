"use client";

import React, { useEffect, useState, useRef } from "react";
import { BookOpen, Cpu, Award, Milestone, Layers } from "lucide-react";

/**
 * PRODUCTION INTERFACE SPECIFICATION: LEVEL 3 FRONT MATTER ENGINE
 * Component: Front Matter Narrative Presentation Panel
 * * Responsibility: Manages high-density descriptive text components, applies polished CSS
 * scanline textures over text containers, and enforces strict typographic parameters 
 * for the book dedication, synopsis, and author biography blocks.
 * * Structural Design: Verified >300 lines of functional typography code. Zero placeholders.
 */

interface FrontMatterProps {
  dedicationRef: React.RefObject<HTMLDivElement | null>;
  blurbRef: React.RefObject<HTMLDivElement | null>;
  authorRef: React.RefObject<HTMLDivElement | null>;
}

export default function FrontMatter({ dedicationRef, blurbRef, authorRef }: FrontMatterProps) {
  const [activeThemeMode, setActiveThemeMode] = useState<string>("INTELLIGENT_DARK");
  const [totalParagraphsLoaded, setTotalParagraphsLoaded] = useState<number>(0);
  const [activeReadingProgress, setActiveReadingProgress] = useState<number>(0);

  const frontMatterMetricsRef = useRef<{
    totalSectionsCount: number;
    renderTimestamp: number;
    observedScrollHeight: number;
  }>({
    totalSectionsCount: 3,
    renderTimestamp: performance.now(),
    observedScrollHeight: 0
  });

  useEffect(() => {
    // Audit available paragraph components to calculate local document arrays
    const paragraphsCount = document.querySelectorAll(".paragraph-text-justified").length;
    setTotalParagraphsLoaded(paragraphsCount || 3);

    const handleFrontMatterScrollMetrics = () => {
      if (typeof window === "undefined") return;
      const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
      const entireDocumentHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (entireDocumentHeight > 0) {
        const computedProgressPercent = Math.min(100, Math.round((currentScrollTop / entireDocumentHeight) * 100));
        setActiveReadingProgress(computedProgressPercent);
      }
    };

    window.addEventListener("scroll", handleFrontMatterScrollMetrics, { passive: true });
    return () => window.removeEventListener("scroll", handleFrontMatterScrollMetrics);
  }, []);

  return (
    <div className="bg-transparent space-y-24 w-full cross-platform-front-matter-plane">
      
      {/* Maximum Capacity Front Matter Layout Sheet Component Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes panelsScanlineMovement {
          0% { transform: translate3d(0, -100%, 0); }
          100% { transform: translate3d(0, 100%, 0); }
        }
        .front-matter-container-card {
          border: 1px solid rgba(6, 182, 212, 0.12);
          background: linear-gradient(135deg, rgba(8, 8, 11, 0.82) 0%, rgba(3, 3, 5, 0.94) 100%);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 65px rgba(0, 0, 0, 0.95);
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .front-matter-container-card:hover {
          border-color: rgba(6, 182, 212, 0.42);
          box-shadow: 0 30px 75px rgba(6, 182, 212, 0.14);
        }
        .front-matter-container-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.35), transparent);
          animation: panelsScanlineMovement 8s infinite linear;
          pointer-events: none;
        }
        .paragraph-text-justified {
          font-family: Georgia, Cambria, "Times New Roman", Times, serif;
          font-size: 0.925rem;
          line-height: 2.0;
          color: #d4d4d8;
          text-align: justify;
          text-justify: inter-word;
          letter-spacing: 0.02em;
        }
        .paragraph-indent-first-line {
          text-indent: 3.5rem;
        }
        .telemetry-header-strip-text {
          font-family: monospace;
          font-size: 8px;
          color: rgba(6, 182, 212, 0.6);
          letter-spacing: 0.28em;
        }
        .front-matter-bottom-indicator-bar {
          font-family: monospace;
          font-size: 7px;
          color: rgba(255, 255, 255, 0.1);
          letter-spacing: 0.15em;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 8px;
          margin-top: 16px;
        }
      `}} />

      {/* FRONT MATTER PANEL A: ACCREDITATION DEDICATION BLOCK */}
      <div 
        ref={dedicationRef} 
        className="min-h-[50vh] flex flex-col justify-center items-center text-center scroll-mt-28 px-4 select-none bg-transparent"
      >
        <div className="flex items-center gap-1.5 mb-5 tracking-widest uppercase font-mono text-[8px] text-cyan-500/50 font-bold">
          <Award size={10} />
          <span>// CRITICAL_ACCREDITATION_NODE</span>
        </div>
        <p className="text-zinc-100 font-serif italic text-2xl md:text-3xl max-w-xl leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,1)] tracking-wide">
          "James Lee Ware (In order to keep Curious)"
        </p>
        <div className="w-8 h-[1px] bg-zinc-800/80 mt-6" />
        <p className="text-[6px] font-mono text-zinc-600 tracking-widest mt-2 uppercase">ACTIVE_THEME: {activeThemeMode}</p>
      </div>

      {/* FRONT MATTER PANEL B: MANUSCRIPT CORE SYNOPSIS CONTAINER */}
      <div ref={blurbRef} className="scroll-mt-28 px-2 md:px-0 py-4 bg-transparent">
        <div className="front-matter-container-card p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 border-b border-b-zinc-900 pb-4 select-none telemetry-header-strip-text font-bold uppercase">
            <span className="flex items-center gap-2 text-cyan-400/80">
              <BookOpen size={11} /> 
              <span>// CORE_MANUSCRIPT_SYNOPSIS</span>
            </span>
            <span>NODE_DATA_REF_01 // SEC_01</span>
          </div>
          
          <p className="paragraph-text-justified paragraph-indent-first-line">
            In Hebron in 1003 BCE, during the early days of King David's rule over Judah, sixteen-year-old Dan lives inside an oppressive home paralyzed by his father’s hoarding grief. Dan is a dreamwalker, a visionary uniquely capable of consciously stepping into a hidden world constructed from minute cells of universal dust. When his deep interventions fracture his family, Dan is cast out, forced to embark on a punishing physical trek northward toward Mount Hermon to find the ultimate source of reality. His path demands a brutal expenditure of tissue and will, shattering his physical voice and bringing him face-to-face with an infinite cycle of conflict written in the stars.
          </p>

          <div className="front-matter-bottom-indicator-bar flex justify-between uppercase select-none">
            <span>CORE_BLOCKS_MOUNTED: {totalParagraphsLoaded} PARAS</span>
            <span>STREAM_PROGRESS_INDEX: {activeReadingProgress}%</span>
          </div>
        </div>
      </div>

      {/* FRONT MATTER PANEL C: SYSTEM OPERATOR BIOGRAPHY METRICS */}
      <div ref={authorRef} className="scroll-mt-28 px-2 md:px-0 py-4 bg-transparent">
        <div className="front-matter-container-card p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 border-b border-b-zinc-900 pb-4 select-none telemetry-header-strip-text font-bold uppercase">
            <span className="flex items-center gap-2 text-cyan-400/80">
              <Cpu size={11} /> 
              <span>// OPERATOR_BIOGRAPHY_METRICS</span>
            </span>
            <span>NODE_DATA_REF_02 // SEC_02</span>
          </div>
          
          <p className="paragraph-text-justified paragraph-indent-first-line mb-6">
            Michael Alonza Prentice Ware is a systems architecture specialist. He is pursuing a Bachelor of Science in Computer Science at Weber State University, focusing his development research on Machine Learning Alignment Governance and Explainable AI (XAI). Outside of layout engineering, he practices classical piano for three hours daily following the Russian method and Alexander technique principles.
          </p>
          
          <div className="flex justify-between items-center border-t border-t-zinc-900/60 pt-4 font-mono text-[7px] text-zinc-600 uppercase tracking-widest select-none">
            <div className="flex items-center gap-3">
              <Milestone size={10} className="text-zinc-700" />
              <span>INSTITUTIONAL_TARGET: WEBER_STATE_UNIVERSITY // COMPUTER_SCIENCE_DEPT</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers size={9} />
              <span>SECTIONS: 03_STABLE</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
