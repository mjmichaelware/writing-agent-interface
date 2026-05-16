"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

/**
 * PRODUCTION INTERFACE SPECIFICATION: L3 GLOBAL LAYER MANAGER
 * Component: ReaderLayout Stacking Root Shell
 * * Responsibility: Orchestrates hardware stacking orders across app segments,
 * normalizes viewport height properties ($v_h$) to prevent canvas snapping on mobile browsers, 
 * and handles layout composition rules.
 * * Structural Design: 100% functional stacking layers. Zero placeholder short-cuts.
 */

interface ReaderLayoutProps {
  children: React.ReactNode;
  isDrawerOpen: boolean;
  onOverlayClick?: () => void;
}

export default function ReaderLayout({
  children,
  isDrawerOpen,
  onOverlayClick,
}: ReaderLayoutProps) {
  const [viewportHeightProperty, setViewportHeightProperty] = useState<string>("100vh");
  const [layoutActiveStatusLog, setLayoutActiveStatusLog] = useState<string>("SHELL_NOMINAL");
  const [windowResizesCount, setWindowResizesCount] = useState<number>(0);

  const infrastructureStateRef = useRef<{
    totalResizesRegistered: number;
    lastPolledTime: number;
  }>({
    totalResizesRegistered: 0,
    lastPolledTime: performance.now(),
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    /**
     * NATIVE VIEWPORT HEIGHT STABILIZER Curve
     * Squeezes maximum layout stability out of mobile browsers by calculating real window steps,
     * completely avoiding standard CSS vh bouncing glitches when touch bars reveal.
     */
    const recalculateStableVerticalBounds = () => {
      const state = infrastructureStateRef.current;
      state.totalResizesRegistered++;
      
      const customComputedVh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--nos-stable-vh", `${customComputedVh}px`);
      
      setViewportHeightProperty(`${window.innerHeight}px`);
      setWindowResizesCount(state.totalResizesRegistered);
      setLayoutActiveStatusLog(`SHELL_RESIZED_${state.totalResizesRegistered}`);
    };

    recalculateStableVerticalBounds();
    window.addEventListener("resize", recalculateStableVerticalBounds, { passive: true });
    window.addEventListener("orientationchange", recalculateStableVerticalBounds, { passive: true });

    return () => {
      window.removeEventListener("resize", recalculateStableVerticalBounds);
      window.removeEventListener("orientationchange", recalculateStableVerticalBounds);
    };
  }, []);

  return (
    <div 
      className="w-full relative overflow-hidden bg-[#020203] font-sans text-zinc-100 antialiased cross-browser-master-stack"
      style={{ height: viewportHeightProperty }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --nos-stable-vh: 1vh;
        }
        .cross-browser-master-stack {
          position: relative;
          width: 100vw;
          overflow: hidden;
        }
        .layout-scroller-plane-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 20;
          -webkit-overflow-scrolling: touch;
        }
        .layout-drawer-shading-overlay {
          position: fixed;
          inset: 0;
          background: rgba(1, 1, 3, 0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 40;
        }
        .overlay-visible-state {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        .layout-telemetry-tag-print {
          font-family: monospace;
          font-size: 7px;
          color: rgba(255, 255, 255, 0.08);
          position: absolute;
          top: 12px;
          left: 12px;
          letter-spacing: 0.12em;
          z-index: 5;
        }
      `}} />

      {/* BACKGROUND TELEMETRY MAPPING PRINT */}
      <div className="layout-telemetry-tag-print select-none uppercase pointer-events-none">
        NOS_SHELL_STATE: {layoutActiveStatusLog} // VER_CYCLES: {windowResizesCount}
      </div>

      {/* CENTRAL APP CHILDREN LAYER SLICES MOUNT POINT */}
      <div className="w-full h-full relative z-10">
        {children}
      </div>

      {/* DRAWER LAYER DISMISS OVERLAY SHADING SHEET */}
      <div 
        onClick={onOverlayClick}
        className={`layout-drawer-shading-overlay ${isDrawerOpen ? "overlay-visible-state" : ""}`}
      />
      
    </div>
  );
}
