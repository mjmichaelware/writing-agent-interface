"use client";

import React, { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";
import { AgentService, type ArchetypeRecord } from "@/services/bridge/agent.service";

export default function ArchetypesDirectory() {
  const [archetypes, setArchetypes] = useState<ArchetypeRecord[]>([]);
  const [active, setActive] = useState<ArchetypeRecord | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");
  const [activeParaIndex, setActiveParaIndex] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    AgentService.getArchetypes().then((data) => {
      if (!mounted) return;
      if (data.length > 0) {
        setArchetypes(data);
        setActive(data[0]);
        setStatus("ready");
      } else {
        setStatus("empty");
      }
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    return bus.on("scroll:focus", (data: any) => {
      setActiveParaIndex(data?.paraIndex ?? 0);
    });
  }, []);

  return (
    <div className="min-h-full flex flex-col" style={{ background: "radial-gradient(circle at top, rgba(201,169,110,0.06) 0%, transparent 50%)" }}>

      {/* Header */}
      <div className="px-8 pt-10 pb-6">
        <p className="section-label mb-2">Jungian Archetypes</p>
        <h2 className="font-serif text-3xl text-[var(--text-body)] leading-tight">
          Characters as<br />
          <span className="italic text-[var(--text-muted)]">psychic weather.</span>
        </h2>
        <div
          className="mt-3 font-serif italic text-xs"
          style={{ color: "rgba(201,169,110,0.55)" }}
        >
          Reading position: paragraph {activeParaIndex}
        </div>
        {status === "loading" && (
          <p className="mt-4 font-serif italic text-sm text-[var(--text-muted)] animate-pulse-gold">
            Mapping the psyche...
          </p>
        )}
        {status === "empty" && (
          <p className="mt-4 font-serif italic text-sm text-[var(--text-muted)]">
            Archetypes will appear once the manuscript is ingested.
          </p>
        )}
      </div>

      {/* List */}
      {status === "ready" && (
        <div className="px-6 space-y-2 flex-shrink-0">
          {archetypes.map((type) => (
            <button
              key={type.name}
              onClick={() => setActive(type)}
              className="w-full text-left rounded-2xl border p-5 transition-all duration-500"
              style={{
                background: active?.name === type.name
                  ? "rgba(201,169,110,0.09)"
                  : "rgba(0,0,0,0.25)",
                borderColor: active?.name === type.name
                  ? "rgba(201,169,110,0.38)"
                  : "rgba(255,255,255,0.07)",
              }}
            >
              <div className="font-serif italic text-base text-[var(--text-body)] leading-snug">
                {type.name}
              </div>
              <div className="mt-1 font-serif text-sm text-[var(--text-muted)]">
                {type.character}
              </div>
              <div
                className="mt-1 font-serif text-xs italic"
                style={{ color: "rgba(201,169,110,0.5)" }}
              >
                {type.development}
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
          <div className="font-serif italic text-xs text-[var(--text-muted)] mb-3">
            {active.development}
          </div>
          <div className="font-serif italic text-xl text-[var(--text-body)] leading-snug mb-1">
            {active.name}
          </div>
          <div
            className="font-serif text-sm mb-4"
            style={{ color: "var(--accent-gold)" }}
          >
            {active.character}
          </div>
          <p className="font-serif text-sm leading-[1.75] text-[var(--text-muted)]">
            {active.description}
          </p>
        </div>
      )}
    </div>
  );
}
