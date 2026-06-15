"use client";

import React, { useEffect, useRef } from "react";
import { bus } from "@/core/runtimeEngine";
import TitleCover from "./front-matter/TitleCover";
import Dedication from "./front-matter/Dedication";
import Synopsis from "./front-matter/Synopsis";
import AboutAuthor from "./front-matter/AboutAuthor";
import TableOfContents from "./front-matter/TableOfContents";

const CHAPTER_TITLES: Record<number, string> = {
  1: "Stardust to Stardust",
  2: "Living Sacrifice",
  3: "Lift Up",
  4: "Pilgrimage",
  5: "The Snare",
  6: "Beelzebub Beelzebub",
  7: "The Pit",
  8: "Sea People",
  9: "The Ascent",
  10: "Forsaken",
  11: "Forsaken (II)",
  12: "[pending: XII]",
  13: "Exodus",
  24: "Second to Last",
};

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
    hebrew_spans?: any[];
  })[];
  chapterSlug: string;
  partNumber?: string;
  onLoadChapter?: (n: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleLoadChapter = (n: number) => {
    if (onLoadChapter) onLoadChapter(n);
    setTimeout(() => {
        const target = document.getElementById("chapter-content");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        bus.emit("scroll:begin", { target: "chapter-content" });
    }, 100);
  };

  useEffect(() => {
    let frameId: number;
    const root = containerRef.current;
    if (!root) return;

    let paras = root.querySelectorAll<HTMLElement>("p[data-para]");

    const mutationObserver = new MutationObserver(() => {
      paras = root.querySelectorAll<HTMLElement>("p[data-para]");
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    const runKinematics = () => {
      const centerY = window.innerHeight / 2;
      const rootStyle = document.documentElement.style;

      // Read user-defined modulator variables
      const userFontScale = parseFloat(rootStyle.getPropertyValue('--user-font-scale')) || 1;
      const userLineHeight = parseFloat(rootStyle.getPropertyValue('--user-line-height')) || 1.7;
      const userSensitivity = parseFloat(rootStyle.getPropertyValue('--user-sensitivity')) || 0.5;
      const userColorShift = parseFloat(rootStyle.getPropertyValue('--user-color-shift')) || 0.25; // Not directly used in current kinematic, but available
      const userDistortion = parseFloat(rootStyle.getPropertyValue('--user-distortion')) || 0.15;
      const userBlur = parseFloat(rootStyle.getPropertyValue('--user-blur')) || 0.15;
      const userContrast = parseFloat(rootStyle.getPropertyValue('--user-contrast')) || 1; // Not directly used in current kinematic, but available
      const userWarmth = parseFloat(rootStyle.getPropertyValue('--user-warmth')) || 0.25; // Not directly used in current kinematic, but available

      paras.forEach((p) => {
        const rect = p.getBoundingClientRect();
        const pCenter = rect.top + rect.height / 2;
        const dist = Math.abs(centerY - pCenter);
        // User sensitivity can adjust maxDist, making focus area larger/smaller
        const maxDist = window.innerHeight * 0.5 * (1 + (1 - userSensitivity * 0.5)); // Slightly smaller maxDist, less sensitivity impact
        
        const normDist = Math.min(1, dist / maxDist);
        
        // Apply user modulators to blur and opacity
        const blurValue = normDist * 5 * userBlur; // Increased blur multiplier
        const opacityValue = 1 - (normDist * 1.0 * (1 - userSensitivity)); // Increased opacity change multiplier

        // Set line-height and font-size directly on paragraph, modulated by user settings
        p.style.setProperty("font-size", `calc(var(--font-size-prose) * ${userFontScale})`);
        p.style.setProperty("line-height", `calc(var(--leading-prose) * ${userLineHeight})`);

        // Feature 11-14: Kinetic Distortions driven by weights
        const index = parseInt(p.dataset.index || "0");
        const block = blocks[index];
        if (typeof block !== 'string') {
          const weights = block?.archetypal_weights || {};
          const dualisms = block?.dualism_map || {};
          
          // Apply user modulators to semantic mass, tension, drift
          const mass = ((weights.shadow || 0) * 2.5 + (dualisms.descent || 0) * 3) * (1 + userDistortion * 1.5); // Increased multipliers
          const tension = ((weights.persona || 0) * 2.0) * (1 + userSensitivity * 1.5); // Increased multipliers
          const drift = ((weights.anima || 0) * 5) * (1 + userDistortion * 1.5); // Increased multipliers
          
          p.style.setProperty("--arc-mass", (mass * normDist).toString());
          p.style.setProperty("--arc-tension", (tension * normDist).toString());
          p.style.setProperty("--arc-drift", (drift * normDist).toString());
        }

        p.style.setProperty("--arc-blur", blurValue.toString());
        p.style.opacity = opacityValue.toString();
        
        // Only apply heavy filters when inactive to save performance
        if (p.dataset.state === "inactive") {
            p.style.filter = `blur(${blurValue}px)`;
            // Apply user distortion to transform
            p.style.transform = `translateY(${normDist * 20 * userDistortion}px)`; // Increased translateY
        } else {
            p.style.filter = "none";
            p.style.transform = "none";
        }
      });

      frameId = requestAnimationFrame(runKinematics);
    };

    frameId = requestAnimationFrame(runKinematics);
    return () => {
      cancelAnimationFrame(frameId);
      mutationObserver.disconnect();
    };
  }, [blocks]);

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
            const sectionId = el.id;
            const index = el.dataset.index;
            
            if (index !== undefined) {
              const block = blocks[parseInt(index)];
              const payload = {
                paraIndex: index,
                content: typeof block === "string" ? block : block?.content || "",
                weights: typeof block === "string" ? {} : block?.archetypal_weights || {},
                dualisms: typeof block === "string" ? {} : block?.dualism_map || {},
                partNumber,
                chapterSlug
              };
              bus.emit("scroll:focus", payload);
            } else if (sectionId) {
              bus.emit("scroll:focus", {
                sectionId,
                chapterSlug: "0",
                content: sectionId
              });
            }
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

    const handleNavigate = (data: { id: string }) => {
        if (!data?.id) return;
        const target = document.querySelector(`[data-paragraph-id="${data.id}"]`);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
            target.classList.add("paragraph-flash");
            setTimeout(() => target.classList.remove("paragraph-flash"), 1200);
        }
    };

    const unsubscribeNav = bus.on("navigate:paragraph", handleNavigate);

    return () => {
      observer.disconnect();
      unsubscribeNav();
    };
  }, [chapterSlug, blocks, partNumber]);

  // Helper to wrap terms with specific styling based on provided spans
  const renderText = (text: string, hebrewSpans?: any[]) => { // hebrewSpans could be strings or objects
    if (!hebrewSpans || hebrewSpans.length === 0) {
      return text;
    }

    let result: React.ReactNode[] = [text];
    
    hebrewSpans.forEach(span => {
      const term = typeof span === 'string' ? span : span.term; // Assuming span could be string or { term: string, ... }
      if (!term) return; // Skip if term is not defined

      const newResult: React.ReactNode[] = [];
      result.forEach(node => {
        if (typeof node === 'string') {
          const parts = node.split(new RegExp(`(${term})`, 'g'));
          parts.forEach((part, i) => {
            if (part === term) {
              newResult.push(<span key={`${term}-${i}`} className="font-hebrew">{part}</span>);
            } else if (part) {
              newResult.push(part);
            }
          });
        } else {
          newResult.push(node);
        }
      });
      result = newResult;
    });
    
    return result;
  };

  return (
    <div ref={containerRef} className="reader-column pb-[50vh]">
      <TitleCover />
      <Dedication />
      <Synopsis />
      <div id="author"><AboutAuthor /></div>
      <TableOfContents TITLES={CHAPTER_TITLES} onLoadChapter={handleLoadChapter} />

      <div className="reader-column pt-32">
        <h2 id="chapter-content" className="section-label text-center mb-32">Chapter {chapterSlug}</h2>
        {blocks.length === 0 ? (
          <p className="prose-paragraph text-center text-[#8a857c] italic">
            Select a chapter from the matrix above to begin.
          </p>
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
                {renderText(text, typeof block === "string" ? undefined : block.hebrew_spans)}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
}
