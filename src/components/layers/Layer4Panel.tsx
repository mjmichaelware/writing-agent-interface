"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Layer4PanelProps {
  open: boolean;
  onClose: () => void;
  cp: any;
  chapter: number | null;
  setChapter: (n: number) => void;
  manuscriptRef: React.RefObject<HTMLDivElement>;
  TITLES: Record<number, string>;
  CHAPTER_NUMS: number[];
  depth: number;
  setOpen: (b: boolean) => void;
}

type Tab = "chapters" | "style" | "references";

export default function Layer4Panel({
  open,
  cp,
  chapter,
  setChapter,
  TITLES,
  CHAPTER_NUMS,
  depth,
  setOpen
}: Layer4PanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("chapters");

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--text-muted)]/20 bg-[var(--bg-void)]/70 backdrop-blur-md select-none transition-all duration-700 ease-in-out">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <p className="font-serif text-sm italic tracking-wide text-[var(--text-muted)] drop-shadow-md">
            {depth < 0.05 || !chapter
              ? "The Weight of the Sky"
              : TITLES[chapter]}
          </p>

          <button
            onClick={() => setOpen(!open)}
            className="font-serif text-[var(--text-muted)] transition-colors duration-500 hover:text-[var(--accent-gold)]"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-transparent">
          <div
            className="h-full bg-[var(--accent-gold)]/60 transition-all duration-100 ease-out"
            style={{
              width: `${Math.min(100, depth * 100)}%`
            }}
          />
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="fixed left-0 right-0 top-14 z-50 border-b border-[var(--text-muted)]/20 bg-[var(--bg-void)]/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="mx-auto max-w-4xl px-6 py-8">
              <div className="mb-8 flex gap-8 border-b border-[var(--text-muted)]/20">
                {(["chapters", "style", "references"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative pb-2 font-serif text-sm transition-colors duration-500 ${
                      activeTab === tab
                        ? "text-[var(--text-body)]"
                        : "text-[var(--text-muted)] hover:text-[var(--accent-gold)]"
                    }`}
                  >
                    {tab}

                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--accent-gold)]"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="max-h-[60vh] min-h-[40vh] overflow-y-auto">
                {activeTab === "chapters" && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {CHAPTER_NUMS.map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setChapter(num);
                          setOpen(false);
                        }}
                        className={`group flex items-center justify-between border-l-2 p-4 text-left transition-all duration-500 ${
                          chapter === num
                            ? "border-[var(--accent-gold)] bg-[var(--accent-gold)]/5"
                            : "border-transparent hover:border-[var(--accent-gold)]/30 hover:bg-[var(--text-muted)]/5"
                        }`}
                      >
                        <span className="font-serif text-[var(--text-body)] transition-colors duration-500 group-hover:text-[var(--accent-gold)]">
                          {TITLES[num]}
                        </span>

                        <span className="font-serif text-sm italic text-[var(--text-muted)]">
                          Chapter {num}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === "style" && (
                  <div className="max-w-md space-y-8">
                    <p className="mb-4 font-serif text-sm italic text-[var(--text-muted)]">
                      Adjust the physical weight of the prose to match the operational environment.
                    </p>

                    <div className="space-y-4">
                      <div className="flex justify-between font-serif text-sm text-[var(--text-body)]">
                        <span>Typographic Scale</span>

                        <span>{cp.state?.fontScale || 1.125}x</span>
                      </div>

                      <input
                        type="range"
                        min="0.8"
                        max="1.5"
                        step="0.05"
                        value={cp.state?.fontScale || 1.125}
                        onChange={(e) =>
                          cp.update({
                            fontScale: parseFloat(e.target.value)
                          })
                        }
                        className="w-full accent-[var(--accent-gold)] opacity-70 transition-opacity hover:opacity-100"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "references" && (
                  <div className="max-w-xl">
                    <p className="mb-6 font-serif text-sm italic text-[var(--text-muted)]">
                      The Concordance. Search the 181 narrative nodes.
                    </p>

                    <input
                      type="text"
                      placeholder="Enter semantic query..."
                      className="w-full border-b border-[var(--text-muted)]/40 bg-transparent py-3 font-serif text-[var(--text-body)] transition-colors duration-500 placeholder:text-[var(--text-muted)]/50 focus:border-[var(--accent-gold)] focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
