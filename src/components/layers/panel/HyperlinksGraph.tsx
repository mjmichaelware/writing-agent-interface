"use client";

import React, { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";
import { AgentService, type DualismRecord } from "@/services/bridge/agent.service";

export default function HyperlinksGraph() {
  const [dualisms, setDualisms] = useState<DualismRecord[]>([]);
  const [active, setActive] = useState<DualismRecord | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");

  useEffect(() => {
    let mounted = true;
    AgentService.getDualisms().then((data) => {
      if (!mounted) return;
      if (data.length > 0) {
        setDualisms(data);
        setActive(data[0]);
        setStatus("ready");
      } else {
        setStatus("empty");
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleSelect = (pair: DualismRecord) => {
    setActive(pair);
    if (pair.para_index !== undefined) {
      bus.emit("scroll:focus", { paraIndex: pair.para_index });
    }
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: "radial-gradient(circle at top, rgba(201,169,110,0.08) 0%, transparent 50%)" }}>

      {/* Header */}
      <div className="px-8 pt-10 pb-6">
        <p className="section-label mb-2">Parallelisms & Dualisms</p>
        <h2 className="font-serif text-3xl text-[var(--text-body)] leading-tight">
          The hidden lattice<br />
          <span className="italic text-[var(--text-muted)]">of the narrative.</span>
        </h2>
        {status === "loading" && (
          <p className="mt-4 font-serif italic text-sm text-[var(--text-muted)] animate-pulse-gold">
            Reading the graph...
          </p>
        )}
        {status === "empty" && (
          <p className="mt-4 font-serif italic text-sm text-[var(--text-muted)]">
            Dualisms will appear once the manuscript is ingested.
          </p>
        )}
      </div>

      {/* List */}
      {status === "ready" && (
        <div className="px-6 space-y-2 flex-shrink-0">
          {dualisms.map((pair) => (
            <button
              key={pair.id}
              onClick={() => handleSelect(pair)}
              className="w-full text-left rounded-2xl border p-5 transition-all duration-500 will-change-[background,border-color]"
              style={{
                background: active?.id === pair.id
                  ? "rgba(201,169,110,0.09)"
                  : "rgba(0,0,0,0.25)",
                borderColor: active?.id === pair.id
                  ? "rgba(201,169,110,0.38)"
                  : "rgba(255,255,255,0.07)",
              }}
            >
              <div className="font-serif italic text-[var(--text-body)] text-base leading-snug">
                {pair.term}
              </div>
              <div className="mt-1 font-serif text-sm text-[var(--text-muted)]">
                mirrors {pair.parallel}
              </div>
              <div
                className="mt-1 font-serif text-xs"
                style={{ color: "rgba(201,169,110,0.6)" }}
              >
                {pair.chapters}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail */}
      {active && status === "ready" && (
        <div
          className="mx-6 mt-5 mb-8 rounded-2xl p-6 flex-1"
          style={{
            background: "rgba(0,0,0,0.32)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="font-serif italic text-xl text-[var(--text-body)] leading-snug">
            {active.term}
          </div>
          <div
            className="font-serif italic text-base mt-0.5"
            style={{ color: "var(--accent-gold)" }}
          >
            — {active.parallel}
          </div>
          <p className="mt-4 font-serif text-sm leading-[1.75] text-[var(--text-muted)]">
            {active.note}
          </p>
          {active.para_index !== undefined && (
            <button
              onClick={() => bus.emit("scroll:focus", { paraIndex: active.para_index })}
              className="mt-5 font-serif italic text-sm transition-colors duration-300"
              style={{ color: "rgba(201,169,110,0.7)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(201,169,110,0.7)")}
            >
              Jump to passage →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
