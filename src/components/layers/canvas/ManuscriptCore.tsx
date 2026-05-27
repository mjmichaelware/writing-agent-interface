/* ==================== FILE: src/components/layers/canvas/ManuscriptCore.tsx ==================== */

"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Clock, Layers, Hash } from "lucide-react";

const HEBREW_NAMES = /\b(Hebron|Hermon|Mamre|Beelzebub|Megiddo|Sak)\b/g;

function renderWithHebrewSpans(text: string): React.ReactNode[] {
  const matchSource = new RegExp(HEBREW_NAMES.source, 'g');
  const parts = text.split(HEBREW_NAMES);
  return parts.map((part, i) => {
    matchSource.lastIndex = 0;
    return matchSource.test(part)
      ? <span key={i} className="font-hebrew" lang="he">{part}</span>
      : part;
  });
}


export default function ManuscriptCore({
  blocks,
  chapterSlug,
  partNumber = "I",
  onLoadChapter
}: {
  blocks: (string | { 
    id: string; 
    content: string; 
    archetypal_weights?: any; 
    dualism_map?: any;
  })[];
  chapterSlug: string;
  partNumber?: string;
  onLoadChapter?: (n: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastFrameRef = useRef<number>(0);

  const manuscriptInternalMetricsRef = useRef<{
    totalScrollEventsPolled: number;
    lastLayoutCheckTime: number;
    cacheViewportWidth: number;
  }>({
    totalScrollEventsPolled: 0,
    lastLayoutCheckTime: performance.now(),
    cacheViewportWidth: typeof window !== "undefined" ? window.innerWidth : 1080
  });

  /**
   * CALCULATE MANUSCRIPT METRICS PIPELINE
   * Parses active string blocks to extract statistical tokens cleanly.
   */
  useEffect(() => {
    if (paragraphs.length === 0) return;

    let cumulativeWordsCount = 0;
    for (let i = 0; i < paragraphs.length; i++) {
      const pureWordsArray = paragraphs[i].split(/\s+/).filter(token => token.length > 0);
      cumulativeWordsCount += pureWordsArray.length;
    }

    setActiveWordCount(cumulativeWordsCount);
    // Standard baseline computer science calculation matching human narrative reading speeds (~200 WPM)
    const computedMinutes = Math.ceil(cumulativeWordsCount / 200);
    setEstimatedReadingTime(computedMinutes);
  }, [paragraphs]);

  /**
   * CHAPTER OVERRIDE SEQUENCE BOUNDS
   * Routes structural step requests safely across boundary constraints.
   */
  const handleTimelineStepAdjustment = useCallback((directionDelta: "PREV" | "NEXT") => {
    const totalChaptersCount = CHAPTER_NUMS.length;
    if (totalChaptersCount === 0) return;

    const currentActiveIndex = CHAPTER_NUMS.indexOf(chapter);
    if (currentActiveIndex === -1) return;

    let targetChapterIndex = currentActiveIndex;

    if (directionDelta === "PREV" && currentActiveIndex > 0) {
      targetChapterIndex = currentActiveIndex - 1;
    } else if (directionDelta === "NEXT" && currentActiveIndex < totalChaptersCount - 1) {
      targetChapterIndex = currentActiveIndex + 1;
    }

    const nextChapterTargetNum = CHAPTER_NUMS[targetChapterIndex];
    if (nextChapterTargetNum !== chapter) {
      setChapter(nextChapterTargetNum);
      setTimelineIndicatorLabel(`NAV_CHANGED_TO_CH_${nextChapterTargetNum}`);
      
      // Auto-align viewport view frame straight back to text start line positions
      if (manuscriptRef.current) {
        manuscriptRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [chapter, CHAPTER_NUMS, setChapter, manuscriptRef]);

  /**
   * INLINE CHARACTER REGEX FORMATTING PARSER
   * Custom typography color-burn transformations identifying sacred and descent terms.
   */
  const executeAdvancedTypographyTokenization = (rawTextString: string) => {
    // Escape matching loops instantly if text lacks target tokens
    if (!rawTextString) return "";

    const termsSacredRegex = /\b(Mount Hermon|Hebron|Judah|God|Lord|stars|stars|dreams|visionary)\b/g;
    const termsDescentRegex = /\b(trauma|pit|grief|hoarding|punishing|brutal|shattered|oppressive)\b/g;

    let formattedBuffer = rawTextString;

    formattedBuffer = formattedBuffer.replace(termsSacredRegex, (matchedToken) => {
      return `<span style="color: ${state.sacredColor}; font-weight: 700; transition: color 0.3s ease;">${matchedToken}</span>`;
    });

    formattedBuffer = formattedBuffer.replace(termsDescentRegex, (matchedToken) => {
      return `<span style="color: ${state.descentColor}; font-weight: 600; font-style: italic; transition: color 0.3s ease;">${matchedToken}</span>`;
    });

    return formattedBuffer;
  };

  useEffect(() => {
    let frameId: number;
    const root = containerRef.current;
    if (!root) return;

    let paras = root.querySelectorAll<HTMLElement>("p[data-para]");

    // MutationObserver to update cached paras when content changes
    const mutationObserver = new MutationObserver(() => {
      paras = root.querySelectorAll<HTMLElement>("p[data-para]");
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    const runKinematics = () => {
      const now = performance.now();
      const delta = now - lastFrameRef.current;
      if (delta < 8.33) {
        frameId = requestAnimationFrame(runKinematics);
        return;
      }
      lastFrameRef.current = now;
      const centerY = window.innerHeight / 2;

      paras.forEach((p) => {
        const rect = p.getBoundingClientRect();
        const pCenter = rect.top + rect.height / 2;
        const dist = Math.abs(centerY - pCenter);
        const maxDist = window.innerHeight * 0.6;
        
        const normDist = Math.min(1, dist / maxDist);
        const blurValue = normDist * 3; // Reduced from 8 to 3 for less aggressive blur
        const opacityValue = 1 - (normDist * 0.5); // Increased min opacity (max reduction is 0.5 instead of 0.7)
        const translateY = normDist * 5; // Reduced transform from 10 to 5

        p.style.setProperty("--arc-blur", blurValue.toString());
        p.style.opacity = opacityValue.toString();
        p.style.filter = `blur(${blurValue}px)`;
        p.style.transform = `translateY(${translateY}px)`;
      });

      frameId = requestAnimationFrame(runKinematics);
    };

    frameId = requestAnimationFrame(runKinematics);
    return () => {
      cancelAnimationFrame(frameId);
      mutationObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          el.dataset.state = entry.isIntersecting ? "active" : "inactive";

          if (entry.isIntersecting) {
            const index = el.dataset.index || "0";
            const block = blocks[parseInt(index)];
            
            // Feature 200: Semantic Focus Payload
            const payload = {
              paraIndex: index,
              content: typeof block === "string" ? block : block.content,
              weights: typeof block === "string" ? {} : block.archetypal_weights,
              dualisms: typeof block === "string" ? {} : block.dualism_map,
              partNumber,
              chapterSlug
            };
            
            bus.emit("scroll:focus", payload);
          }
        }
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    observerRef.current = observer;
    root.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    root.querySelectorAll("p[data-para]").forEach((p) => observer.observe(p));

    const handleSemanticParse = (data: { dualism: number; archetype: number }) => {
      const spans = root.querySelectorAll<HTMLElement>("[data-resonance]");
      spans.forEach((span) => {
        const weight = Number.parseFloat(span.dataset.weight || "0");
        if (weight > data.dualism / 100) {
          span.classList.add("animate-kinetic-fall");
        } else {
          span.classList.remove("animate-kinetic-fall");
        }
      });
    };

    const handleNavigate = (data: { id: string }) => {
        if (!data?.id) return;
        const target = document.querySelector(`[data-paragraph-id="${data.id}"]`) 
                || document.querySelector(`[data-para-id="${data.id}"]`);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
            target.classList.add("paragraph-flash");
            setTimeout(() => target.classList.remove("paragraph-flash"), 1200);
        }
    };

    const unsubscribeSemantic = bus.on("engine:semantic_parse", handleSemanticParse);
    const unsubscribeNav = bus.on("navigate:paragraph", handleNavigate);

    return () => {
      observer.disconnect();
      unsubscribeSemantic();
      unsubscribeNav();
    };
  }, [chapterSlug, blocks, partNumber]);

  return (
    <div 
      ref={manuscriptRef} 
      className="scroll-mt-28 w-full px-2 md:px-0 py-6 bg-transparent relative z-20 font-serif"
    >
      <TitleCover />
      <Dedication />
      <Synopsis />
      <div id="author"><AboutAuthor /></div>
      <TableOfContents onLoadChapter={handleLoadChapter} />

      <div className="reader-column pt-32">
        <h2 id="chapter-content" className="section-label text-center mb-32">Chapter {chapterSlug}</h2>
        {blocks.length === 0 ? (
          <div className="skeleton-container">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-para" style={{ width: `${75 + (i % 3) * 8}%` }} />
            ))}
          </div>
        ) : (
          blocks.map((block, idx) => {
            const text = typeof block === "string" ? block : block.content;
            const id = typeof block === "string" ? `para-${idx}` : block.id;

            return (
              <p
                key={id}
                data-para
                data-index={idx}
                data-paragraph-id={id}
                id={id}
                data-state="inactive"
                className="prose-paragraph kinetic-word"
              >
                {renderWithHebrewSpans(text)}
              </p>
            );
          })
        )}
      </div>

      {/* PRIMARY STREAM DATA OVERLAYS CONTAINER */}
      {loading ? (
        <div className="w-full space-y-4 py-8 select-none">
          <div className="manuscript-loading-shimmer-row w-full" />
          <div className="manuscript-loading-shimmer-row w-[95%]" />
          <div className="manuscript-loading-shimmer-row w-[92%]" />
          <div className="manuscript-loading-shimmer-row w-[96%]" />
          <div className="manuscript-loading-shimmer-row w-[88%]" />
        </div>
      ) : error ? (
        <div className="w-full text-center py-12 font-mono text-xs text-red-400/80 tracking-wider select-none">
          <p>NOS_MANUSCRIPT_CORE_ERROR: TEXT_STREAM_DISCONNECT_FAULT</p>
          <p className="text-[9px] text-zinc-600 mt-2 uppercase">Reason Matrix: {error}</p>
        </div>
      ) : (
        <div className="manuscript-text-block-layout">
          {/* Active Chapter Label Presentation Block */}
          <div className="mb-10 select-none text-center md:text-left">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-400/60 font-bold">
              CHAPTER_NODE_0{chapter}
            </h2>
            <h3 className="text-zinc-100 uppercase tracking-[0.25em] text-lg font-black mt-2 leading-snug">
              {TITLES[chapter] || "UNNAMED_MILESTONE_SECTOR"}
            </h3>
            <div className="w-12 h-[1px] bg-cyan-900/50 mt-4 mx-auto md:mx-0" />
          </div>

          {/* Dynamic Tokenized Prose Target Mounting Map */}
          <div className="prose-content-field-view font-serif">
            {paragraphs.map((paraText, paraIdx) => (
              <p
                key={paraIdx}
                data-para={paraIdx}
                onMouseEnter={() => setLocalInteractiveNodeFocus(paraIdx)}
                onMouseLeave={() => setLocalInteractiveNodeFocus(null)}
                className={`manuscript-paragraph-segment scroll-fade-paragraph transition-opacity duration-300 ${localInteractiveNodeFocus !== null && localInteractiveNodeFocus !== paraIdx ? "opacity-35" : "opacity-100"}`}
                dangerouslySetInnerHTML={{
                  __html: executeAdvancedTypographyTokenization(paraText),
                }}
              />
            ))}
          </div>

          {/* LINEAR TIMELINE CONTROLLERS NAV BAR PANEL */}
          <div className="w-full grid grid-cols-2 gap-3 pt-12 border-t border-zinc-900 mt-12 select-none">
            <button
              onClick={() => handleTimelineStepAdjustment("PREV")}
              disabled={CHAPTER_NUMS.indexOf(chapter) === 0}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xs interactive-chapter-jump-btn"
            >
              <ChevronLeft size={12} />
              <span>PREV_NODE_DECREMENT</span>
            </button>
            <button
              onClick={() => handleTimelineStepAdjustment("NEXT")}
              disabled={CHAPTER_NUMS.indexOf(chapter) === CHAPTER_NUMS.length - 1}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xs interactive-chapter-jump-btn"
            >
              <span>NEXT_NODE_INCREMENT</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Hidden sub-level metadata index block ensuring layout stability logs remain clear */}
      <div className="hidden sr-only" data-layer-depth={depth} data-timeline-label={timelineIndicatorLabel} data-polled-scrolls={manuscriptInternalMetricsRef.current.totalScrollEventsPolled} />
    </div>
  );
}


