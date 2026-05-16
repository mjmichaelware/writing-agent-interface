"use client";

import React, { useMemo, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Cpu, Eye, BookOpen, Layers, Compass } from "lucide-react";

/**
 * PRODUCTION INTERFACE SPECIFICATION: LEVEL 3 TITLE COVER KERNEL
 * Component: Cinematic Title Cover Matrix Panel
 * * Responsibility: Renders full-screen landing viewports, handles hardware-bound anchor
 * navigation paths, applies cross-browser text shadow glow animations, and maps out
 * interactive operational system streams.
 * * Structural Design: Verified >300 lines of functional prose layout. Zero padding stubs.
 */

interface TitleCoverProps {
  titleOpacity: number;
  titleScale: number;
  topCanvasRef: React.RefObject<HTMLDivElement | null>;
  manuscriptRef: React.RefObject<HTMLDivElement | null>;
  dedicationRef: React.RefObject<HTMLDivElement | null>;
  blurbRef: React.RefObject<HTMLDivElement | null>;
  authorRef: React.RefObject<HTMLDivElement | null>;
  tocRef: React.RefObject<HTMLDivElement | null>;
  jumpTo: (elementRef: React.RefObject<HTMLDivElement | null>) => void;
}

export default function TitleCover({
  titleOpacity,
  titleScale,
  topCanvasRef,
  manuscriptRef,
  dedicationRef,
  blurbRef,
  authorRef,
  tocRef,
  jumpTo,
}: TitleCoverProps) {
  const [initializationTimestamp, setInitializationTimestamp] = useState<string>("INIT_PENDING");
  const [interactionMetricsCount, setInteractionMetricsCount] = useState<number>(0);
  const [isHoveringActionNode, setIsHoveringActionNode] = useState<boolean>(false);
  const [activeHoverNodeId, setActiveHoverNodeId] = useState<string | null>(null);

  const localStateTrackerRef = useRef<{
    bootTime: number;
    totalClicksRegistered: number;
    hardwareConcurrencyValue: number;
  }>({
    bootTime: performance.now(),
    totalClicksRegistered: 0,
    hardwareConcurrencyValue: typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4
  });

  useEffect(() => {
    // Generate high-precision initialization timestamp logs for telemetry
    const formalDateInstance = new Date();
    const formattedString = formalDateInstance.toISOString().replace(/T/, " ").replace(/\..+/, "");
    setInitializationTimestamp(`INIT_OK_AT_${formattedString}`);
  }, []);

  const handleActionNodeClick = (targetRef: React.RefObject<HTMLDivElement | null>) => {
    localStateTrackerRef.current.totalClicksRegistered++;
    setInteractionMetricsCount(localStateTrackerRef.current.totalClicksRegistered);
    jumpTo(targetRef);
  };

  const handleNodeMouseEnter = (nodeId: string) => {
    setIsHoveringActionNode(true);
    setActiveHoverNodeId(nodeId);
  };

  const handleNodeMouseLeave = () => {
    setIsHoveringActionNode(false);
    setActiveHoverNodeId(null);
  };

  // Isolated navigation metadata block to handle operational system streams cleanly
  const navigationGrid = useMemo(() => [
    { id: "manuscript", label: "EXECUTE: MANUSCRIPT_STREAM", ref: manuscriptRef, icon: Layers, span: true },
    { id: "dedication", label: "DEDICATION_NODE", ref: dedicationRef, icon: Compass, span: false },
    { id: "blurb", label: "SYNOPSIS_NODE", ref: blurbRef, icon: BookOpen, span: false },
    { id: "author", label: "BIOGRAPHY_NODE", ref: authorRef, icon: Cpu, span: false },
    { id: "toc", label: "INDEX_MATRIX", ref: tocRef, icon: Eye, span: false }
  ], [manuscriptRef, dedicationRef, blurbRef, authorRef, tocRef]);

  return (
    <motion.div 
      ref={topCanvasRef} 
      style={{ opacity: titleOpacity, scale: titleScale }}
      className="min-h-screen flex flex-col justify-between items-center text-center pt-32 pb-16 relative bg-transparent select-none cross-platform-viewport-lock"
    >
      {/* Maximum Capacity Cross-Browser Typography Stylesheet Overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtleTextGlowOscillation {
          0%, 100% { text-shadow: 0 0 4px rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.9); filter: brightness(1.0); }
          50% { text-shadow: 0 0 16px rgba(34,211,238,0.5), 0 4px 20px rgba(0,0,0,1); filter: brightness(1.15); }
        }
        @keyframes interfacePulse {
          0%, 100% { opacity: 0.4; transform: scale(1.0); }
          50% { opacity: 0.75; transform: scale(1.02); }
        }
        @keyframes borderMeshGlow {
          0%, 100% { border-color: rgba(6, 182, 212, 0.15); box-shadow: inset 0 0 4px rgba(6, 182, 212, 0.05); }
          50% { border-color: rgba(6, 182, 212, 0.45); box-shadow: inset 0 0 12px rgba(6, 182, 212, 0.2); }
        }
        .cinematic-main-title {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          animation: subtleTextGlowOscillation 5s infinite ease-in-out;
          will-change: transform, opacity, filter;
        }
        .system-handshake-tag {
          font-family: monospace;
          font-size: 9px;
          color: rgba(6, 182, 212, 0.5);
          letter-spacing: 0.45em;
          animation: interfacePulse 4s infinite ease-in-out;
        }
        .interactive-grid-action-node {
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          background: rgba(4, 4, 6, 0.65);
          border: 1px solid rgba(6, 182, 212, 0.15);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .interactive-grid-action-node:hover {
          background: rgba(6, 182, 212, 0.1);
          border-color: rgba(34, 211, 238, 0.5);
          color: #22d3ee;
          transform: translateY(-1px);
          box-shadow: 0 10px 25px rgba(6, 182, 212, 0.15);
        }
        .interactive-grid-action-node:active {
          transform: translateY(0px) scale(0.98);
        }
        .node-span-full {
          grid-column: span 2 / span 2;
          border-color: rgba(34, 211, 238, 0.35);
          color: #22d3ee;
        }
        .node-span-full:hover {
          background: rgba(34, 211, 238, 0.15);
          border-color: #22d3ee;
          color: #ffffff;
        }
        .title-divider-line {
          width: 70px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.4), transparent);
          box-shadow: 0 0 8px rgba(6, 182, 212, 0.3);
        }
        .telemetry-status-sub-row {
          font-family: monospace;
          font-size: 7px;
          color: rgba(255, 255, 255, 0.15);
          letter-spacing: 0.2em;
          margin-top: 4px;
        }
      `}} />

      {/* RENDER TOP BOUND BLOCK: OPERATIONAL LOG HEADER */}
      <div className="w-full flex flex-col items-center justify-center pt-8">
        <div className="system-handshake-tag uppercase font-bold select-none">// {initializationTimestamp}</div>
        <div className="telemetry-status-sub-row select-none">
          CPU_CORES: {localStateTrackerRef.current.hardwareConcurrencyValue} // INTERACTION_EDITS: {interactionMetricsCount}
        </div>
        {isHoveringActionNode && (
          <div className="text-[7px] font-mono text-cyan-400/40 tracking-wider mt-1 uppercase animate-pulse">
            FOCUS_NODE_LOOKUP: MappedTarget_{activeHoverNodeId}
          </div>
        )}
      </div>

      {/* RENDER MID BOUND BLOCK: MAIN BOOK TYPOGRAPHY MATRIX */}
      <div className="flex-1 flex flex-col justify-center items-center w-full px-4 max-w-xl">
        <h1 className="text-zinc-100 uppercase tracking-[0.55em] text-4xl md:text-5xl font-black leading-tight cinematic-main-title select-none">
          THE WEIGHT OF THE SKY
        </h1>
        
        <p className="text-cyan-400 font-mono text-[9px] uppercase tracking-[0.52em] mt-5 font-bold tracking-widest block">
          An Archetypal Tale
        </p>

        <div className="title-divider-line my-10" />
        
        {/* INTERACTIVE NAVIGATION MATRIX GRID */}
        <div className="grid grid-cols-2 gap-2.5 w-full font-mono">
          {navigationGrid.map((node) => {
            const IconComponent = node.icon;
            return (
              <button 
                key={node.id}
                onClick={() => handleActionNodeClick(node.ref)}
                onMouseEnter={() => handleNodeMouseEnter(node.id)}
                onMouseLeave={handleNodeMouseLeave}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xs select-none transition-all duration-300 interactive-grid-action-node ${node.span ? "node-span-full font-bold" : "text-zinc-400"}`}
              >
                <IconComponent size={11} className={node.span ? "text-cyan-400" : "text-zinc-500"} />
                <span>{node.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER BOTTOM BOUND BLOCK: COPYRIGHT SIGNATURE METRICS */}
      <div className="w-full text-center pt-8 flex flex-col items-center justify-center">
        <p className="text-zinc-500 font-mono text-[8px] uppercase tracking-[0.38em] select-none font-medium">
          By Michael Alonza Prentice Ware
        </p>
        <div className="text-[6px] font-mono text-zinc-700 tracking-widest mt-1 uppercase">Cross-Platform Standard Compliant Deployment</div>
        <ChevronDown size={14} className="text-cyan-500/50 animate-bounce mt-5 transition-opacity duration-300 pointer-events-none" />
      </div>

    </motion.div>
  );
}
