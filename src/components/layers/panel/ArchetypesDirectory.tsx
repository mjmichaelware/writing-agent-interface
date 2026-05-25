"use client";
import { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";

type P = { id: string; content: string; chapter_number?: number;
           archetypal_weights?: any };

const COLORS: Record<string, string> = {
  self: "#c9a96e", anima: "#e8d4a0", shadow: "#2a2a2a",
  persona: "#8a857c", hero: "#d4a574",
};

export default function ArchetypesDirectory() {
  const [ps, setPs] = useState<P[] | null>(null);
  const [active, setActive] = useState<{ dom: string; weights: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 6000);
    fetch("/api/graph", { signal: c.signal })
      .then(r => r.json())
      .then(d => {
        clearTimeout(t);
        setPs((d.dualisms || []).filter((p: any) =>
          p && p.archetypal_weights && typeof p.archetypal_weights === "object"));
      })
      .catch(e => {
        clearTimeout(t);
        setError(e.name === "AbortError" ? "Timed out" : "Could not load");
      });
    return () => { clearTimeout(t); c.abort(); };
  }, []);

  useEffect(() => {
    const h = (e: any) => {
      if (!e?.weights) return;
      let max = 0, d = "self";
      for (const k of Object.keys(e.weights))
        if ((e.weights[k] || 0) > max) { max = e.weights[k]; d = k; }
      setActive({ dom: d, weights: e.weights });
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
    <div>
      <h2 className="panel-h2">Archetypes</h2>
      {active && (
        <div style={{
          textAlign: "center", padding: "0.75rem 1rem",
          fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.9375rem",
          borderBottom: "1px solid rgba(201,169,110,0.1)", marginBottom: "1rem"
        }}>
          <span style={{ color: "#8a857c" }}>Active paragraph:</span>{" "}
          <strong style={{ color: COLORS[active.dom] || "#c9a96e",
                           textTransform: "capitalize" }}>{active.dom}</strong>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {chapters.map(ch => (
          <div key={ch} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "0.875rem",
                          color: "#8a857c", width: "5.5rem", flexShrink: 0 }}>
              {ch === "0" ? "Front" : `Ch ${ch}`}
            </div>
            <div style={{
              flex: 1, position: "relative", height: 2,
              background: "linear-gradient(to right, rgba(201,169,110,0.4), rgba(201,169,110,0.1))"
            }}>
              {by[+ch].map((p, i) => {
                const d = dom(p.archetypal_weights);
                return (
                  <button key={p.id} title={d}
                    onClick={() => {
                      bus.emit("navigate:paragraph", { id: p.id });
                      bus.emit("panel:close");
                    }}
                    style={{
                      position: "absolute", top: "50%",
                      left: `${(i / Math.max(1, by[+ch].length - 1)) * 100}%`,
                      transform: "translate(-50%, -50%)",
                      width: 10, height: 10, borderRadius: "50%",
                      background: COLORS[d] || "#c9a96e",
                      border: d === "shadow" ? "1px solid #8a857c" : "none",
                      cursor: "pointer", padding: 0
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="legend">
        {[["#c9a96e","Self"],["#e8d4a0","Anima"],["#2a2a2a","Shadow"],
          ["#8a857c","Persona"],["#d4a574","Hero"]].map(([c,n]) => (
          <div key={n} className="legend-item">
            <span className="legend-dot" style={{
              background: c, border: n === "Shadow" ? "1px solid #8a857c" : "none"
            }} />
            <span>{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
