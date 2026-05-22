"use client";
import React, { useEffect, useRef } from "react";
import { bus } from "@/core/runtimeEngine";

export default function Layer3Canvas({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<number>(0);

  useEffect(() => {
    const handleScrollBegin = (data: { target: string }) => {
      const targetEl = document.getElementById(data.target);
      if (!targetEl) return;

      const targetY = targetEl.offsetTop;
      const startY = window.scrollY;
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

    const unsubscribe = bus.on('scroll:begin', handleScrollBegin);
    return () => {
      unsubscribe();
      cancelAnimationFrame(scrollRef.current);
    };
  }, []);

  return (
    <div className="relative z-20 w-full min-h-screen">
      {children}
    </div>
  );
}
