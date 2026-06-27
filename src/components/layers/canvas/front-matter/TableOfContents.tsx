"use client";

import React, { useEffect, useState } from "react";

const ROMAN: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI",
  7: "VII", 8: "VIII", 9: "IX", 10: "X", 11: "XI", 12: "XII", 13: "XIII",
  14: "XIV", 15: "XV", 16: "XVI", 17: "XVII", 18: "XVIII", 19: "XIX",
  20: "XX", 21: "XXI", 22: "XXII", 23: "XXIII", 24: "XXIV", 25: "XXV",
};

const PART_LABELS: Record<string, string> = {
  "1": "Part I — The Journey",
  "2": "Part II — The Deception & Reveal",
  "3": "Part III — The Cosmic Union",
  "epilogue": "Epilogue",
};

interface Props {
  onLoadChapter: (n: number) => void;
}

export default function TableOfContents({ onLoadChapter }: Props) {
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    fetch("/api/chapters", { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        clearTimeout(timeout);
        setChapters(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(e => {
        clearTimeout(timeout);
        setError(e.name === "AbortError" ? "Table of contents timed out" : "Could not load chapters");
        setLoading(false);
      });

    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  const grouped = chapters.reduce<Record<string, any[]>>((acc, c) => {
    const part = String(c.part_number ?? "1");
    if (!acc[part]) acc[part] = [];
    acc[part].push(c);
    return acc;
  }, {});

  return (
    <section id="toc" className="min-h-screen px-6 scroll-mt-24 pb-32">
      <h2 className="section-label text-center">Table of Contents</h2>

      <div className="reader-column">
        {loading && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="toc-skeleton-row" style={{ width: `${65 + (i % 4) * 8}%` }} />
            ))}
          </>
        )}

        {error && <div className="panel-empty-state">{error}</div>}

        {!loading && !error && Object.entries(PART_LABELS).map(([partKey, partLabel]) => {
          const partChapters = grouped[partKey] || [];
          if (partChapters.length === 0) return null;

          return (
            <React.Fragment key={partKey}>
              <h3 className="toc-part-heading">{partLabel}</h3>
              {partChapters.map((c: any) => {
                const numeral = ROMAN[c.chapter_number] || String(c.chapter_number);
                const isDrafted = c.status === "drafted";
                return isDrafted ? (
                  <button
                    key={c.id}
                    onClick={() => onLoadChapter(c.chapter_number)}
                    className="toc-row"
                  >
                    <span className="toc-title">{c.title}</span>
                    <span className="toc-numeral">{numeral}</span>
                  </button>
                ) : (
                  <div key={c.id} className="toc-row toc-disabled">
                    <span className="toc-title">{c.title || "—"}</span>
                    <span className="toc-numeral">{numeral}</span>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
