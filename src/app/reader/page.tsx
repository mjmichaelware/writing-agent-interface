"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRuntime } from "@/runtime/runtimeContext";
import { chapter7 } from "@/data/chapter7";
import { initAudioListener } from "@/features/audioListener";
import { initDistortionListener } from "@/features/distortionListener";
import { initThematicListener } from "@/features/thematicListener";

export default function Reader() {
  const { bus, engine } = getRuntime();
  const [state, setState] = useState(engine.getState());

  useEffect(() => {
    initAudioListener(bus);
    initDistortionListener(bus);
    initThematicListener(bus);

    const update = (s: any) => setState({ ...s });
    bus.on("state:change", update);
    bus.emit("chapter:load", chapter7);

    return () => {};
  }, [bus]);

  const block = chapter7.blocks[state.blockIndex] || {
    text: "Content unavailable (safe mode fallback).",
    tone: "neutral",
  };

  useEffect(() => {
    bus.emit("block:render", block);
  }, [state.blockIndex, bus, block]);

  const advance = () => {
    engine.dispatch({ type: "ADVANCE_BLOCK", payload: 1 });
    bus.emit("scroll:update", { depth: engine.getState().blockIndex });
  };

  const retreat = () => {
    engine.dispatch({ type: "ADVANCE_BLOCK", payload: -1 });
    bus.emit("scroll:update", { depth: engine.getState().blockIndex });
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 uppercase tracking-widest">
            Chapter {state.chapter} • Block {state.blockIndex + 1} / {chapter7.blocks.length} • Mode {state.mode}
          </div>
          <Link href="/" className="text-xs text-cyan-400 uppercase hover:text-cyan-300">
            ← Back
          </Link>
        </div>

        <h2 className="text-xs uppercase tracking-[0.3em] text-slate-500 font-light">
          {chapter7.title}
        </h2>

        <div className="py-12 border-l border-slate-700/50 pl-6">
          <p className="text-lg md:text-2xl font-serif leading-relaxed">
            {block.text}
          </p>
          <p className="text-xs text-slate-600 mt-4">Tone: {block.tone}</p>
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={retreat} disabled={state.blockIndex === 0} className="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-30 hover:border-white/50 transition-colors">
            ← Previous
          </button>
          <button onClick={advance} disabled={state.blockIndex === chapter7.blocks.length - 1} className="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-30 hover:border-white/50 transition-colors">
            Next →
          </button>
        </div>

        <div className="text-xs text-gray-600 text-center pt-8">
          Cinematic Layer v1 (check console for event log)
        </div>
      </div>
    </main>
  );
}
