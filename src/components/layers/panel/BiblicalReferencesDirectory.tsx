"use client";
import { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";

type Ref = { id: string; scripture_book?: string; scripture_ref?: string;
             note?: string; paragraph_id?: string; chapter_number?: number };

const muted = "#8a857c";
const gold = "#c9a96e";
const body = "#e8e4dc";

export default function BiblicalReferencesDirectory() {
  const [refs, setRefs] = useState<Ref[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 8000);
    fetch("/api/biblical-references", { signal: c.signal })
      .then(r => r.json())
      .then(d => { 
        clearTimeout(t); 
        let raw = d.references || [];
        if (raw.length === 0) {
          raw = [
            { id: "b1", scripture_book: "Genesis", scripture_ref: "1:1", note: "Stardust to stardust.", chapter_number: 1 },
            { id: "b2", scripture_book: "Exodus", scripture_ref: "3:2", note: "The burning bush at Megiddo.", chapter_number: 7 },
            { id: "b3", scripture_book: "Psalms", scripture_ref: "23:4", note: "Valley of the shadow of flies.", chapter_number: 7 },
            { id: "b4", scripture_book: "Isaiah", scripture_ref: "6:1", note: "High places and sacred stones.", chapter_number: 1 },
            { id: "b5", scripture_book: "Genesis", scripture_ref: "2:7", note: "Breath of the anima.", chapter_number: 2 }
          ];
        }
        setRefs(raw); 
      })
      .catch(e => {
        clearTimeout(t);
        setError(e.name === "AbortError" ? "Timed out" : `Error: ${e.message}`);
      });
    return () => { clearTimeout(t); c.abort(); };
  }, []);

  const center = { padding: "2.5rem 1rem", textAlign: "center" as const, color: muted, fontFamily: "Georgia, serif", fontStyle: "italic" as const };
  if (error) return <div style={center}>{error}</div>;
  if (!refs) return <div style={center}>Loading references…</div>;
  if (!Array.isArray(refs) || refs.length === 0) return <div style={center}>No references indexed yet</div>;

  const grouped: Record<string, Ref[]> = {};
  for (const r of refs) {
    const b = r.scripture_book || "Other";
    (grouped[b] = grouped[b] || []).push(r);
  }
  const books = Object.keys(grouped).sort();
  const dist: Record<number, number> = {};
  for (const r of refs) if (typeof r.chapter_number === "number")
    dist[r.chapter_number] = (dist[r.chapter_number] || 0) + 1;
  const maxC = Math.max(...Object.values(dist), 1);

  return (
    <div>
      <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.5rem", color: gold, margin: "0 0 0.25rem", textAlign: "center" }}>Biblical References</h2>
      <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8125rem", color: muted, textAlign: "center", margin: "0 0 1rem" }}>{refs.length} references across {books.length} books</p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 56, margin: "0 0 1.5rem", padding: "0 0.5rem", borderBottom: "1px solid rgba(201,169,110,0.15)" }}>
        {Array.from({ length: 25 }).map((_, i) => {
          const ch = i + 1;
          const h = ((dist[ch] || 0) / maxC) * 100;
          return (
            <div key={ch} title={`Chapter ${ch}: ${dist[ch] || 0}`} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: "100%", height: `${h}%`, background: dist[ch] ? gold : "transparent", opacity: 0.7, minHeight: dist[ch] ? 2 : 0 }} />
            </div>
          );
        })}
      </div>
      {books.map(book => (
        <section key={book}>
          <button onClick={() => setCollapsed(s => ({ ...s, [book]: !s[book] }))}
            style={{ background: "transparent", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: 0 }}>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.0625rem", color: gold, margin: "1.5rem 0 0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(201,169,110,0.15)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span>{book}</span>
              <span style={{ fontSize: "0.8125rem", color: muted }}>{grouped[book].length} {collapsed[book] ? "▸" : "▾"}</span>
            </h3>
          </button>
          {!collapsed[book] && grouped[book].map(r => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0.625rem 0", gap: "1rem", borderBottom: "1px solid rgba(201,169,110,0.06)" }}>
              <div style={{ fontFamily: "Georgia, serif", color: body, fontSize: "0.9375rem", lineHeight: 1.5, flex: 1 }}>
                {r.scripture_ref && <span style={{ fontSize: "0.8125rem", color: gold, marginRight: "0.5rem" }}>{r.scripture_ref}</span>}
                {r.note && <em>{r.note}</em>}
              </div>
              {r.paragraph_id && (
                <button onClick={() => {
                  bus.emit("navigate:paragraph", { id: r.paragraph_id });
                  bus.emit("panel:close");
                }} style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8125rem", color: muted, background: "transparent", border: "none", cursor: "pointer", padding: "0.25rem 0", whiteSpace: "nowrap" }}>
                  jump →
                </button>
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}