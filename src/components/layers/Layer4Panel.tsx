"use client";

import React, { useEffect, useState, useRef } from "react";
import { bus } from "@/core/runtimeEngine";
import HyperlinksGraph from "./panel/HyperlinksGraph";
import BiblicalReferencesDirectory from "./panel/BiblicalReferencesDirectory";
import ArchetypesDirectory from "./panel/ArchetypesDirectory";
import StylesTab from "./panel/StylesTab";
import SystemTab from "./panel/SystemTab";

export default function Layer4Panel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const TABS = [
    { id: "HYPERLINKS", label: "Parallelisms & Dualisms" },
    { id: "BIBLICAL", label: "Biblical References", component: <BiblicalReferencesDirectory /> },
    { id: "ARCHETYPES", label: "Archetypes", component: <ArchetypesDirectory /> },
    { id: "SETTINGS", label: "Chapter Settings", component: <StylesTab /> },
    { id: "SYSTEM", label: "Author Gateway", component: <SystemTab /> },
  ];

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      bus.emit("panel:open", {});
    };
    const handleClose = () => {
      setIsOpen(false);
      bus.emit("panel:close", {});
    };

    const unsubOpen = bus.on("ui:menu_open", handleOpen);
    const unsubClose = bus.on("ui:menu_close", handleClose);
    const unsubToggle = bus.on("ui:menu_toggle", (data: { isOpen: boolean }) => {
        data.isOpen ? handleOpen() : handleClose();
    });

    return () => {
      unsubOpen();
      unsubClose();
      unsubToggle();
    };
  }, []);

  return (
    <>
      {/* Persistent Floating Menu Button */}
      <button
        onClick={() => {
          const newState = !isOpen;
          setIsOpen(newState);
          bus.emit(newState ? "panel:open" : "panel:close", {});
        }}
        className={`fixed bottom-8 right-8 z-[60] w-14 h-14 bg-black/60 border border-[#c9a96e]/30 rounded-full flex items-center justify-center text-[#c9a96e] backdrop-blur-xl hover:bg-[#c9a96e]/10 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.8)] ${isOpen ? 'rotate-90 opacity-0 pointer-events-none' : 'rotate-0 opacity-100'}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Layer 4 Projector Panel */}
      <div
        ref={panelRef}
        className={`fixed inset-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-[32px] transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => {
            setIsOpen(false);
            bus.emit("panel:close", {});
          }}
          className="absolute top-8 right-8 z-[60] p-2 text-[#8a857c] hover:text-[#c9a96e] transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="max-w-5xl mx-auto h-full flex flex-col px-6 md:px-12 py-16">
          
          {/* Tab Navigation */}
          <nav className="relative flex justify-between items-center w-full mb-16 border-b border-white/5 pb-6 overflow-x-auto no-scrollbar">
            {TABS.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`font-serif italic text-sm md:text-base whitespace-nowrap px-4 py-2 transition-colors duration-500 ${
                  activeTab === idx ? "text-[#e8d4a0]" : "text-[#8a857c] hover:text-[#e8e4dc]"
                }`}
              >
                {tab.label}
              </button>
            ))}
            
            {/* Sliding Gold Indicator */}
            <div 
              className="absolute bottom-0 left-0 h-[1px] bg-[#c9a96e] transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: `calc(100% / ${TABS.length})`,
                transform: `translateX(${activeTab * 100}%)`
              }}
            />
          </nav>

          {/* Active Component */}
          <div className="flex-1 overflow-y-auto pb-12 scrollbar-hide">
            {isOpen && TABS[activeTab].id === "HYPERLINKS" ? (
                <HyperlinksGraph />
            ) : (
                TABS[activeTab].component
            )}
          </div>
        </div>
      </div>
    </>
  );
}