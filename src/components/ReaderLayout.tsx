"use client";

import React, { useEffect, useRef, useState } from "react";

interface ReaderLayoutProps {
  children: React.ReactNode;
  isDrawerOpen?: boolean;
  onOverlayClick?: () => void;
}

export default function ReaderLayout({
  children,
  isDrawerOpen = false,
  onOverlayClick,
}: ReaderLayoutProps) {
  const [viewportHeightProperty, setViewportHeightProperty] = useState("100vh");
  const [layoutActiveStatusLog, setLayoutActiveStatusLog] = useState("SHELL_NOMINAL");
  const [windowResizesCount, setWindowResizesCount] = useState(0);

  const infrastructureStateRef = useRef({
    totalResizesRegistered: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const recalculateStableVerticalBounds = () => {
      const state = infrastructureStateRef.current;
      state.totalResizesRegistered += 1;

      const customComputedVh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty(
        "--nos-stable-vh",
        `${customComputedVh}px`
      );

      setViewportHeightProperty(`${window.innerHeight}px`);
      setWindowResizesCount(state.totalResizesRegistered);
      setLayoutActiveStatusLog(`SHELL_RESIZED_${state.totalResizesRegistered}`);
    };

    recalculateStableVerticalBounds();

    window.addEventListener("resize", recalculateStableVerticalBounds, {
      passive: true,
    });

    window.addEventListener("orientationchange", recalculateStableVerticalBounds, {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", recalculateStableVerticalBounds);
      window.removeEventListener(
        "orientationchange",
        recalculateStableVerticalBounds
      );
    };
  }, []);

  return (
    <div
      className="w-full relative overflow-hidden bg-[#020203] font-sans text-zinc-100 antialiased cross-browser-master-stack"
      style={{ height: viewportHeightProperty }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --nos-stable-vh: 1vh;
            }

            .cross-browser-master-stack {
              position: relative;
              width: 100vw;
              overflow: hidden;
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
          `,
        }}
      />

      <div className="layout-telemetry-tag-print select-none uppercase pointer-events-none">
        NOS_SHELL_STATE: {layoutActiveStatusLog} // VER_CYCLES:{" "}
        {windowResizesCount}
      </div>

      <div className="w-full h-full relative z-10">{children}</div>

      <div
        onClick={onOverlayClick}
        className={`layout-drawer-shading-overlay ${
          isDrawerOpen ? "overlay-visible-state" : ""
        }`}
      />
    </div>
  );
}
