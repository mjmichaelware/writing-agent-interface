"use client";

import React, { useEffect, useState } from "react";

interface ReaderLayoutProps {
  children: React.ReactNode;
}

export default function ReaderLayout({ children }: ReaderLayoutProps) {
  const [viewportHeight, setViewportHeight] = useState("100vh");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncViewport = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--nos-stable-vh", `${vh}px`);
      document.documentElement.style.setProperty("--measured-vh", `${window.innerHeight}px`);
      document.documentElement.style.setProperty("--measured-vw", `${window.innerWidth}px`);
      setViewportHeight(`${window.innerHeight}px`);
    };

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setProgress(Number(scroll) * 100);
    };

    syncViewport();

    window.addEventListener("resize", syncViewport, { passive: true });
    window.addEventListener("orientationchange", syncViewport, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", syncViewport);
      window.removeEventListener("orientationchange", syncViewport);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main
      className="relative isolate w-full min-h-screen bg-[var(--bg-void)] text-[var(--text-body)] antialiased"
      style={{ minHeight: viewportHeight }}
    >
      <div 
        className="fixed top-0 left-0 h-[1px] bg-[var(--accent-gold)] z-[60] transition-all duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
      {children}
    </main>
  );
}