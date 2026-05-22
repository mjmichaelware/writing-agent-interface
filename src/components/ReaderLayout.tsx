"use client";

import React, { useEffect, useState } from "react";

interface ReaderLayoutProps {
  children: React.ReactNode;
}

export default function ReaderLayout({ children }: ReaderLayoutProps) {
  const [viewportHeight, setViewportHeight] = useState("100vh");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncViewport = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--nos-stable-vh", `${vh}px`);
      setViewportHeight(`${window.innerHeight}px`);
    };

    syncViewport();

    window.addEventListener("resize", syncViewport, { passive: true });
    window.addEventListener("orientationchange", syncViewport, { passive: true });

    return () => {
      window.removeEventListener("resize", syncViewport);
      window.removeEventListener("orientationchange", syncViewport);
    };
  }, []);

  return (
    <main
      className="relative isolate w-full min-h-screen bg-[var(--bg-void)] text-[var(--text-body)] antialiased"
      style={{ minHeight: viewportHeight }}
    >
      {children}
    </main>
  );
}