"use client";

import React, { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";
import { AgentService, type ConcordanceRecord } from "@/services/bridge/agent.service";

export default function BiblicalReferencesDirectory() {
  const [refs, setRefs] = useState<ConcordanceRecord[]>([]);
  const [active, setActive] = useState<ConcordanceRecord | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");

  useEffect(() => {
    let mounted = true;
    AgentService.searchConcordance("biblical").then((data) => {
      if (!mounted) return;
      if (data.length > 0) {
        setRefs(data);
        setActive(data[0]);
        setStatus("ready");
      } else {
        setStatus("empty");
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleSelect = (item: ConcordanceRecord) => {
    setActive(item);
    if (item.para_index !== undefined) {
      bus.emit("scroll:focus", { paraIndex: item.para_index });
    }
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: "radial-gradient(circle at top, rgba(201,169,110,0.07) 0%, transparent 50%)" }}>

      {/* Header */}
      <div className="px-8 pt-10 pb-6">
        <p className="section-label mb-2">Biblical References</p>
        <h2 className="font-serif text-3xl text-[var(--text-body)] leading-tight">
          Scripture woven<br />
          <span className="italic text-[var(--text-muted)]">into the prose.</span>
        </h2>
        {status === "loading" && (
          <p className="mt-4 font-serif italic text-sm text-[var(--text-muted)] animate-pulse-gold">
            Searching the concordance...
          </p>
        )}
        {status === "empty" && (
          <p className="mt-4 font-serif italic text-sm text-[var(--text-muted)]">
            References will appear once the manuscript is ingested.
          </p>
        )}
      </div>

      {/* List */}
      {status === "ready" && (
        <div className="px-6 space-y-2 flex-shrink-0">
          {refs.map((item) => (
            <button
              key={`${item.ref}-${item.title}`}
              onClick={() => handleSelect(item)}
              className="w-full text-left rounded-2xl border p-5 transition-all duration-500"
              style={{
                background: active?.ref === item.ref
                  ? "rgba(201,169,110,0.09)"
                  : "rgba(0,0,0,0.25)",
                borderColor: active?.ref === item.ref
                  ? "rgba(201,169,110,0.38)"
                  : "rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="font-serif text-xs mb-1"
                style={{ color: "var(--accent-gold)" }}
              >
                {item.ref}
              </div>
              <div className="font-hebrew italic text-base text-[var(--text-body)] leading-snug">
                {item.title}
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
          <div
            className="font-serif text-xs mb-3"
            style={{ color: "var(--accent-gold)" }}
          >
            {active.ref}
          </div>
          <div className="font-serif italic text-xl text-[var(--text-body)] leading-snug mb-4">
            {active.title}
          </div>
          {active.passage && (
            <blockquote
              className="font-serif italic text-sm leading-[1.75] mb-4 pl-4"
              style={{
                color: "var(--text-muted)",
                borderLeft: "2px solid rgba(201,169,110,0.28)",
              }}
            >
              "{active.passage}"
            </blockquote>
          )}
          <p className="font-serif text-sm leading-[1.75] text-[var(--text-muted)]">
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
