"use client";

import React, { useState } from "react";
import { AgentService } from "@/services/bridge/agent.service";

type Status = "LOCKED" | "READY" | "RUNNING" | "COMPLETE" | "ERROR";

export default function SystemTab() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>("LOCKED");

  const submitPin = (value: string) => {
    if (value === "1003") {
      setTimeout(() => { setUnlocked(true); setStatus("READY"); }, 300);
      return;
    }
    setError(true);
    setTimeout(() => { setPin(""); setError(false); }, 500);
  };

  const handleKey = (key: string) => {
    if (error) return;
    if (key === "DEL") { setPin((p) => p.slice(0, -1)); return; }
    if (key === "ENT") { if (pin.length === 4) submitPin(pin); return; }
    if (!/^\d$/.test(key) || pin.length >= 4) return;
    const next = pin + key;
    setPin(next);
    if (next.length === 4) submitPin(next);
  };

  const execute = async () => {
    if (!input.trim() || status === "RUNNING") return;
    try {
      setStatus("RUNNING");
      setOutput("");
      const data = await AgentService.queryNarrative(
        input,
        "Weight of the Sky — Writing Agent Console"
      );
      setOutput(data.response || data.result || JSON.stringify(data, null, 2));
      setStatus("COMPLETE");
    } catch (err) {
      setStatus("ERROR");
      setOutput(err instanceof Error ? err.message : "Agent kernel disconnected.");
    }
  };

  // PIN Gate
  if (!unlocked) {
    return (
      <div
        className="min-h-full flex flex-col"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(201,169,110,0.09) 0%, transparent 50%)" }}
      >
        <div className="px-8 pt-10 pb-6">
          <p className="section-label mb-2">System Gateway</p>
          <h2 className="font-serif text-3xl text-[var(--text-body)] leading-tight">
            Private kernel<br />
            <span className="italic text-[var(--text-muted)]">authorization.</span>
          </h2>
          <p className="mt-4 font-serif text-sm leading-[1.75] text-[var(--text-muted)]">
            Unlocks the protected author-side intelligence without exposing internal system metadata to the reader surface.
          </p>
        </div>

        {/* PIN dots */}
        <div className="flex justify-center gap-5 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                background: error
                  ? "var(--descent)"
                  : i < pin.length
                  ? "var(--text-body)"
                  : "rgba(255,255,255,0.12)",
                boxShadow: error
                  ? "0 0 14px rgba(107,44,44,0.7)"
                  : i < pin.length
                  ? "0 0 12px rgba(232,228,220,0.35)"
                  : "none",
              }}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="px-8">
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <div className="grid grid-cols-3 gap-3">
              {["1","2","3","4","5","6","7","8","9","DEL","0","ENT"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className="aspect-square rounded-xl font-serif text-base text-[var(--text-muted)] transition-all duration-200 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.1)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.3)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-body)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                  }}
                >
                  {key === "DEL" ? "⌫" : key === "ENT" ? "↵" : key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unlocked — Writing Agent Console
  return (
    <div
      className="min-h-full flex flex-col"
      style={{ background: "radial-gradient(circle at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 50%)" }}
    >
      <div className="px-8 pt-10 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-2 h-2 rounded-full animate-pulse-gold"
            style={{ background: "#10b981" }}
          />
          <p
            className="font-serif italic text-xs"
            style={{ color: "#10b981" }}
          >
            Writing Agent — {status}
          </p>
        </div>
        <h2 className="font-serif text-3xl text-[var(--text-body)] leading-tight">
          Author-side<br />
          <span className="italic text-[var(--text-muted)]">narrative intelligence.</span>
        </h2>
        <p className="mt-3 font-serif text-sm leading-[1.75] text-[var(--text-muted)]">
          Query motifs, continuity, symbolism, chapter logic, or revision strategy through the protected kernel.
        </p>
      </div>

      <div className="px-6 flex-1 flex flex-col gap-4 pb-8">
        <div className="flex gap-2">
          <a 
            href="/analyze"
            className="flex-1 rounded-xl py-2 px-4 border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] font-serif text-xs text-center hover:bg-[var(--accent-gold)]/10 transition-all"
          >
            Open Document Analyzer
          </a>
          <button
            className="flex-1 rounded-xl py-2 px-4 border border-white/10 text-white font-serif text-xs text-center opacity-40 cursor-default"
          >
            System Diagnostic
          </button>
        </div>

        <div
          className="rounded-2xl p-1"
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(16,185,129,0.15)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-36 resize-none bg-transparent p-4 font-serif text-sm leading-[1.75] text-[var(--text-body)] outline-none placeholder:text-[var(--text-muted)] placeholder:italic"
            placeholder="Ask the narrative engine what this chapter is hiding..."
          />
        </div>

        <button
          onClick={execute}
          disabled={!input.trim() || status === "RUNNING"}
          className="w-full rounded-2xl py-3.5 font-serif italic text-sm transition-all duration-300 disabled:opacity-30"
          style={{
            border: "1px solid rgba(16,185,129,0.3)",
            color: "#10b981",
            background: status === "RUNNING"
              ? "rgba(16,185,129,0.08)"
              : "transparent",
          }}
          onMouseEnter={e => {
            if (input.trim() && status !== "RUNNING") {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(16,185,129,0.1)";
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background =
              status === "RUNNING" ? "rgba(16,185,129,0.08)" : "transparent";
          }}
        >
          {status === "RUNNING" ? "Consulting the kernel..." : "Execute query"}
        </button>

        {output && (
          <div
            className="rounded-2xl p-5 flex-1 overflow-auto"
            style={{
              background: "rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <pre className="font-serif text-xs leading-[1.8] text-[var(--text-muted)] whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
