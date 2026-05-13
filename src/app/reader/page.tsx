"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRuntime } from "@/runtime/runtimeContext";
import { initAudioListener } from "@/features/audioListener";
import { initDistortionListener } from "@/features/distortionListener";
import { initThematicListener } from "@/features/thematicListener";

type Block = {
  id: string;
  text: string;
  tone?: "neutral" | "intense" | "sacred";
};

type Chapter = {
  id: number;
  title: string;
  blocks: Block[];
};

export default function Reader() {
  const { bus, engine } = getRuntime();
  const [state, setState] = useState(engine.getState());
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockIndex, setBlockIndex] = useState(0);

  useEffect(() => {
    initAudioListener(bus);
    initDistortionListener(bus);
    initThematicListener(bus);

    const update = (s: any) => setState({ ...s });
    bus.on("state:change", update);

    // Fetch chapter from API
    fetch(`/api/chapters?slug=${state.chapter}`)
      .then(res => res.json())
      .then(data => {
        setChapter(data);
        bus.emit("chapter:load", data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load chapter:", err);
        setLoading(false);
      });

    return () => {};
  }, [bus, state.chapter]);

  const block = chapter?.blocks[blockIndex] || {
    text: "Loading chapter...",
    tone: "neutral",
  };

  useEffect(() => {
    if (block.text !== "Loading chapter...") {
      bus.emit("block:render", block);
    }
  }, [blockIndex, bus, block]);

  const advance = () => {
    if (blockIndex < (chapter?.blocks.length || 0) - 1) {
      setBlockIndex(blockIndex + 1);
      bus.emit("scroll:update", { depth: blockIndex + 1 });
    }
  };

  const retreat = () => {
    if (blockIndex > 0) {
      setBlockIndex(blockIndex - 1);
      bus.emit("scroll:update", { depth: blockIndex - 1 });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading chapter...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-8">

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 uppercase tracking-widest">
            Chapter {state.chapter} • Block {blockIndex + 1} / {chapter?.blocks.length || 0}
          </div>
          <Link href="/" className="text-xs text-cyan-400 uppercase hover:text-cyan-300">
            ← Back
          </Link>
        </div>

        <h2 className="text-xs uppercase tracking-[0.3em] text-slate-500 font-light">
          {chapter?.title || "Chapter"}
        </h2>

        <div className="py-12 border-l border-slate-700/50 pl-6">
          <p className="text-lg md:text-2xl font-serif leading-relaxed">
            {block.text}
          </p>
          <p className="text-xs text-slate-600 mt-4">Tone: {block.tone}</p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={retreat}
            disabled={blockIndex === 0}
            className="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-30 hover:border-white/50 transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={advance}
            disabled={blockIndex === (chapter?.blocks.length || 0) - 1}
            className="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-30 hover:border-white/50 transition-colors"
          >
            Next →
          </button>
        </div>

        <div className="text-xs text-gray-600 text-center pt-8">
          Dynamic chapter parser • Device-responsive blocks
        </div>
      </div>
    </main>
  );
}
