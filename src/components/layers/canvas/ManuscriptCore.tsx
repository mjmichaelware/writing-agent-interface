"use client";

import React, { useEffect, useRef } from "react";
import { bus } from "@/core/runtimeEngine";
import TitleCover from "./front-matter/TitleCover";
import Dedication from "./front-matter/Dedication";
import Synopsis from "./front-matter/Synopsis";
import AboutAuthor from "./front-matter/AboutAuthor";
import TableOfContents from "./front-matter/TableOfContents";

const CHAPTER_TITLES: Record<number, string> = {
  1: "The Well at Bethlehem",
  2: "The Ash of Hebron",
  3: "The Iron and the High Places",
  4: "The Dreamscape Partition",
  5: "The Flight of the Rejected",
  6: "The Secret Council",
  7: "The Swarming Pit",
  8: "The Lord of Flies",
  9: "The Gate of Hermon",
  10: "The Deception",
  11: "The Reveal",
  13: "The Union",
};

export default function ManuscriptCore({
  blocks,
  chapterSlug,
}: {
  blocks: string[];
  chapterSlug: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleLoadChapter = (n: number) => {
    bus.emit("nav:velocity_scroll", { speed: 1 });
    // This will trigger a route change or data fetch in a real scenario
    console.log(`Loading chapter ${n}`);
  };

  useEffect(() => {
    let frameId: number;
    const root = containerRef.current;
    if (!root) return;

    const runKinematics = () => {
      const centerY = window.innerHeight / 2;
      const paras = root.querySelectorAll<HTMLElement>("p[data-para], section[id]");

      paras.forEach((p) => {
        const rect = p.getBoundingClientRect();
        const pCenter = rect.top + rect.height / 2;
        const dist = Math.abs(centerY - pCenter);
        const maxDist = window.innerHeight * 0.6;
        
        // Normalized distance 0 to 1
        const normDist = Math.min(1, dist / maxDist);
        
        // Apply spring-damped logic via CSS variables
        const blurValue = normDist * 8; // Max 8px blur
        const opacityValue = 1 - (normDist * 0.7); // Min 0.3 opacity
        const translateY = normDist * 10; // Subtle drift

        p.style.setProperty("--arc-blur", blurValue.toString());
        p.style.opacity = opacityValue.toString();
        p.style.filter = `blur(${blurValue}px)`;
        p.style.transform = `translateY(${translateY}px)`;
      });

      frameId = requestAnimationFrame(runKinematics);
    };

    frameId = requestAnimationFrame(runKinematics);

    return () => cancelAnimationFrame(frameId);
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
            const index = el.dataset.index || el.id || "0";
            bus.emit("scroll:focus", { paraIndex: index });
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
    
    // Observe front-matter sections
    root.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    // Observe paragraphs
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

    const unsubscribe = bus.on("engine:semantic_parse", handleSemanticParse);

    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [chapterSlug]);

  return (
    <div
      ref={containerRef}
      className="w-full mx-auto pb-[50vh] px-6 md:px-0"
    >
      <TitleCover />
      <Dedication />
      <Synopsis />
      <AboutAuthor />
      <TableOfContents TITLES={CHAPTER_TITLES} onLoadChapter={handleLoadChapter} />

      <div className="max-w-2xl mx-auto pt-32">
        <h2 className="section-label text-center mb-32">Chapter {chapterSlug}</h2>
        {blocks.map((text, idx) => (
          <p
            key={idx}
            data-para
            data-index={idx}
            data-state="inactive"
            className="prose-paragraph kinetic-word"
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}
