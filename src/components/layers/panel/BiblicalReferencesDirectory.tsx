"use client";
import { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";

type Ref = { id: string; scripture_book?: string; scripture_ref?: string;
             note?: string; paragraph_id?: string; chapter_number?: number };

export default function BiblicalReferencesDirectory() {
  const [refs, setRefs] = useState<Ref[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 6000);
    fetch("/api/biblical-references", { signal: c.signal })
      .then(r => r.json())
      .then(d => { clearTimeout(t); setRefs(d.references || []); })
      .catch(e => {
        clearTimeout(t);
        setError(e.name === "AbortError" ? "Timed out" : "Could not load");
      });
    return () => { clearTimeout(t); c.abort(); };
  }, []);

  if (error) return <div className="panel-empty">{error}</div>;
  if (!refs) return <div className="panel-loading">Loading references…</div>;
  if (refs.length === 0) return <div className="panel-empty">No references indexed yet</div>;

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
      <h2 className="panel-h2">Biblical References</h2>
      <p className="panel-sub">{refs.length} references across {books.length} books</p>
      <div style={{
        display: "flex", alignItems: "flex-end", gap: 2, height: 56,
        margin: "0 0 1.5rem", padding: "0 0.5rem",
        borderBottom: "1px solid rgba(201,169,110,0.15)"
      }}>
        {Array.from({ length: 25 }).map((_, i) => {
          const ch = i + 1;
          const h = ((dist[ch] || 0) / maxC) * 100;
          return (
            <div key={ch} title={`Chapter ${ch}: ${dist[ch] || 0} refs`}
              style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end" }}>
              <div style={{
                width: "100%", height: `${h}%`,
                background: dist[ch] ? "#c9a96e" : "transparent",
                opacity: 0.7, minHeight: dist[ch] ? 2 : 0
              }} />
            </div>
          );
        })}
      </div>
      {books.map(book => (
        <section key={book}>
          <button onClick={() => setExpanded(s => ({ ...s, [book]: !s[book] }))}
            style={{ background: "transparent", border: "none", cursor: "pointer",
                     width: "100%", textAlign: "left", padding: 0 }}>
            <h3 className="panel-h3" style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline"
            }}>
              <span>{book}</span>
              <span style={{ fontSize: "0.8125rem", color: "#8a857c" }}>
                {grouped[book].length} {expanded[book] === false ? "▸" : "▾"}
              </span>
            </h3>
          </button>
          {expanded[book] !== false && grouped[book].map(r => (
            <div key={r.id} className="panel-row">
              <div className="panel-row-content">
                {r.scripture_ref && <span className="panel-row-meta">{r.scripture_ref}</span>}
                {r.note && <em>{r.note}</em>}
              </div>
              {r.paragraph_id && (
                <button className="panel-jump"
                  onClick={() => {
                    bus.emit("navigate:paragraph", { id: r.paragraph_id });
                    bus.emit("panel:close");
                  }}>
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
