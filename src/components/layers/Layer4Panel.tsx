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
    { id: "HYPERLINKS", label: "Parallelisms & Dualisms", component: <HyperlinksGraph /> },
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
      {/* Dismiss Zone (Top 15vh) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[45] bg-transparent h-[15vh]" 
          onClick={() => {
            setIsOpen(false);
            bus.emit("panel:close", {});
          }}
        />
      )}

      {/* Layer 4 Projector Panel */}
      <div
        ref={panelRef}
        className={`fixed inset-x-0 bottom-0 z-50 h-[85vh] bg-[#0a0a0a]/90 backdrop-blur-[24px] border-t border-[#c9a96e]/20 transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_-20px_60px_rgba(0,0,0,0.8)] ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-5xl mx-auto h-full flex flex-col px-6 md:px-12 py-8">
          
          {/* Tab Navigation */}
          <nav className="relative flex justify-between items-center w-full mb-12 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar">
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
            {TABS[activeTab].component}
          </div>
        </div>
      </div>
    </>
  );
}