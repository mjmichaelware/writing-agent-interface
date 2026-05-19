"use client";

import React, { useEffect, useRef, useState } from "react";
import { bus } from "@/core/runtimeEngine";
import SystemTab from "./panel/SystemTab";
import IndexTab from "./panel/IndexTab";

type PanelTab = "INDEX" | "SYSTEM" | "HYPERLINKS" | "REFERENCES" | "ARCHETYPES";

export default function Layer4Panel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<PanelTab>("SYSTEM");

  useEffect(() => {
    return bus.on("ui:menu_toggle", (state) => {
      const panel = panelRef.current;
      const shield = shieldRef.current;
      if (!panel || !shield) return;
      panel.style.transform = state.isOpen ? "rotateY(0deg) translateX(0)" : "rotateY(25deg) translateX(100%)";
      panel.style.opacity = state.isOpen ? "1" : "0";
      panel.style.pointerEvents = state.isOpen ? "auto" : "none";
      shield.style.opacity = state.isOpen ? "1" : "0";
      shield.style.pointerEvents = state.isOpen ? "auto" : "none";
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none" style={{ perspective: "2000px" }}>
      <div ref={shieldRef} onClick={() => bus.emit("ui:menu_toggle", { isOpen: false })} className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-800 opacity-0 pointer-events-none will-change-[opacity]" />
      <div ref={panelRef} className="absolute top-0 right-0 w-[420px] h-full bg-[#050507] border-l border-zinc-900 shadow-2xl flex flex-col origin-right transition-all duration-800 opacity-0 pointer-events-none will-change-[transform,opacity]" style={{ transform: "rotateY(25deg) translateX(100%)", transformStyle: "preserve-3d" }}>
        <div className="flex items-center gap-4 p-6 border-b border-zinc-900">
          <img src="/assets/michael.jpg" alt="Operator" className="w-8 h-8 rounded-full opacity-60" />
          <div className="text-[10px] uppercase tracking-widest text-zinc-500">Operator</div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-6">
          {["INDEX", "SYSTEM", "HYPERLINKS", "REFERENCES", "ARCHETYPES"].map((t) => (
            <button key={t} onClick={() => setActiveTab(t as PanelTab)} className={`text-[9px] tracking-widest uppercase py-2 border ${activeTab === t ? "border-zinc-500 text-zinc-100" : "border-zinc-900 text-zinc-700"}`}>{t}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "SYSTEM" && <SystemTab />}
          {activeTab === "INDEX" && <IndexTab />}
          {/* Remaining tabs mount placeholders until Batch 5 */}
        </div>
      </div>
    </div>
  );
}
