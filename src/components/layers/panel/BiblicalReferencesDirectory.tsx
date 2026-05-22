"use client";

import React, { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";

interface BiblicalRef {
  id: string;
  scripture_ref: string;
  note: string;
  paragraph_id: string;
}

export default function BiblicalReferencesDirectory() {
  const [groupedRefs, setGroupedRefs] = useState<Record<string, BiblicalRef[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRefs() {
      try {
        // Fetch all paragraphs which include their biblical_references
        // In a real scenario, we'd pass a chapterId
        const res = await fetch("/api/manuscript?chapterId=all"); 
        const paragraphs = await res.json();
        
        const refs: BiblicalRef[] = [];
        paragraphs.forEach((p: any) => {
            if (p.biblical_references) {
                p.biblical_references.forEach((r: any) => {
                    refs.push({ ...r, paragraph_id: p.id });
                });
            }
        });

        // Group by Book (crude extraction)
        const groups: Record<string, BiblicalRef[]> = {};
        refs.forEach(r => {
            const book = r.scripture_ref.split(' ')[0];
            if (!groups[book]) groups[book] = [];
            groups[book].push(r);
        });

        setGroupedRefs(groups);
      } catch (err) {
        console.error("Failed to fetch biblical references:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRefs();
  }, []);

  const handleJump = (paraId: string) => {
    bus.emit("navigate:paragraph", { id: paraId });
    bus.emit("panel:close", {});
  };

  return (
    <div className="flex flex-col gap-12">
      {loading ? (
        <p className="font-serif italic text-[#8a857c] text-center py-20">Searching the ancient scrolls...</p>
      ) : Object.keys(groupedRefs).length === 0 ? (
        <p className="font-serif italic text-[#8a857c] text-center py-20">No references identified in this segment.</p>
      ) : (
        Object.entries(groupedRefs).map(([book, refs]) => (
          <div key={book} className="flex flex-col gap-6">
            <h3 className="font-hebrew text-[#c9a96e] text-xs uppercase tracking-widest border-b border-[#c9a96e]/10 pb-2">
              {book}
            </h3>
            <div className="flex flex-col gap-8">
              {refs.map((r) => (
                <div key={r.id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-hebrew text-[#c9a96e] text-sm uppercase">
                      {r.scripture_ref}
                    </span>
                    <button 
                        onClick={() => handleJump(r.paragraph_id)}
                        className="font-serif italic text-[#8a857c] text-xs hover:text-[#e8d4a0] transition-colors"
                    >
                      Jump to passage →
                    </button>
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