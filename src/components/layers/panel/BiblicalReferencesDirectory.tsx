"use client";
import { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";

type Ref = { id: string; book: string; chapter: number; verse: number; reference_text: string; paragraph_id: string };

const HEBREW_TERMS = ["Hebron", "Hermon", "Mamre", "Beelzebub", "Megiddo", "Sak", "Rafa", "Yahweh", "Elohim", "Sheol"];

function renderText(text: string): React.ReactNode[] {
  let result: React.ReactNode[] = [text];
  HEBREW_TERMS.forEach(term => {
    const next: React.ReactNode[] = [];
    result.forEach(node => {
      if (typeof node !== "string") { next.push(node); return; }
      node.split(new RegExp(`(${term})`, "g")).forEach((part, i) => {
        if (part === term) next.push(
          <span key={`${term}-${i}`} style={{ fontFamily: "'Frank Ruhl Libre', serif", color: "#d4b87a", fontStyle: "normal", letterSpacing: "0.02em" }}>{part}</span>
        );
        else if (part) next.push(part);
      });
    });
    result = next;
  });
  return result;
}

export default function BiblicalReferencesDirectory() {
  const [refs, setRefs]           = useState<Ref[] | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [hoverRef, setHoverRef]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/biblical-references")
      .then(r => r.json())
      .then(d => setRefs(d.references || []))
      .catch(e => setError(String(e?.message || e)));
  }, []);

  if (error) return (
    <div style={{ padding: "3rem", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: "#8a857c" }}>
      {error}
    </div>
  );
  if (!refs) return (
    <div style={{ padding: "3rem", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: "#8a857c" }}>
      Consulting the ancient codex…
    </div>
  );
  if (refs.length === 0) return (
    <div style={{ padding: "3rem", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: "#8a857c" }}>
      No biblical references indexed yet.
    </div>
  );

  const grouped: Record<string, Ref[]> = {};
  for (const r of refs) { const b = r.book || "Other"; (grouped[b] = grouped[b] || []).push(r); }
  const books = Object.keys(grouped).sort();

  return (
    <div style={{ fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h2 style={{ fontStyle: "italic", fontSize: "1.125rem", color: "#e8e4dc", margin: 0, marginBottom: "0.25rem" }}>
          Theological Directory
        </h2>
        <p style={{ fontStyle: "italic", fontSize: "0.75rem", color: "#8a857c", margin: 0 }}>
          {refs.length} references across {books.length} books of scripture
        </p>
      </div>

      {books.map((book, bi) => {
        const bookRefs = grouped[book];
        const isOpen   = !collapsed[book];

        return (
          <div key={book} style={{ marginBottom: "0.1rem" }}>
            {/* Book header */}
            <button
              onClick={() => setCollapsed(s => ({ ...s, [book]: !s[book] }))}
              style={{
                width: "100%", textAlign: "left", background: "transparent", border: "none",
                padding: "0.7rem 0", cursor: "pointer",
                borderTop: bi === 0 ? "none" : "1px solid rgba(201,169,110,0.07)",
                display: "flex", alignItems: "baseline", justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.55rem", minWidth: 0 }}>
                <span style={{ color: "rgba(201,169,110,0.38)", fontSize: "0.6rem", flexShrink: 0 }}>✦</span>
                <span style={{ fontStyle: "italic", fontSize: "0.9375rem", color: "#c9a96e", letterSpacing: "0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {book}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
                <span style={{ fontStyle: "italic", fontSize: "0.67rem", color: "#8a857c" }}>
                  {bookRefs.length} ref{bookRefs.length !== 1 ? "s" : ""}
                </span>
                <span style={{
                  color: "rgba(201,169,110,0.32)", fontSize: "0.58rem",
                  display: "inline-block",
                  transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                  transition: "transform 320ms cubic-bezier(0.22,1,0.36,1)",
                }}>▾</span>
              </div>
            </button>

            {/* Reference list — animated collapse */}
            <div style={{
              overflow: "hidden",
              maxHeight: isOpen ? `${bookRefs.length * 92 + 16}px` : "0px",
              opacity: isOpen ? 1 : 0,
              transition: "max-height 480ms cubic-bezier(0.22,1,0.36,1), opacity 380ms ease",
            }}>
              {bookRefs.map((r, ri) => (
                <div
                  key={r.id}
                  onMouseEnter={() => setHoverRef(r.id)}
                  onMouseLeave={() => setHoverRef(null)}
                  onClick={() => { bus.emit("navigate:paragraph", { id: r.paragraph_id }); bus.emit("panel:close"); }}
                  style={{
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                    padding: "0.55rem 0.75rem 0.55rem 1rem",
                    marginBottom: "0.1rem",
                    borderLeft: `1px solid ${hoverRef === r.id ? "rgba(201,169,110,0.5)" : "rgba(201,169,110,0.11)"}`,
                    background: hoverRef === r.id ? "rgba(201,169,110,0.035)" : "transparent",
                    transition: "border-color 220ms, background 220ms",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, marginRight: "0.75rem" }}>
                    <span style={{
                      display: "block", marginBottom: "0.2rem",
                      fontSize: "0.66rem", color: "#c9a96e", opacity: 0.65,
                      letterSpacing: "0.05em",
                    }}>
                      {r.chapter}:{r.verse}
                    </span>
                    <span style={{ fontStyle: "italic", fontSize: "0.8125rem", color: "#c0bcb4", lineHeight: 1.55 }}>
                      {renderText(r.reference_text)}
                    </span>
                  </div>
                  <span style={{
                    fontStyle: "italic", fontSize: "0.72rem", flexShrink: 0,
                    paddingTop: "0.1rem",
                    color: hoverRef === r.id ? "#c9a96e" : "rgba(201,169,110,0.28)",
                    transition: "color 220ms",
                  }}>
                    ↗
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
