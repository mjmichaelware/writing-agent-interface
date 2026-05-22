"use client";

import React, { useState } from "react";
import { AgentService } from "@/services/bridge/agent.service";
import { motion, AnimatePresence } from "framer-motion";

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
      setTimeout(() => { setUnlocked(true); setStatus("READY"); }, 400);
      return;
    }
    setError(true);
    setTimeout(() => { setPin(""); setError(false); }, 600);
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
      setOutput(data.result || JSON.stringify(data, null, 2));
      setStatus("COMPLETE");
    } catch (err) {
      setStatus("ERROR");
      setOutput(err instanceof Error ? err.message : "Agent kernel disconnected.");
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#050507]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(201,169,110,0.05)_0%,_transparent_60%)]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[320px] z-10 px-8"
        >
          <div className="text-center mb-12">
            <div className="text-[10px] tracking-[0.4em] text-[var(--accent-gold)] uppercase font-bold mb-4">Kernel Access</div>
            <h2 className="font-serif text-3xl text-[var(--text-body)] leading-tight italic">
              Authorization Required.
            </h2>
          </div>

          <div className="flex justify-center gap-6 mb-12">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: i < pin.length ? 1.2 : 1,
                  backgroundColor: error ? "#6b2c2c" : i < pin.length ? "#e8e4dc" : "rgba(255,255,255,0.05)"
                }}
                className="w-4 h-4 rounded-full border border-white/5 shadow-2xl"
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["1","2","3","4","5","6","7","8","9","DEL","0","ENT"].map((key) => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                className="aspect-square rounded-2xl bg-white/[0.02] border border-white/[0.05] font-serif text-lg text-[var(--text-muted)] hover:bg-[var(--accent-gold)]/10 hover:text-white transition-all active:scale-95"
              >
                {key === "DEL" ? "⌫" : key === "ENT" ? "↵" : key}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col bg-[#050507] p-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_12px_#10b981] animate-pulse" />
            <span className="text-[9px] tracking-[0.3em] text-[#10b981] uppercase font-bold">Author Intel v4.0</span>
          </div>
          <h2 className="font-serif text-3xl text-[var(--text-body)] italic leading-tight">Narrative Swarm.</h2>
        </div>
        <div className="flex gap-4">
          <a href="/analyze" className="px-4 py-2 rounded-full border border-white/10 text-[9px] tracking-widest uppercase hover:bg-white/5 transition-all">Doc Analyzer</a>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 font-serif text-base text-[var(--text-body)] outline-none placeholder:text-white/10 resize-none transition-all focus:border-[#10b981]/30 focus:bg-white/[0.04]"
            placeholder="Query the kernel for narrative drift..."
          />
          <button
            onClick={execute}
            disabled={!input.trim() || status === "RUNNING"}
            className="absolute bottom-6 right-6 px-6 py-3 rounded-full bg-[#10b981] text-black text-[10px] tracking-widest uppercase font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
          >
            {status === "RUNNING" ? "Processing..." : "Execute"}
          </button>
        </div>

        <AnimatePresence>
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 rounded-[32px] bg-black/40 border border-white/5 p-8 overflow-auto scrollbar-hide"
            >
              <pre className="font-serif text-sm leading-[1.8] text-[var(--text-muted)] whitespace-pre-wrap">
                {output}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
