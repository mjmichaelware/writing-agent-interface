"use client";

import React, { useEffect, useRef, useState } from "react";
import { bus } from "@/core/runtimeEngine";
import SystemTab from "./panel/SystemTab";
import StylesTab from "./panel/StylesTab";
import HyperlinksGraph from "./panel/HyperlinksGraph";
import BiblicalReferencesDirectory from "./panel/BiblicalReferencesDirectory";
import ArchetypesDirectory from "./panel/ArchetypesDirectory";

type PanelTab = "HYPERLINKS" | "REFERENCES" | "ARCHETYPES" | "SETTINGS" | "SYSTEM";

const tabs: { id: PanelTab; label: string; sub: string }[] = [
  { id: "HYPERLINKS", label: "Links", sub: "Dualisms" },
  { id: "REFERENCES", label: "Refs", sub: "Concordance" },
  { id: "ARCHETYPES", label: "Types", sub: "Jungian" },
  { id: "SETTINGS", label: "Style", sub: "Reader" },
  { id: "SYSTEM", label: "System", sub: "Agent" },
];

export default function Layer4Panel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<PanelTab>("SYSTEM");

  useEffect(() => {
    const toggleMenu = (state: { isOpen: boolean }) => {
      const panel = panelRef.current;
      const shield = shieldRef.current;
      if (!panel || !shield) return;

      if (state.isOpen) {
        panel.style.transform = "rotateY(0deg) translateX(0) scale(1)";
        panel.style.opacity = "1";
        panel.style.pointerEvents = "auto";
        shield.style.opacity = "1";
        shield.style.pointerEvents = "auto";
      } else {
        panel.style.transform = "rotateY(25deg) translateX(100%) scale(0.985)";
        panel.style.opacity = "0";
        panel.style.pointerEvents = "none";
        shield.style.opacity = "0";
        shield.style.pointerEvents = "none";
      }
    };

    return bus.on("ui:menu_toggle", toggleMenu);
  }, []);

  const closeMenu = () => bus.emit("ui:menu_toggle", { isOpen: false });

  return (
    <div className="fixed inset-0 z-50 pointer-events-none" style={{ perspective: "2000px" }}>
      <div ref={shieldRef} onClick={closeMenu} className="absolute inset-0 bg-black/40 backdrop-blur-[12px] transition-opacity duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 pointer-events-none will-change-[opacity]" />
      <div ref={panelRef} className="absolute top-0 right-0 w-[88vw] md:w-[460px] h-full bg-[#050507]/90 border-l border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.7)] flex flex-col origin-right transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 pointer-events-none will-change-[transform,opacity] backdrop-blur-2xl" style={{ transform: "rotateY(25deg) translateX(100%) scale(0.985)", transformStyle: "preserve-3d" }}>
        <div className="flex-1 flex flex-col pointer-events-auto">
          <div className="p-5 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
            <div className="flex justify-between items-center mb-5">
              <div>
                <div className="font-serif italic text-xl text-[#e8e4dc]">Ghost Perimeter</div>
                <div className="text-[9px] uppercase tracking-[0.32em] text-zinc-600">Narrative Operating Shell</div>
              </div>
              <button onClick={closeMenu} className="rounded-full border border-white/10 px-3 py-2 text-[9px] tracking-widest text-zinc-500 hover:text-[#e8e4dc] hover:border-white/25 hover:bg-white/[0.04] transition">CLOSE</button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`min-w-[92px] rounded-2xl border px-3 py-3 text-left transition-all duration-300 ${activeTab === tab.id ? "border-[#d4af37]/60 bg-[#d4af37]/10 text-[#f6e7b4] shadow-[0_0_24px_rgba(212,175,55,0.08)]" : "border-white/10 bg-black/20 text-zinc-600 hover:text-zinc-300 hover:border-white/20"}`}>
                  <span className="block text-[9px] uppercase tracking-widest">{tab.label}</span>
                  <span className="block mt-1 font-serif italic text-xs opacity-60">{tab.sub}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-[#020203]">
            {activeTab === "HYPERLINKS" && <HyperlinksGraph />}
            {activeTab === "REFERENCES" && <BiblicalReferencesDirectory />}
            {activeTab === "ARCHETYPES" && <ArchetypesDirectory />}
            {activeTab === "SETTINGS" && <StylesTab />}
            {activeTab === "SYSTEM" && <SystemTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
