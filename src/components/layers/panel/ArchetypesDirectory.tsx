"use client";
import { useEffect, useState, useRef } from "react";
import { bus } from "@/core/runtimeEngine";

type P = { id: string; content?: string; chapter_number?: number; dualism_map?: any; archetypal_weights?: any };

const ARCHETYPES = [
  { key: "sacred",  label: "Sacred",  color: "#e8d4a0", glow: "#f5e060" },
  { key: "descent", label: "Descent", color: "#c23322", glow: "#e04433" },
  { key: "shadow",  label: "Shadow",  color: "#7a8aaa", glow: "#99aacc" },
  { key: "persona", label: "Persona", color: "#c8ccd8", glow: "#e0e4f0" },
  { key: "anima",   label: "Anima",   color: "#88bbdd", glow: "#aaddff" },
];

function getWeights(p: P) {
  return p.dualism_map || p.archetypal_weights || {};
}

function domArchetype(w: Record<string, number>) {
  let max = 0, dom = "sacred";
  for (const a of ARCHETYPES) if ((w[a.key] || 0) > max) { max = w[a.key]; dom = a.key; }
  return dom;
}

function chapterProfile(ps: P[]) {
  const totals: Record<string, number> = {};
  for (const a of ARCHETYPES) totals[a.key] = 0;
  for (const p of ps) {
    const w = getWeights(p);
    for (const a of ARCHETYPES) totals[a.key] += w[a.key] || 0;
  }
  const sum = Object.values(totals).reduce((s, v) => s + v, 0);
  if (sum < 0.001) return ARCHETYPES.map(a => ({ ...a, pct: 0.2 }));
  return ARCHETYPES.map(a => ({ ...a, pct: totals[a.key] / sum }));
}

export default function ArchetypesDirectory() {
  const [paragraphs, setParagraphs] = useState<P[]>([]);
  const [activePara, setActivePara] = useState<string | null>(null);
  const [activeDom,  setActiveDom]  = useState<string | null>(null);
  const [hovered,    setHovered]    = useState<number | null>(null);
  const [loaded,     setLoaded]     = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/graph")
      .then(r => r.json())
      .then(d => {
        const raw: P[] = d.paragraphs || [];
        setParagraphs(raw.filter(p => p && Object.keys(getWeights(p)).length > 0));
        setLoaded(true);
      })
      .catch(e => { setError(String(e?.message || e)); setLoaded(true); });
  }, []);

  useEffect(() => {
    const h = (e: any) => {
      if (!e?.weights) return;
      setActiveDom(domArchetype(e.weights));
      if (e.id) setActivePara(e.id);
    };
    bus.on("scroll:focus", h);
    return () => bus.off("scroll:focus", h);
  }, []);

  // Group by chapter
  const chapterMap: Record<number, P[]> = {};
  for (const p of paragraphs) {
    const ch = p.chapter_number ?? 0;
    (chapterMap[ch] = chapterMap[ch] || []).push(p);
  }
  const chapters = Object.keys(chapterMap).map(Number).sort((a, b) => a - b);

  const activeDef = ARCHETYPES.find(a => a.key === activeDom);
  const gold  = "#c9a96e";
  const muted = "#8a857c";

  if (error) return (
    <div style={{ padding: "3rem", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: muted }}>{error}</div>
  );
  if (!loaded) return (
    <div style={{ padding: "3rem", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: muted }}>Reading the psyche…</div>
  );
  if (!paragraphs.length) return (
    <div style={{ padding: "3rem", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: muted }}>
      No archetype data yet — run the semantic pipeline to annotate chapters.
    </div>
  );

  return (
    <div style={{ fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontStyle: "italic", fontSize: "1.125rem", color: "#e8e4dc", margin: 0, marginBottom: "0.25rem" }}>
          Jungian Archetypes
        </h2>
        <p style={{ fontStyle: "italic", fontSize: "0.75rem", color: muted, margin: 0 }}>
          {paragraphs.length} annotated paragraphs · {chapters.length} chapters · archetype fingerprint per chapter
        </p>
      </div>

      {/* Active archetype beacon */}
      {activeDom && activeDef && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          padding: "0.5rem 0.875rem", marginBottom: "1.25rem",
          background: "rgba(201,169,110,0.045)",
          border: `1px solid rgba(201,169,110,0.15)`,
          borderRadius: 2,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
            background: activeDef.color,
            boxShadow: `0 0 10px ${activeDef.glow}, 0 0 4px ${activeDef.glow}`,
            animation: "arch-pulse 2.2s ease-in-out infinite",
          }} />
          <span style={{ fontStyle: "italic", fontSize: "0.75rem", color: muted }}>
            Now reading —
          </span>
          <span style={{ fontStyle: "italic", fontSize: "0.8125rem", color: activeDef.color, textTransform: "capitalize" }}>
            {activeDom}
          </span>
        </div>
      )}

      {/* Chapter rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
        {chapters.map(ch => {
          const ps      = chapterMap[ch];
          const profile = chapterProfile(ps);
          const isHov   = hovered === ch;
          const firstId = ps[0]?.id;
          const domArch = domArchetype(getWeights(ps.reduce((best, p) => {
            const wb = getWeights(best), wp = getWeights(p);
            const mb = Math.max(...ARCHETYPES.map(a => wb[a.key] || 0));
            const mp = Math.max(...ARCHETYPES.map(a => wp[a.key] || 0));
            return mp > mb ? p : best;
          }, ps[0])));
          const domDef  = ARCHETYPES.find(a => a.key === domArch);

          return (
            <div
              key={ch}
              onMouseEnter={() => setHovered(ch)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { if (firstId) { bus.emit("navigate:paragraph", { id: firstId }); bus.emit("panel:close"); } }}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.45rem 0.75rem",
                cursor: firstId ? "pointer" : "default",
                background: isHov ? "rgba(201,169,110,0.04)" : "transparent",
                borderLeft: `2px solid ${isHov ? (domDef?.color || gold) : "rgba(201,169,110,0.09)"}`,
                transition: "background 200ms, border-color 200ms",
              }}
            >
              {/* Chapter label */}
              <span style={{ minWidth: 48, fontStyle: "italic", fontSize: "0.72rem", color: muted, flexShrink: 0 }}>
                {ch === 0 ? "Front" : `Ch ${ch}`}
              </span>

              {/* Spectrum bar */}
              <div style={{
                flex: 1, height: 9, borderRadius: 5, overflow: "hidden", display: "flex",
                opacity: isHov ? 1 : 0.65,
                transition: "opacity 200ms",
                boxShadow: isHov ? `0 0 10px ${domDef?.glow || "rgba(201,169,110,0.2)"}30` : "none",
              }}>
                {profile.map(a => (
                  <div key={a.key} title={`${a.label}: ${(a.pct * 100).toFixed(0)}%`} style={{
                    flex: a.pct,
                    background: a.color,
                    minWidth: a.pct > 0.02 ? 2 : 0,
                    transition: "flex 600ms cubic-bezier(0.22,1,0.36,1)",
                  }} />
                ))}
              </div>

              {/* Dominant archetype dot + count */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                <div style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: domDef?.color || gold,
                  boxShadow: isHov ? `0 0 6px ${domDef?.glow || "#e8c880"}` : "none",
                  transition: "box-shadow 200ms",
                }} />
                <span style={{ fontSize: "0.62rem", color: muted }}>
                  {ps.length}¶
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.9rem", marginTop: "1.5rem", justifyContent: "center" }}>
        {ARCHETYPES.map(a => (
          <div key={a.key} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div style={{ width: 20, height: 6, borderRadius: 3, background: a.color, opacity: 0.85 }} />
            <span style={{ fontStyle: "italic", fontSize: "0.7rem", color: muted }}>{a.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes arch-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
