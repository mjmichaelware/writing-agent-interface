"use client";

import React, { useState } from "react";
import HyperlinksGraph from "./panel/HyperlinksGraph";
import BiblicalReferencesDirectory from "./panel/BiblicalReferencesDirectory";
import ArchetypesDirectory from "./panel/ArchetypesDirectory";
import StatusTab from "./panel/StatusTab";
import SystemTab from "./panel/SystemTab";

export default function Layer4Panel() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const TABS = [
    {
      id: "HYPERLINKS",
      label: "Parallelisms & Dualisms",
      component: <HyperlinksGraph />,
    },
    {
      id: "BIBLICAL",
      label: "Biblical References",
      component: <BiblicalReferencesDirectory />,
    },
    {
      id: "ARCHETYPES",
      label: "Archetypes",
      component: <ArchetypesDirectory />,
    },
    {
      id: "SETTINGS",
      label: "Chapter Settings",
      component: <StatusTab />,
    },
    {
      id: "SYSTEM",
      label: "Master Override",
      component: <SystemTab />,
    },
  ];

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between">
      <header className="pointer-events-auto w-full px-4 py-3 md:px-8 md:py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/50 to-transparent backdrop-blur-sm transition-all duration-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#8a857c]/30 shadow-lg bg-[#c9a96e]/20" />

          <div className="flex flex-col leading-none">
            <span className="font-serif text-[#e8e4dc] text-[10px] md:text-xs tracking-[0.2em] uppercase mb-1">
              Operator Active
            </span>

            <span className="font-serif text-[#c9a96e] text-[9px] md:text-[10px] tracking-widest uppercase animate-pulse">
              Telemetry Online
            </span>
          </div>
        </div>

        <nav className="flex gap-4 md:gap-8 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(activeTab === tab.id ? null : tab.id)
              }
              className={`font-serif text-[10px] md:text-xs tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-500 pb-1 border-b border-transparent ${
                activeTab === tab.id
                  ? "text-[#e8d4a0] border-[#e8d4a0] drop-shadow-[0_0_8px_rgba(232,212,160,0.4)]"
                  : "text-[#8a857c] hover:text-[#e8e4dc]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <div
        className={`pointer-events-auto absolute bottom-0 left-0 w-full h-[85vh] transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          activeTab
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-12 pointer-events-none"
        }`}
      >
        <div className="w-full h-full mx-auto bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-[#8a857c]/10 shadow-[0_-20px_60px_rgba(0,0,0,0.9)] overflow-y-auto px-6 py-12 md:px-24">
          <div className="max-w-4xl mx-auto">
            {activeTab &&
              TABS.find((t) => t.id === activeTab)?.component}
          </div>
        </div>
      </div>

      <div className="h-16 w-full bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none absolute bottom-0" />
    </div>
  );
}
