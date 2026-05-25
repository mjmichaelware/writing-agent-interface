"use client";
import { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";

type Ref = {
  id: string;
  scripture_book?: string;
  scripture_ref?: string;
  note?: string;
  paragraph_id?: string;
  chapter_number?: number;
};

export default function BiblicalReferencesDirectory() {
  const [refs, setRefs] = useState<Ref[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    fetch("/api/biblical-references", { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        clearTimeout(timeout);
        setRefs(d.references || []);
      })
      .catch(e => {
        clearTimeout(timeout);
        setError(e.name === "AbortError" 
          ? "Index timed out — references unavailable" 
          : "Could not load references");
      });
    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  if (error) return <div className="panel-empty-state">{error}</div>;
  if (!refs) return <div className="panel-loading">Loading references…</div>;
  if (refs.length === 0) 
    return <div className="panel-empty-state">No biblical references indexed yet</div>;

  const grouped: Record<string, Ref[]> = {};
  for (const r of refs) {
    const book = r.scripture_book || "Other";
    if (!grouped[book]) grouped[book] = [];
    grouped[book].push(r);
  }

  return (
    <div>
      <h2 className="panel-heading">Biblical References</h2>
      {Object.keys(grouped).sort().map(book => (
        <section key={book}>
          <h3 className="panel-section-heading">{book}</h3>
          {grouped[book].map(r => (
            <div key={r.id} className="panel-row">
              <div className="panel-row-content">
                {r.scripture_ref && (
                  <span className="panel-row-meta" style={{ marginRight: "0.75rem" }}>
                    {r.scripture_ref}
                  </span>
                )}
                {r.note && <em>{r.note}</em>}
              </div>
              {r.paragraph_id && (
                <button className="panel-jump-button"
                  onClick={() => {
                    bus.emit("navigate:paragraph", { id: r.paragraph_id });
                    bus.emit("panel:close");
                  }}>
                  jump to passage →
                </button>
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}