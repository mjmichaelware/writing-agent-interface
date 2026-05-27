/* ==================== FILE: src/components/layers/panel/IndexTab.tsx ==================== */

"use client";

import React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

interface IndexTabProps {
  chapter: number;
  setChapter: (n: number) => void;
  onClose: () => void;
  manuscriptRef: React.RefObject<HTMLDivElement | null>;
  TITLES: Record<number, string>;
  CHAPTER_NUMS: number[];
}

export default function IndexTab({
  chapter,
  setChapter,
  onClose,
  manuscriptRef,
  TITLES,
  CHAPTER_NUMS,
}: IndexTabProps) {
  return (
    <div className="space-y-4 font-mono text-xs px-1">
      <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
        <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-500 font-bold">// QUICK NAVIGATION INDEX</span>
        <Link href="/runtime" className="text-[9px] text-cyan-400 hover:underline flex items-center gap-1 font-bold">
          <Eye size={10} /> /runtime logs
        </Link>
      </div>
      <div className="flex flex-col gap-1 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
        {CHAPTER_NUMS.map((n) => (
          <button
            key={n}
            onClick={() => {
              setChapter(n);
              onClose();
              setTimeout(() => {
                if (manuscriptRef.current) {
                  manuscriptRef.current.scrollIntoView({ behavior: "smooth" });
                }
              }, 120);
            }}
            className={`p-2.5 text-left border rounded-xs transition-all ${chapter === n ? "bg-cyan-950/20 border-cyan-800/60 text-cyan-400 shadow-md" : "bg-zinc-900/10 hover:bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-zinc-200"}`}
          >
            {TITLES[n]}
          </button>
        ))}
      </div>
    </div>
  );
}


