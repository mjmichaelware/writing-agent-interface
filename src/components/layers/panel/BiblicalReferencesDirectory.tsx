"use client";
import { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";

type Ref = { 
  id: string; 
  book: string; 
  chapter: number;
  verse: number;
  reference_text: string; 
  paragraph_id: string; 
};

export default function BiblicalReferencesDirectory() {
  const [refs, setRefs] = useState<Ref[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/biblical-references")
      .then(r => r.json())
      .then(d => { 
        setRefs(d.references || []); 
      })
      .catch(e => {
        setError(`Error: ${e.message}`);
      });
  }, []);

  if (error) return <div className="panel-empty">{error}</div>;
  if (!refs) return <div className="panel-loading">Loading references…</div>;
  if (refs.length === 0) return <div className="panel-empty">No biblical references indexed yet</div>;

  const grouped: Record<string, Ref[]> = {};
  for (const r of refs) {
    const b = r.book || "Other";
    (grouped[b] = grouped[b] || []).push(r);
  }
  const books = Object.keys(grouped).sort();



  return (
    <div className="animate-fade-in">
      <h2 className="panel-h2">Theological Directory</h2>
      <p className="panel-sub">{refs.length} references across {books.length} books</p>
      
      {books.map(book => (
        <section key={book}>
          <button onClick={() => setCollapsed(s => ({ ...s, [book]: !s[book] }))}
            className="w-full text-left bg-transparent border-none cursor-pointer p-0">
            <h3 className="panel-h3 flex justify-between items-baseline">
              <span>{book}</span>
              <span className="text-xs opacity-50">{grouped[book].length} {collapsed[book] ? "▸" : "▾"}</span>
            </h3>
          </button>
          
          {!collapsed[book] && grouped[book].map(r => (
            <div key={r.id} className="panel-row">
              <div className="panel-row-content">
                <span className="panel-row-meta">{r.chapter}:{r.verse}</span>
                <span className="italic">{r.reference_text}</span>
              </div>
              <button 
                onClick={() => {
                  bus.emit("navigate:paragraph", { id: r.paragraph_id });
                  bus.emit("panel:close");
                }} 
                className="panel-jump"
              >
                jump →
              </button>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
