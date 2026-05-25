"use client";
import { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";

type Paragraph = {
  id: string;
  content: string;
  chapter_number?: number;
  archetypal_weights?: { self?: number; anima?: number; shadow?: number; persona?: number; hero?: number };
};

const ARCHETYPE_COLORS: Record<string, string> = {
  self: "#c9a96e", anima: "#e8d4a0", shadow: "#2a2a2a",
  persona: "#8a857c", hero: "#d4a574",
};

export default function ArchetypesDirectory() {
  const [paragraphs, setParagraphs] = useState<Paragraph[] | null>(null);
  const [activeArc, setActiveArc] = useState<{ dom: string; weights: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    fetch("/api/graph", { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        clearTimeout(timeout);
        const ps: Paragraph[] = (d.dualisms || []).filter((p: any) => 
          p && p.archetypal_weights && typeof p.archetypal_weights === "object"
        );
        setParagraphs(ps);
      })
      .catch(e => {
        clearTimeout(timeout);
        setError(e.name === "AbortError" 
          ? "Archetype timeline timed out" 
          : "Could not load archetypes");
      });
    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  useEffect(() => {
    const handleFocus = (e: any) => {
      if (!e?.weights) return;
      const w = e.weights;
      let max = 0; let dom = "self";
      for (const k of Object.keys(w)) {
        if ((w[k] || 0) > max) { max = w[k]; dom = k; }
      }
      setActiveArc({ dom, weights: w });
    };
    bus.on("scroll:focus", handleFocus);
    return () => { bus.off("scroll:focus", handleFocus); };
  }, []);

  const dominant = (w: any) => {
    let max = 0; let dom = "self";
    for (const k of Object.keys(w || {})) {
      if ((w[k] || 0) > max) { max = w[k]; dom = k; }
    }
    return dom;
  };

  if (error) return <div className="panel-empty-state">{error}</div>;
  if (!paragraphs) return <div className="panel-loading">Loading archetype timeline…</div>;
  if (paragraphs.length === 0) 
    return <div className="panel-empty-state">No archetype data available yet</div>;

  const byChapter: Record<number, Paragraph[]> = {};
  for (const p of paragraphs) {
    const ch = p.chapter_number ?? 0;
    if (!byChapter[ch]) byChapter[ch] = [];
    byChapter[ch].push(p);
  }

  return (
    <div>
      <h2 className="panel-heading">Archetypes</h2>
      {activeArc && (
        <div className="archetype-live">
          <span style={{ color: "var(--text-muted)" }}>Active paragraph:</span>{" "}
          <strong style={{ 
            color: ARCHETYPE_COLORS[activeArc.dom] || "var(--accent-gold)", 
            textTransform: "capitalize", fontFamily: "var(--font-title)" 
          }}>
            {activeArc.dom}
          </strong>
        </div>
      )}
      <div className="archetype-timeline">
        {Object.keys(byChapter).sort((a, b) => +a - +b).map(ch => (
          <div key={ch} className="archetype-chapter">
            <div className="archetype-chapter-label">
              Chapter {ch === "0" ? "—" : ch}
            </div>
            <div className="archetype-rail">
              {byChapter[+ch].map((p, idx) => {
                const dom = dominant(p.archetypal_weights);
                return (
                  <button key={p.id}
                    className="archetype-dot"
                    style={{ 
                      background: ARCHETYPE_COLORS[dom] || "#c9a96e",
                      border: dom === "shadow" ? "1px solid #8a857c" : "none",
                      left: `${(idx / Math.max(1, byChapter[+ch].length - 1)) * 100}%`,
                    }}
                    title={dom}
                    onClick={() => {
                      bus.emit("navigate:paragraph", { id: p.id });
                      bus.emit("panel:close");
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="dualism-legend">
        <div className="dualism-legend-item">
          <span className="dualism-dot" style={{ background: "#c9a96e" }} /><span>Self</span>
        </div>
        <div className="dualism-legend-item">
          <span className="dualism-dot" style={{ background: "#e8d4a0" }} /><span>Anima</span>
        </div>
        <div className="dualism-legend-item">
          <span className="dualism-dot" style={{ background: "#2a2a2a", border: "1px solid #8a857c" }} /><span>Shadow</span>
        </div>
        <div className="dualism-legend-item">
          <span className="dualism-dot" style={{ background: "#8a857c" }} /><span>Persona</span>
        </div>
        <div className="dualism-legend-item">
          <span className="dualism-dot" style={{ background: "#d4a574" }} /><span>Hero</span>
        </div>
      </div>
    </div>
  );
}