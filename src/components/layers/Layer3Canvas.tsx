"use client";
import React, { useEffect, useRef } from "react";
import { bus } from "@/core/runtimeEngine";

export default function Layer3Canvas({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<number>(0);

  // 16. Arrow-key navigation between front matter sections
  useEffect(() => {
    const SECTIONS = ["title-page", "dedication", "synopsis", "about", "toc", "chapter-content"];

    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();

      const currentIdx = SECTIONS.findIndex(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 80 && rect.bottom > 80;
      });

      const next = e.key === "ArrowDown"
        ? Math.min(currentIdx + 1, SECTIONS.length - 1)
        : Math.max(currentIdx - 1, 0);

      if (next !== currentIdx) {
        const el = document.getElementById(SECTIONS[next]);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const handleScrollBegin = (data: { target: string }) => {
      const targetEl = document.getElementById(data.target);
      if (!targetEl) return;

      const rect = targetEl.getBoundingClientRect();
      const startY = window.scrollY;
      const targetY = rect.top + startY;
      const distance = targetY - startY;
      const duration = 1200;
      let start: number | null = null;

      // Brain: requestAnimationFrame smooth velocity scroll
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const t = Math.min(progress / duration, 1);
        
        // Easing: cubic-bezier(0.22, 1, 0.36, 1)
        const ease = 1 - Math.pow(1 - t, 3); 
        
        window.scrollTo(0, startY + distance * ease);

        if (progress < duration) {
          scrollRef.current = requestAnimationFrame(step);
        }
      };

      scrollRef.current = requestAnimationFrame(step);
    };

    const unsubScrollBegin = bus.on('scroll:begin', handleScrollBegin);
    
    return () => {
      unsubScrollBegin();
      cancelAnimationFrame(scrollRef.current);
    };
  }, []);

  return (
    <div className="layer3-canvas relative z-20 w-full min-h-screen">
      {children}
    </div>
  );
}
