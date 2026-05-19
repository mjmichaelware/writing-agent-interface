"use client";

import React, { useState } from "react";
import { AgentService } from "@/services/bridge/agent.service";

export default function WritingAgentConsole() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"IDLE" | "RUNNING" | "COMPLETE" | "ERROR">("IDLE");
  const [output, setOutput] = useState("");

  const handleExecute = async () => {
    try {
      setStatus("RUNNING");
      setOutput("");
      const data = await AgentService.queryNarrative(input, "Current Chapter");
      setOutput(data.response || data.result || JSON.stringify(data, null, 2));
      setStatus("COMPLETE");
    } catch (err) {
      setStatus("ERROR");
      setOutput(err instanceof Error ? err.message : "Agent Kernel disconnected.");
    }
  };

  return (
    <div className="min-h-full p-6 text-[#e8e4dc] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,.12),transparent_45%)]">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Writing Agent / {status}
        </div>
        <div className="mt-2 font-serif text-2xl italic">Private kernel gateway.</div>
      </div>
      <div className="rounded-3xl border border-emerald-500/10 bg-black/40 p-4 shadow-2xl">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="h-36 w-full resize-none rounded-2xl border border-white/10 bg-[#050507] p-4 font-serif text-sm leading-7 text-zinc-300 outline-none transition focus:border-emerald-500/40" placeholder="Ask the narrative engine what the chapter is hiding..." />
        <button onClick={handleExecute} disabled={!input.trim() || status === "RUNNING"} className="mt-4 w-full rounded-full border border-emerald-500/30 px-4 py-3 text-[10px] uppercase tracking-widest text-emerald-300 transition hover:bg-emerald-500/10 disabled:opacity-30">
          {status === "RUNNING" ? "Consulting Kernel..." : "Execute Query"}
        </button>
      </div>
      {output && <pre className="mt-5 max-h-56 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/50 p-4 text-[10px] leading-5 text-zinc-400">{output}</pre>}
    </div>
  );
}
