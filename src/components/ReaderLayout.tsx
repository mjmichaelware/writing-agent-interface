"use client";

import React, { useEffect, useRef } from "react";
import { bus } from "@/core/runtimeEngine";

/**
 * READER LAYOUT: THE HARDWARE VIEWPORT
 * * Manages the root 3D perspective context for the 4-layer UI.
 * * Reacts to panel events by rotating the entire manuscript canvas.
 */
export default function ReaderLayout({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onToggle = (state: { isOpen: boolean }) => {
      const el = wrapperRef.current;
      if (!el) return;
      if (state.isOpen) {
        // Feature 160: 3D Perspective Shift
        el.style.transform = "rotateY(-12deg) translateZ(-100px) translateX(4%)";
        el.style.filter = "blur(3px) brightness(0.5)";
        el.style.pointerEvents = "none";
      } else {
        el.style.transform = "rotateY(0deg) translateZ(0px) translateX(0%)";
        el.style.filter = "blur(0px) brightness(1)";
        el.style.pointerEvents = "auto";
      }
    };

    const unsubPanelOpen = bus.on("panel:open", () => onToggle({ isOpen: true }));
    const unsubPanelClose = bus.on("panel:close", () => onToggle({ isOpen: false }));

    return () => {
      unsubPanelOpen();
      unsubPanelClose();
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-[#e8e4dc] antialiased">
      <div 
        ref={wrapperRef} 
        className="w-full h-full"
      >
        {children}
      </div>
    </div>
  );
}