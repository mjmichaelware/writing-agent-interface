"use client";
import { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";

type P = { id: string; content: string; chapter_number?: number; archetypal_weights?: any };

const COLORS: Record<string, string> = {
  self: "#c9a96e", anima: "#e8d4a0", shadow: "#2a2a2a", persona: "#8a857c", hero: "#d4a574",
};

export default function ArchetypesDirectory() {
  const [ps, setPs] = useState<P[] | null>(null);
  const [active, setActive] = useState<{ dom: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/graph")
      .then(r => r.json())
      .then(d => {
        const raw = d.paragraphs || [];
        setPs(raw.filter((p: any) => p && p.archetypal_weights && Object.keys(p.archetypal_weights).length > 0));
      })
      .catch(e => {
        setError(`Error: ${e.message}`);
      });
  }, []);

  useEffect(() => {
    const h = (e: any) => {
      if (!e?.weights) return;
      let max = 0, d = "self";
      for (const k of Object.keys(e.weights)) if ((e.weights[k] || 0) > max) { max = e.weights[k]; d = k; }
      setActive({ dom: d });
    };
    bus.on("scroll:focus", h);
    return () => { bus.off("scroll:focus", h); };
  }, []);

  const dom = (w: any) => {
    let max = 0, d = "self";
    for (const k of Object.keys(w || {})) if ((w[k] || 0) > max) { max = w[k]; d = k; }
    return d;
  };

  if (error) return <div className="panel-empty">{error}</div>;
  if (!ps) return <div className="panel-loading">Loading archetype timeline…</div>;
  if (ps.length === 0) return <div className="panel-empty">No archetype data yet</div>;

  const by: Record<number, P[]> = {};
  for (const p of ps) { const ch = p.chapter_number ?? 0; (by[ch] = by[ch] || []).push(p); }
  const chapters = Object.keys(by).sort((a, b) => +a - +b);

  return (
    <div className="animate-fade-in">
      <h2 className="panel-h2">Archetypes</h2>
      {active && (
        <div className="archetype-live">
          <span className="opacity-50">Active paragraph:</span>{" "}
          <strong style={{ color: COLORS[active.dom] || "#c9a96e", textTransform: "capitalize" }}>{active.dom}</strong>
        </div>
      )}
      
      <div className="archetype-timeline">
        {chapters.map(ch => (
          <div key={ch} className="archetype-chapter">
            <div className="archetype-chapter-label">
              {ch === "0" ? "Front" : `Ch ${ch}`}
            </div>
            <div className="archetype-rail">
              {by[+ch].map((p, i) => {
                const d = dom(p.archetypal_weights);
                return (
                  <button key={p.id} title={d}
                    onClick={() => { bus.emit("navigate:paragraph", { id: p.id }); bus.emit("panel:close"); }}
                    className="archetype-dot"
                    style={{ left: `${(i / Math.max(1, by[+ch].length - 1)) * 100}%`, background: COLORS[d] || "#c9a96e", border: d === "shadow" ? "1px solid #8a857c" : "none" }} />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="legend">
        {Object.entries(COLORS).map(([n, c]) => (
          <div key={n} className="legend-item">
            <span className="legend-dot" style={{ background: c, border: n === "shadow" ? "1px solid #8a857c" : "none" }} />
            <span className="capitalize">{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
