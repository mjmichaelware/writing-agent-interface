"use client";

import React, { useEffect, useState, useRef } from "react";
import { bus } from "@/core/runtimeEngine";
import { AgentService, type DualismRecord } from "@/services/bridge/agent.service";
import { motion, AnimatePresence } from "framer-motion";

export default function HyperlinksGraph() {
  const [dualisms, setDualisms] = useState<DualismRecord[]>([]);
  const [active, setActive] = useState<DualismRecord | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");

  useEffect(() => {
    AgentService.getDualisms().then((data) => {
      if (data.length > 0) {
        setDualisms(data);
        setActive(data[0]);
        setStatus("ready");
      } else {
        setStatus("empty");
      }
    });
  }, []);

  return (
    <div className="min-h-full flex flex-col relative overflow-hidden bg-[#050507]">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-gradient-to-b from-[#c9a96e]/20 to-transparent blur-[120px]" />
      </div>

      {/* Header */}
      <div className="px-8 pt-10 pb-6 z-10">
        <p className="section-label mb-2 tracking-[0.2em] opacity-60 uppercase text-[10px]">Semantic Topology</p>
        <h2 className="font-serif text-3xl text-[var(--text-body)] leading-tight">
          The Narrative<br />
          <span className="italic text-[var(--text-muted)]">lattice.</span>
        </h2>
      </div>

      {/* Interactive Graph Surface */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        {status === "loading" && (
          <div className="font-serif italic text-sm text-[var(--text-muted)] animate-pulse-gold">
            Calculating nodal intersections...
          </div>
        )}

        {status === "ready" && (
          <div className="w-full h-full relative">
            {/* SVG Link Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
              {dualisms.slice(0, 12).map((_, i) => (
                <line
                  key={`line-${i}`}
                  x1="50%" y1="50%"
                  x2={`${15 + Math.random() * 70}%`}
                  y2={`${15 + Math.random() * 70}%`}
                  stroke="var(--accent-gold)"
                  strokeWidth="0.5"
                />
              ))}
            </svg>

            {/* Interactive Nodes */}
            <div className="absolute inset-0 flex flex-wrap gap-4 items-center justify-center content-center">
              {dualisms.slice(0, 18).map((pair) => (
                <motion.button
                  key={pair.id}
                  onClick={() => setActive(pair)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: active?.id === pair.id ? 1 : 0.35,
                    scale: active?.id === pair.id ? 1.15 : 1,
                    borderColor: active?.id === pair.id ? "rgba(201,169,110,0.8)" : "rgba(255,255,255,0.08)"
                  }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                  className="px-4 py-2 rounded-full border bg-black/40 backdrop-blur-md text-[10px] font-serif tracking-[0.15em] uppercase transition-colors"
                >
                  {pair.term}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            className="mx-6 mb-8 p-8 rounded-[32px] bg-black/60 border border-white/5 backdrop-blur-3xl z-20"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[var(--accent-gold)] text-[9px] tracking-[0.4em] uppercase mb-2 font-bold">
                  Dualism Record
                </div>
                <h3 className="font-serif italic text-2xl text-[var(--text-body)] leading-tight">
                  {active.term} <span className="text-[var(--text-muted)] not-italic mx-2 opacity-30">/</span> {active.parallel}
                </h3>
              </div>
            </div>

            <p className="font-serif text-sm leading-[1.85] text-[var(--text-muted)] mb-8">
              {active.note}
            </p>

            <div className="flex items-center gap-6">
              <button
                onClick={() => active.para_index !== undefined && bus.emit("scroll:focus", { paraIndex: active.para_index })}
                className="text-[var(--accent-gold)] text-[10px] tracking-[0.25em] uppercase font-bold hover:tracking-[0.35em] transition-all duration-500"
              >
                Jump to Node →
              </button>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              <div className="text-[var(--text-muted)] text-[9px] tracking-widest opacity-40 font-mono">
                SIG: {active.chapters || "v1.0"}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
