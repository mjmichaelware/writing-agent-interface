"use client";

import React, { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";

interface BiblicalRef {
  id: string;
  scripture_ref: string;
  note: string;
  paragraph_id: string;
  paragraphs?: { id: string };
}

export default function BiblicalReferencesDirectory() {
  const [groupedRefs, setGroupedRefs] = useState<Record<string, BiblicalRef[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRefs() {
      try {
        const res = await fetch("/api/biblical-references");
        const data = await res.json();
        
        const groups: Record<string, BiblicalRef[]> = {};
        data.forEach((r: any) => {
            // Group by Book (e.g., "Genesis 1:1" -> "Genesis")
            const parts = r.scripture_ref.split(' ');
            // Handle books with numbers like "1 Samuel"
            const book = isNaN(parseInt(parts[0])) ? parts[0] : `${parts[0]} ${parts[1]}`;
            if (!groups[book]) groups[book] = [];
            groups[book].push({ ...r, paragraph_id: r.paragraphs?.id });
        });

        // Alphabetize books
        const sortedGroups = Object.keys(groups).sort().reduce((acc, key) => {
            acc[key] = groups[key];
            return acc;
        }, {} as Record<string, BiblicalRef[]>);

        setGroupedRefs(sortedGroups);
      } catch (err) {
        console.error("Failed to fetch biblical references:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRefs();
  }, []);

  const handleJump = (paraId: string) => {
    if (!paraId) return;
    bus.emit("navigate:paragraph", { id: paraId });
    bus.emit("panel:close");
  };

  return (
    <div className="flex flex-col gap-12">
      <h2 className="panel-heading">Biblical References</h2>
      
      {loading ? (
        <p className="panel-loading">Scanning the ancient scrolls...</p>
      ) : Object.keys(groupedRefs).length === 0 ? (
        <p className="panel-empty-state">No theological footprints identified.</p>
      ) : (
        Object.entries(groupedRefs).map(([book, refs]) => (
          <div key={book} className="flex flex-col gap-6">
            <h3 className="font-hebrew text-[#c9a96e] text-lg border-b border-[#c9a96e]/10 pb-2">
              {book}
            </h3>
            <div className="flex flex-col gap-8">
              {refs.map((r) => (
                <div key={r.id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-hebrew text-[#c9a96e] text-md">
                      {r.scripture_ref}
                    </span>
                    {r.paragraph_id && (
                      <button 
                          onClick={() => handleJump(r.paragraph_id)}
                          className="font-serif italic text-[#8a857c] text-xs hover:text-[#e8d4a0] transition-colors"
                      >
                        Jump to passage →
                      </button>
                    )}
                  </div>
                  <p className="font-serif italic text-[#8a857c] text-sm leading-relaxed">
                    {r.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
