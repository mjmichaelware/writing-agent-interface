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

  const handleLoadChapter = (n: number) => {
    bus.emit("scroll:begin", { target: "title" });
    if (onLoadChapter) onLoadChapter(n);
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
        
        const normDist = Math.min(1, dist / maxDist);
        const blurValue = normDist * 8; 
        const opacityValue = 1 - (normDist * 0.7); 
        const translateY = normDist * 10; 

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
            const index = el.dataset.index || "0";
            const block = blocks[parseInt(index)];
            
            // Feature 200: Semantic Focus Payload
            const payload = {
              paraIndex: index,
              content: typeof block === "string" ? block : block.content,
              weights: typeof block === "string" ? {} : block.archetypal_weights,
              dualisms: typeof block === "string" ? {} : block.dualism_map,
              partNumber
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
        const target = root.querySelector(`[data-id="${data.id}"], [id="${data.id}"]`) as HTMLElement;
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
      ref={containerRef}
      className="w-full mx-auto pb-[50vh] px-6 md:px-0"
    >
      <TitleCover />
      <Dedication />
      <Synopsis />
      <div id="author"><AboutAuthor /></div>
      <TableOfContents TITLES={CHAPTER_TITLES} onLoadChapter={handleLoadChapter} />

      <div className="max-w-2xl mx-auto pt-32">
        <h2 className="section-label text-center mb-32">Chapter {chapterSlug}</h2>
        {blocks.map((block, idx) => {
          const text = typeof block === "string" ? block : block.content;
          const id = typeof block === "string" ? `para-${idx}` : block.id;

          return (
            <p
              key={id}
              data-para
              data-index={idx}
              data-id={id}
              id={id}
              data-state="inactive"
              className="prose-paragraph kinetic-word"
            >
              {text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
