"use client";

import React, { useEffect, useRef } from "react";
import { bus } from "@/core/runtimeEngine";

export default function ManuscriptCore({
  blocks,
  chapterSlug,
}: {
  blocks: string[];
  chapterSlug: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

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
            bus.emit("scroll:focus", { paraIndex: index });
          }
        }
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    observerRef.current = observer;
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
      className="w-full max-w-2xl mx-auto pb-[50vh] pt-[30vh] px-6 md:px-0"
    >
      {blocks.map((text, idx) => (
        <p
          key={idx}
          data-para
          data-index={idx}
          data-state="inactive"
          className="manuscript-paragraph-segment mb-10 text-justify font-serif text-lg md:text-xl text-[var(--text-primary,#e8e4dc)] tracking-wide leading-[var(--leading-prose,1.7)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform opacity-40 data-[state=active]:opacity-100 data-[state=active]:translate-y-0 data-[state=inactive]:translate-y-[4px] data-[state=inactive]:blur-[1px]"
        >
          {text}
        </p>
      ))}
    </div>
  );
}
