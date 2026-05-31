"use client";
import { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";

type P = { id: string; content: string; chapter_number?: number; archetypal_weights?: any };

const COLORS: Record<string, string> = {
  self: "#c9a96e", anima: "#e8d4a0", shadow: "#2a2a2a", persona: "#8a857c", hero: "#d4a574",
};
const muted = "#8a857c";
const gold = "#c9a96e";

export default function ArchetypesDirectory() {
  const [ps, setPs] = useState<P[] | null>(null);
  const [active, setActive] = useState<{ dom: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 8000);
    fetch("/api/graph", { signal: c.signal })
      .then(r => r.json())
      .then(d => {
        clearTimeout(t);
        setPs((d.dualisms || []).filter((p: any) => p && p.archetypal_weights && typeof p.archetypal_weights === "object"));
      })
      .catch(e => {
        clearTimeout(t);
        setError(e.name === "AbortError" ? "Timed out" : `Error: ${e.message}`);
      });
    return () => { clearTimeout(t); c.abort(); };
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

  const center = { padding: "2.5rem 1rem", textAlign: "center" as const, color: muted, fontFamily: "Georgia, serif", fontStyle: "italic" as const };
  if (error) return <div style={center}>{error}</div>;
  if (!ps) return <div style={center}>Loading archetype timeline…</div>;
  if (!Array.isArray(ps) || ps.length === 0) return <div style={center}>No archetype data yet</div>;

  const by: Record<number, P[]> = {};
  for (const p of ps) { const ch = p.chapter_number ?? 0; (by[ch] = by[ch] || []).push(p); }
  const chapters = Object.keys(by).sort((a, b) => +a - +b);

  return (
    <div>
      <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.5rem", color: gold, margin: "0 0 0.25rem", textAlign: "center" }}>Archetypes</h2>
      {active && (
        <div style={{ textAlign: "center", padding: "0.75rem 1rem", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.9375rem", borderBottom: "1px solid rgba(201,169,110,0.1)", marginBottom: "1rem" }}>
          <span style={{ color: muted }}>Active paragraph:</span>{" "}
          <strong style={{ color: COLORS[active.dom] || gold, textTransform: "capitalize" }}>{active.dom}</strong>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
        {chapters.map(ch => (
          <div key={ch} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "0.8125rem", color: muted, width: "5rem", flexShrink: 0 }}>
              {ch === "0" ? "Front" : `Ch ${ch}`}
            </div>
            <div style={{ flex: 1, position: "relative", height: 2, background: "linear-gradient(to right, rgba(201,169,110,0.4), rgba(201,169,110,0.1))" }}>
              {by[+ch].map((p, i) => {
                const d = dom(p.archetypal_weights);
                return (
                  <button key={p.id} title={d}
                    onClick={() => { bus.emit("navigate:paragraph", { id: p.id }); bus.emit("panel:close"); }}
                    style={{ position: "absolute", top: "50%", left: `${(i / Math.max(1, by[+ch].length - 1)) * 100}%`, transform: "translate(-50%, -50%)", width: 10, height: 10, borderRadius: "50%", background: COLORS[d] || gold, border: d === "shadow" ? "1px solid #8a857c" : "none", cursor: "pointer", padding: 0 }} />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.875rem", padding: "1rem 0 0", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: muted }}>
        {[["#c9a96e","Self"],["#e8d4a0","Anima"],["#2a2a2a","Shadow"],["#8a857c","Persona"],["#d4a574","Hero"]].map(([c,n]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: c, border: n === "Shadow" ? "1px solid #8a857c" : "none" }} />
            <span>{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}