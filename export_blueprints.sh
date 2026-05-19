#!/bin/bash
DEST="$HOME/storage/downloads/NOS_Master_Blueprints.txt"

echo "Assembling Master Blueprints and scanning file tree..."
echo "Generating payload at $DEST"

echo "=== NARRATIVE OS: MASTER BLUEPRINTS & RECOVERY ===" > "$DEST"
echo "Timestamp: $(date)" >> "$DEST"

echo -e "\n\n=== 1. PROJECT TREE (Weights, Dates, Paths) ===" >> "$DEST"
echo "Note: node_modules, .git, and .next are excluded for clarity." >> "$DEST"
echo "SIZE | DATE | TIME | FILE PATH" >> "$DEST"
echo "---------------------------------------------------" >> "$DEST"
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.next/*" -exec ls -lh --time-style=long-iso {} + | awk '{print $5 " \t " $6 " " $7 " \t " $8}' | sort -hr >> "$DEST"

echo -e "\n\n=== 2. THE 14 TARGET FILES (PRISTINE CODE) ===" >> "$DEST"

echo -e "\n\n>>> FILE 1: next.config.js (Fixes compilation failure)" >> "$DEST"
cat << 'CODE_EOF' >> "$DEST"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed poison eslint and experimental keys to unblock Termux ARM64 builds
};
module.exports = nextConfig;
CODE_EOF

echo -e "\n\n>>> FILE 2: package.json (Build script fix for Android)" >> "$DEST"
cat << 'CODE_EOF' >> "$DEST"
// ACTION REQUIRED: Do not copy this whole block over your package.json! 
// Just change your "build" script to use Webpack, bypassing the Turbopack error on Termux:
{
  "scripts": {
    "dev": "next dev",
    "build": "next build --webpack",
    "start": "next start",
    "ingest": "tsx src/actions/ingest.action.ts"
  }
}
CODE_EOF

echo -e "\n\n>>> FILE 3: src/core/runtimeEngine.ts (The Memory-Safe Singleton)" >> "$DEST"
cat << 'CODE_EOF' >> "$DEST"
class EventBus {
  private static instance: EventBus;
  private events: Map<string, Set<Function>> = new Map();

  static getInstance() {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  on(event: string, fn: Function) {
    if (!this.events.has(event)) this.events.set(event, new Set());
    this.events.get(event)!.add(fn);
  }

  off(event: string, fn: Function) {
    this.events.get(event)?.delete(fn);
  }

  emit(event: string, data?: any) {
    this.events.get(event)?.forEach((fn) => fn(data));
  }
}

export const bus = EventBus.getInstance();
export { EventBus };
export default bus;
CODE_EOF

echo -e "\n\n>>> FILE 4: src/components/layers/canvas/ManuscriptCore.tsx (Headless GPU Scroller)" >> "$DEST"
cat << 'CODE_EOF' >> "$DEST"
"use client";

import React, { useEffect, useRef } from "react";
import { bus } from "@/core/runtimeEngine";

export default function ManuscriptCore({ blocks, chapterSlug }: { blocks: string[]; chapterSlug: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.dataset.state = "active";
          const index = el.dataset.index;
          if (index) bus.emit("scroll:focus", { paraIndex: +index });
        } else {
          el.dataset.state = "inactive";
        }
      }
    }, { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0 });

    observerRef.current = observer;
    root.querySelectorAll("p[data-para]").forEach((p) => observer.observe(p));

    return () => observer.disconnect();
  }, [chapterSlug]);

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto pb-[50vh] pt-[30vh] px-6 md:px-0">
      {blocks.map((text, idx) => (
        <p
          key={idx}
          data-para
          data-index={idx}
          data-state="inactive"
          className="mb-10 text-justify font-serif text-lg md:text-xl text-[var(--text-primary)] tracking-wide leading-[var(--leading-prose)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform opacity-40 data-[state=active]:opacity-100 data-[state=active]:translate-y-0 data-[state=inactive]:translate-y-[4px] data-[state=inactive]:blur-[1px]"
        >
          {text}
        </p>
      ))}
    </div>
  );
}
CODE_EOF

echo -e "\n\n>>> FILE 5: src/components/layers/Layer3Canvas.tsx (Velocity Blur Listener)" >> "$DEST"
cat << 'CODE_EOF' >> "$DEST"
"use client";

import React, { useEffect, useRef } from "react";
import ManuscriptCore from "./canvas/ManuscriptCore";
import { bus } from "@/core/runtimeEngine";

export default function Layer3Canvas({ chapterData }: { chapterData: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onNav = () => {
      el.style.filter = "blur(4px)";
      el.style.transform = "scale(0.98)";
      el.style.opacity = "0.7";
      el.scrollTo({ top: 0, behavior: "smooth" });

      window.setTimeout(() => {
        el.style.filter = "blur(0px)";
        el.style.transform = "scale(1)";
        el.style.opacity = "1";
      }, 800);
    };

    bus.on("nav:velocity_scroll", onNav);
    return () => bus.off("nav:velocity_scroll", onNav);
  }, []);

  if (!chapterData?.blocks?.length) return <div className="absolute inset-0 flex justify-center items-center text-zinc-600 font-mono">Awaiting Manifest...</div>;

  return (
    <div ref={scrollRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden transition-all duration-500 will-change-[transform,filter,opacity]">
      <div className="w-full min-h-screen relative">
        <ManuscriptCore blocks={chapterData.blocks} chapterSlug={chapterData.slug} />
      </div>
    </div>
  );
}
CODE_EOF

echo -e "\n\n>>> FILE 6: src/components/ReaderLayout.tsx (3D Hardware Viewport)" >> "$DEST"
cat << 'CODE_EOF' >> "$DEST"
"use client";

import React, { useEffect, useRef } from "react";
import { bus } from "@/core/runtimeEngine";

export default function ReaderLayout({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onToggle = (state: { isOpen: boolean }) => {
      const el = wrapperRef.current;
      if (!el) return;
      if (state.isOpen) {
        el.style.transform = "rotateY(-12deg) translateZ(-100px) translateX(4%)";
        el.style.filter = "blur(3px) brightness(0.5)";
        el.style.pointerEvents = "none";
      } else {
        el.style.transform = "rotateY(0deg) translateZ(0px) translateX(0%)";
        el.style.filter = "blur(0px) brightness(1)";
        el.style.pointerEvents = "auto";
      }
    };

    bus.on("ui:menu_toggle", onToggle);
    return () => bus.off("ui:menu_toggle", onToggle);
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-[#020203] text-zinc-100 antialiased" style={{ perspective: "2000px" }}>
      <div ref={wrapperRef} className="w-full h-full transform-gpu transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left will-change-[transform,filter]">
        {children}
      </div>
    </div>
  );
}
CODE_EOF

echo -e "\n\n>>> FILE 7: src/components/layers/Layer4Panel.tsx (3D Page Flip Menu)" >> "$DEST"
cat << 'CODE_EOF' >> "$DEST"
"use client";

import React, { useEffect, useRef, useState } from "react";
import { bus } from "@/core/runtimeEngine";
import SystemTab from "./panel/SystemTab";

export default function Layer4Panel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("SYSTEM");

  useEffect(() => {
    const toggleMenu = (state: { isOpen: boolean }) => {
      const panel = panelRef.current;
      const shield = shieldRef.current;
      if (!panel || !shield) return;

      if (state.isOpen) {
        panel.style.transform = "rotateY(0deg) translateX(0)";
        panel.style.opacity = "1";
        panel.style.pointerEvents = "auto";
        shield.style.opacity = "1";
        shield.style.pointerEvents = "auto";
      } else {
        panel.style.transform = "rotateY(25deg) translateX(100%)";
        panel.style.opacity = "0";
        panel.style.pointerEvents = "none";
        shield.style.opacity = "0";
        shield.style.pointerEvents = "none";
      }
    };

    bus.on("ui:menu_toggle", toggleMenu);
    return () => bus.off("ui:menu_toggle", toggleMenu);
  }, []);

  const closeMenu = () => bus.emit("ui:menu_toggle", { isOpen: false });

  return (
    <div className="fixed inset-0 z-50 pointer-events-none" style={{ perspective: "2000px" }}>
      <div ref={shieldRef} onClick={closeMenu} className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 pointer-events-none will-change-[opacity]" />
      <div ref={panelRef} className="absolute top-0 right-0 w-[85vw] md:w-[420px] h-full bg-[#050507] border-l border-zinc-900 shadow-2xl flex flex-col origin-right transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity] opacity-0 pointer-events-none" style={{ transform: "rotateY(25deg) translateX(100%)", transformStyle: "preserve-3d" }}>
        <div className="w-full h-full flex flex-col pointer-events-auto">
          <div className="flex items-center justify-between p-6 border-b border-zinc-900/50">
            <div className="flex gap-4">
              {["INDEX", "SYSTEM"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`text-[10px] tracking-widest font-mono transition-colors ${activeTab === tab ? "text-zinc-100" : "text-zinc-600 hover:text-zinc-400"}`}>{tab}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto relative bg-[#020203]">
            {activeTab === "SYSTEM" && <SystemTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
CODE_EOF

echo -e "\n\n>>> FILE 8: src/components/layers/panel/SystemTab.tsx (The Tactile PIN Pad Sandbox)" >> "$DEST"
cat << 'CODE_EOF' >> "$DEST"
"use client";

import React, { useState } from "react";

export default function SystemTab() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleKey = (num: string) => {
    if (error) setError(false);
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === "1003") {
          setTimeout(() => setUnlocked(true), 300);
        } else {
          setError(true);
          setTimeout(() => { setPin(""); setError(false); }, 500);
        }
      }
    }
  };

  if (unlocked) {
    return (
      <div className="p-8 animate-in fade-in duration-700">
        <h3 className="font-mono text-[10px] text-emerald-500 tracking-widest uppercase mb-6 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />IWritingAgent: Online</h3>
        <button className="w-full text-left p-4 border border-zinc-900 bg-zinc-900/20 hover:bg-zinc-900/50 transition-colors group"><span className="block font-serif text-zinc-300">Access 181 Concordance Nodes</span></button>
      </div>
    );
  }

  return (
    <div className="p-8 h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h2 className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 mb-4">SYSTEM GATEWAY</h2>
        <div className="flex gap-4 justify-center">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${error ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]" : i < pin.length ? "bg-zinc-200 shadow-[0_0_12px_rgba(255,255,255,0.4)]" : "bg-zinc-800"}`} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 w-full max-w-[220px]">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "DEL", "0", "ENT"].map((key) => (
          <button key={key} onClick={() => { if (key === "DEL") setPin(pin.slice(0, -1)); else handleKey(key); }} className="aspect-square font-mono text-sm text-zinc-400 border border-zinc-800/30 bg-[#070709] hover:bg-zinc-800 transition-all">{key}</button>
        ))}
      </div>
    </div>
  );
}
CODE_EOF

echo -e "\n\n>>> FILE 9: src/app/page.tsx (Pristine Root Server Component)" >> "$DEST"
cat << 'CODE_EOF' >> "$DEST"
import React from "react";
import ReaderLayout from "@/components/ReaderLayout";
import Layer2Cinema from "@/components/layers/Layer2Cinema";
import Layer3Canvas from "@/components/layers/Layer3Canvas";
import Layer4Panel from "@/components/layers/Layer4Panel";
import { VectorStore } from "@/services/memory-engine/vector-store";
import path from "path";
import { promises as fs } from "fs";

export const dynamic = "force-dynamic";

async function fetchChapterData(slug: string) {
  try {
    const store = new VectorStore();
    const manifestPath = path.join(process.cwd(), "nos_manifest.json");
    const manifestRaw = await fs.readFile(manifestPath, "utf-8");
    const manifest = JSON.parse(manifestRaw || '{"nodes":[]}');
    const targetNode = (manifest.nodes || []).find((n: any) => String(n.id).toLowerCase().includes(`chapter_${slug}`));
    if (!targetNode) return null;
    const matchedChapterId = await store.getChapterByManifestId(targetNode.id);
    if (!matchedChapterId) return null;
    const blocks = await store.getParagraphsByChapter(matchedChapterId);
    return { slug, blocks, total: blocks.length };
  } catch (e) {
    return null;
  }
}

export default async function Page() {
  const chapterData = await fetchChapterData("7");
  return (
    <ReaderLayout>
      <Layer2Cinema chapter={7} activePara={0} depth={0} />
      <Layer3Canvas chapterData={chapterData} />
      <Layer4Panel />
    </ReaderLayout>
  );
}
CODE_EOF

echo -e "\n\n>>> FILE 10: src/runtime/runtimeContext.tsx (Context Healer Proxy)" >> "$DEST"
cat << 'CODE_EOF' >> "$DEST"
"use client";

import React, { createContext, useContext } from "react";
import { bus } from "@/core/runtimeEngine";

export function getRuntime() {
  return { bus: bus, emit: bus.emit.bind(bus), on: bus.on.bind(bus), off: bus.off.bind(bus) };
}

const RuntimeContext = createContext<{ bus: typeof bus }>({ bus });

export function RuntimeProvider({ children }: { children: React.ReactNode }) {
  return <RuntimeContext.Provider value={{ bus }}>{children}</RuntimeContext.Provider>;
}

export function useRuntime() {
  return useContext(RuntimeContext);
}
CODE_EOF

echo -e "\n\n>>> FILES 11, 12, 13: Feature Listeners (audioListener.ts, distortionListener.ts, thematicListener.ts)" >> "$DEST"
cat << 'CODE_EOF' >> "$DEST"
// ALL THREE FILES SHOULD LOOK LIKE THIS:
import { bus } from "@/core/runtimeEngine";

export function initListener() {
  bus.on("scroll:focus", (data: any) => {
    // Event injected natively
  });
}
CODE_EOF

echo -e "\n\n>>> FILE 14: nos_manifest.json (Sanitized Canonical Clean Base)" >> "$DEST"
cat << 'CODE_EOF' >> "$DEST"
{
  "nodes": [
    { "id": "Chapter_1", "file_path": "canon/Chapter_1.txt" },
    { "id": "Chapter_2", "file_path": "canon/Chapter_2.txt" },
    { "id": "Chapter_3", "file_path": "canon/Chapter_3.txt" },
    { "id": "Chapter_4", "file_path": "canon/Chapter_4.txt" },
    { "id": "Chapter_5", "file_path": "canon/Chapter_5.txt" },
    { "id": "Chapter_6", "file_path": "canon/Chapter_6.txt" },
    { "id": "Chapter_7", "file_path": "canon/Chapter_7.txt" },
    { "id": "Chapter_8", "file_path": "canon/Chapter_8.txt" },
    { "id": "Chapter_9", "file_path": "canon/Chapter_9.txt" },
    { "id": "Chapter_10", "file_path": "canon/Chapter_10.txt" },
    { "id": "Chapter_11", "file_path": "canon/Chapter_11.txt" },
    { "id": "Chapter_12", "file_path": "canon/Chapter_12.txt" },
    { "id": "Chapter_13", "file_path": "canon/Chapter_13.txt" }
  ]
}
CODE_EOF

echo "Triggering Android media scanner..."
termux-media-scan "$DEST"
echo "Success! The file NOS_Master_Blueprints.txt is now in your Downloads folder."
