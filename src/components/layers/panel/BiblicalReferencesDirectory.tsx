"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/supabase/useAuth";
import { createClient } from "@/lib/supabase/client";

type Anchor = {
  anchor_key: string;
  biblical_anchor_label: string;
  book: string;
  chapter: number;
  verse_start: number;
  verse_end?: number;
  motif_family: string;
  metadata?: any;
};
type Ref = { subject_name: string | null; label: string | null; evidence_text: string | null; interpretation: string | null; confidence: number };
type Data = { anchors: Anchor[]; references: Ref[]; crosslinks: any[]; total_anchors: number; total_references: number };

const MOTIF_COLORS: Record<string, string> = {
  theophany: "#f0c060",
  covenant: "#a0c0e0",
  sacrifice: "#c06060",
  creation: "#60c080",
  judgment: "#a070c0",
  redemption: "#e09060",
  exile: "#808090",
  wisdom: "#c0b060",
  lament: "#707090",
  prophecy: "#9080c0",
};

function IlluminatedInitial({ letter, color }: { letter: string; color: string }) {
  return (
    <div style={{
      width: "2.5rem",
      height: "2.5rem",
      flexShrink: 0,
      background: `rgba(${hexToRgb(color)}, 0.08)`,
      border: `1px solid rgba(${hexToRgb(color)}, 0.35)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Georgia, serif",
      fontSize: "1.25rem",
      color: color,
      borderRadius: "2px",
      position: "relative",
    }}>
      <div style={{
        position: "absolute", inset: "2px",
        border: `0.5px solid rgba(${hexToRgb(color)}, 0.2)`,
        borderRadius: "1px",
      }} />
      {letter}
    </div>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function formatVerse(a: Anchor) {
  return `${a.book} ${a.chapter}:${a.verse_start}${a.verse_end && a.verse_end !== a.verse_start ? `–${a.verse_end}` : ""}`;
}

export default function BiblicalReferencesDirectory() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!session) return;
    const sb = createClient();
    sb.auth.getSession().then(({ data: { session: s } }) => {
      fetch("/api/semantic/biblical", {
        headers: s?.access_token ? { Authorization: `Bearer ${s.access_token}` } : {},
      })
        .then(r => r.json())
        .then(d => { if (!d.error) setData(d); else setError(d.error); })
        .catch(e => setError(e.message));
    });
  }, [session]);

  // Realtime
  useEffect(() => {
    if (!session) return;
    const sb = createClient();
    const ch = sb.channel("biblical_updates")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "semantic_biblical_anchors" }, () => {
        sb.auth.getSession().then(({ data: { session: s } }) => {
          fetch("/api/semantic/biblical", {
            headers: s?.access_token ? { Authorization: `Bearer ${s.access_token}` } : {},
          })
            .then(r => r.json())
            .then(d => { if (!d.error) setData(d); });
        });
      })
      .subscribe();
    return () => { sb.removeChannel(ch); };
  }, [session]);

  if (authLoading) return <div className="panel-loading">Summoning…</div>;
  if (!session) return (
    <div className="panel-empty" style={{ textAlign: "center" }}>
      <p style={{ marginBottom: "1rem" }}>Author access required.</p>
      <a href="/login" style={{ color: "#c9a96e", fontStyle: "italic", fontSize: "0.875rem" }}>Enter the manuscript →</a>
    </div>
  );
  if (error) return <div className="panel-empty">{error}</div>;
  if (!data) return <div className="panel-loading">Illuminating the threads…</div>;

  const refsGrouped: Record<string, Ref[]> = {};
  for (const r of data.references) {
    const k = r.label || "Other";
    (refsGrouped[k] = refsGrouped[k] || []).push(r);
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h2 className="panel-h2">Theological Directory</h2>
      <p className="panel-sub">
        {data.total_anchors} biblical anchors · {data.total_references} textual references
      </p>

      {/* Anchor header bar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.4rem",
        marginBottom: "1rem",
        padding: "0.75rem",
        background: "rgba(201,169,110,0.03)",
        border: "1px solid rgba(201,169,110,0.1)",
        borderRadius: "3px",
      }}>
        {data.anchors.map(a => {
          const color = MOTIF_COLORS[a.motif_family] || "#c9a96e";
          return (
            <button key={a.anchor_key}
              onClick={() => setExpanded(expanded === a.anchor_key ? null : a.anchor_key)}
              style={{
                background: expanded === a.anchor_key ? `rgba(${hexToRgb(color)},0.15)` : "transparent",
                border: `1px solid rgba(${hexToRgb(color)},${expanded === a.anchor_key ? 0.5 : 0.2})`,
                borderRadius: "2px",
                padding: "0.25rem 0.5rem",
                color: color,
                fontSize: "0.7rem",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                cursor: "pointer",
                transition: "all 250ms",
              }}>
              {a.book} {a.chapter}:{a.verse_start}
            </button>
          );
        })}
      </div>

      {/* Anchor detail panel */}
      {expanded && (() => {
        const anchor = data.anchors.find(a => a.anchor_key === expanded);
        if (!anchor) return null;
        const color = MOTIF_COLORS[anchor.motif_family] || "#c9a96e";
        const relatedRefs = data.references.filter(r => r.label && r.label.toLowerCase().includes(anchor.book.toLowerCase())).slice(0, 6);
        return (
          <div style={{
            marginBottom: "1rem",
            padding: "1rem",
            background: `rgba(${hexToRgb(color)},0.04)`,
            border: `1px solid rgba(${hexToRgb(color)},0.2)`,
            borderRadius: "3px",
            animation: "fadeIn 300ms ease",
          }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <IlluminatedInitial letter={anchor.book[0]} color={color} />
              <div>
                <div style={{ color: color, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1rem" }}>
                  {formatVerse(anchor)}
                </div>
                <div style={{ color: "#8a857c", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                  {anchor.biblical_anchor_label}
                </div>
                <div style={{
                  display: "inline-block",
                  marginTop: "0.4rem",
                  padding: "0.15rem 0.4rem",
                  background: `rgba(${hexToRgb(color)},0.1)`,
                  border: `1px solid rgba(${hexToRgb(color)},0.25)`,
                  borderRadius: "10px",
                  color: color,
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                }}>
                  {anchor.motif_family}
                </div>
              </div>
            </div>
            {relatedRefs.length > 0 && (
              <div style={{ borderTop: `1px solid rgba(${hexToRgb(color)},0.1)`, paddingTop: "0.6rem" }}>
                <div style={{ color: "#8a857c", fontSize: "0.7rem", marginBottom: "0.4rem", letterSpacing: "0.1em" }}>TEXTUAL ECHOES</div>
                {relatedRefs.map((r, i) => (
                  <div key={i} style={{ marginBottom: "0.4rem" }}>
                    {r.evidence_text && (
                      <p style={{ color: "#e8e4dc", fontSize: "0.8rem", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
                        &ldquo;{r.evidence_text.slice(0, 200)}{r.evidence_text.length > 200 ? "…" : ""}&rdquo;
                      </p>
                    )}
                    {r.interpretation && (
                      <p style={{ color: "#8a857c", fontSize: "0.73rem", lineHeight: 1.5, margin: "0.25rem 0 0" }}>
                        {r.interpretation.slice(0, 180)}{r.interpretation.length > 180 ? "…" : ""}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* References list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.6rem" }}>
          <div style={{ height: "1px", flex: 1, background: "rgba(201,169,110,0.1)" }} />
          <span style={{ color: "#8a857c", fontSize: "0.7rem", letterSpacing: "0.15em" }}>TEXTUAL REFERENCES</span>
          <div style={{ height: "1px", flex: 1, background: "rgba(201,169,110,0.1)" }} />
        </div>
        {data.references.slice(0, 30).map((ref, i) => (
          <div key={i} style={{
            display: "flex",
            gap: "0.6rem",
            alignItems: "flex-start",
            padding: "0.6rem 0",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{
              width: "3px",
              alignSelf: "stretch",
              background: "linear-gradient(to bottom, rgba(201,169,110,0.4), rgba(201,169,110,0.05))",
              flexShrink: 0,
              borderRadius: "2px",
              marginTop: "2px",
            }} />
            <div style={{ flex: 1 }}>
              {ref.label && (
                <div style={{ color: "#c9a96e", fontSize: "0.75rem", fontFamily: "Georgia, serif", fontStyle: "italic", marginBottom: "0.2rem" }}>
                  {ref.label}
                </div>
              )}
              {ref.evidence_text && (
                <p style={{ color: "#e8e4dc", fontSize: "0.8rem", fontStyle: "italic", lineHeight: 1.55, margin: 0, marginBottom: ref.interpretation ? "0.2rem" : 0 }}>
                  &ldquo;{ref.evidence_text.slice(0, 160)}{ref.evidence_text.length > 160 ? "…" : ""}&rdquo;
                </p>
              )}
              {ref.interpretation && (
                <p style={{ color: "#8a857c", fontSize: "0.72rem", lineHeight: 1.5, margin: 0 }}>
                  {ref.interpretation.slice(0, 140)}{ref.interpretation.length > 140 ? "…" : ""}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Motif legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem 0.75rem", marginTop: "0.75rem" }}>
        {Object.entries(MOTIF_COLORS).map(([motif, color]) => (
          <div key={motif} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, opacity: 0.8 }} />
            <span style={{ color: "#8a857c", fontSize: "0.68rem", fontStyle: "italic" }}>{motif}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
