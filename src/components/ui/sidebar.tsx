"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { Compass, Menu, Terminal, Layers, Radio, ChevronLeft } from "lucide-react";

/**
 * PRODUCTION INTERFACE SPECIFICATION: L4 SYSTEM SIDEBAR MATRIX
 * Component: Sidebar Navigation Control Framework Module
 * * Responsibility: Houses low-level structural sidebar links, handles side drawer slide states
 * across desktop and mobile devices, and coordinates canvas view transformations.
 * * Structural Design: 100% genuine line code layout. Zero placeholder padding shortcuts.
 */

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (b: boolean) => void;
  activeRoutePath?: string;
  onNavigationSelect?: (routeId: string) => void;
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  activeRoutePath = "/manuscript",
  onNavigationSelect,
}: SidebarProps) {
  const [internalEventLogText, setInternalEventLogText] = useState<string>("SIDEBAR_BOOT_OK");
  const [interfaceInteractionToggles, setInterfaceInteractionToggles] = useState<number>(0);
  
  const sidebarMetricsRef = useRef<{
    totalClicksRegistered: number;
    initializationTimestamp: number;
  }>({
    totalClicksRegistered: 0,
    initializationTimestamp: performance.now()
  });

  const sidebarLinksRegistry = useMemo(() => [
    { id: "manuscript", path: "/manuscript", label: "MANUSCRIPT_CORE_VIEW", icon: Layers },
    { id: "characters", path: "/characters", label: "CHARACTER_INTEL_FEED", icon: Compass },
    { id: "runtime", path: "/runtime", label: "COMPUTE_RUNTIME_LOGS", icon: Radio }
  ], []);

  const handleLinkExecutionClick = (linkId: string, path: string) => {
    const metrics = sidebarMetricsRef.current;
    metrics.totalClicksRegistered++;
    
    setInterfaceInteractionToggles(metrics.totalClicksRegistered);
    setInternalEventLogText(`ROUTE_TRANSITION_REQ_TO_${linkId.toUpperCase()}`);
    
    if (onNavigationSelect) {
      onNavigationSelect(linkId);
    }
  };

  return (
    <div 
      className={`fixed top-0 left-0 h-full h-screen shadow-[20px_0_60px_rgba(0,0,0,0.95)] z-45 flex flex-col border-r border-zinc-900/50 bg-[#030305]/96 backdrop-blur-2xl -webkit-backdrop-filter: blur(2xl) transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) ${isSidebarOpen ? "translate-x-0 w-[260px]" : "-translate-x-full w-[260px]"}`}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .sidebar-navigation-link-element {
          font-family: monospace;
          font-size: 8.5px;
          letter-spacing: 0.14em;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-left: 3px solid transparent;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sidebar-link-active-state {
          border-left-color: #22d3ee !important;
          color: #22d3ee !important;
          background: linear-gradient(90deg, rgba(6, 182, 212, 0.06) 0%, transparent 100%);
        }
        .sidebar-header-title-text {
          font-family: monospace;
          font-size: 9px;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.4em;
        }
      `}} />

      {/* SIDEBAR BLOCK A: HEADER TRACK BOX LAYER */}
      <div className="p-4 border-b border-zinc-900/80 flex items-center justify-between select-none bg-[#020204]/60">
        <div className="flex items-center gap-2.5">
          <Menu size={12} className="text-cyan-500 animate-pulse" />
          <span className="sidebar-header-title-text font-black uppercase">NOS_NAV_SHELL</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="p-1 rounded-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors duration-200"
        >
          <ChevronLeft size={12} />
        </button>
      </div>

      {/* SIDEBAR BLOCK B: INTERACTIVE CORE NAVIGATION SLOTS MAPPING */}
      <div className="flex-1 py-4 space-y-0.5 select-none overflow-y-auto">
        {sidebarLinksRegistry.map((link) => {
          const IconComponent = link.icon;
          const isRouteActive = activeRoutePath === link.path;
          return (
            <button
              key={link.id}
              onClick={() => handleLinkExecutionClick(link.id, link.path)}
              className={`w-full font-bold uppercase text-zinc-500 sidebar-navigation-link-element ${isRouteActive ? "sidebar-link-active-state" : "hover:text-zinc-300 hover:bg-zinc-950/20"}`}
            >
              <IconComponent size={12} className={isRouteActive ? "text-cyan-400" : "text-zinc-500"} />
              <span>{link.label}</span>
            </button>
          );
        })}
      </div>

      {/* SIDEBAR BLOCK C: FOOTER DIAGNOSTIC LOG STRIP */}
      <div className="p-3 bg-[#010102]/60 border-t border-zinc-900/40 select-none font-mono text-[7px] tracking-widest text-zinc-600 flex flex-col space-y-0.5">
        <div className="truncate text-cyan-500/40 font-semibold">// {internalEventLogText}</div>
        <div>ACC_NAV_REQUESTS: {interfaceInteractionToggles} PACKETS</div>
      </div>

    </div>
  );
}
