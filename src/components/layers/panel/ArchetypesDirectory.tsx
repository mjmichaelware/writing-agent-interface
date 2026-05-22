"use client";

import React, { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";

interface ArchetypePeak {
  id: string;
  chapter_number: number;
  dominant: string;
  content: string;
}

export default function ArchetypesDirectory() {
  const [timeline, setTimeline] = useState<ArchetypePeak[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArchetypes() {
      try {
        const res = await fetch("/api/manuscript?chapterId=all");
        const paragraphs = await res.json();
        
        const peaks: ArchetypePeak[] = paragraphs
          .filter((p: any) => p.archetypal_weights && Object.keys(p.archetypal_weights).length > 0)
          .map((p: any) => {
            const weights = p.archetypal_weights;
            const dominant = Object.entries(weights).reduce(
              (a, b) => ((b[1] as number) > (a[1] as number) ? b : a),
              ["none", 0]
            )[0];

            return {
              id: p.id,
              chapter_number: p.chapters?.chapter_number || 0,
              dominant,
              content: p.content
            };
          });

        setTimeline(peaks);
      } catch (err) {
        console.error("Failed to fetch archetypes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArchetypes();
  }, []);

  const handleJump = (id: string) => {
    bus.emit("navigate:paragraph", { id });
    bus.emit("ui:menu_close", {});
  };

  const COLORS: Record<string, string> = {
    self: "#c9a96e",
    anima: "#e8d4a0",
    shadow: "#0a0a0a", // Needs outline
    persona: "#8a857c",
  };

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-serif italic text-[#8a857c] text-center mb-8">Psychological Landscape</h2>

      {loading ? (
        <p className="font-serif italic text-[#8a857c] text-center py-20">Mapping the collective unconscious...</p>
      ) : timeline.length === 0 ? (
        <p className="font-serif italic text-[#8a857c] text-center py-20">Archetypal peaks will emerge as the story unfolds.</p>
      ) : (
        <div className="relative border-l border-white/5 ml-4 pl-8 flex flex-col gap-12">
          {timeline.map((peak, idx) => (
            <div key={peak.id} className="relative group cursor-pointer" onClick={() => handleJump(peak.id)}>
              
              {/* Chapter Marker */}
              {(idx === 0 || timeline[idx-1].chapter_number !== peak.chapter_number) && (
                <div className="absolute -left-12 top-0 transform -translate-x-1/2">
                   <span className="font-hebrew text-[10px] text-[#c9a96e]/40 uppercase tracking-tighter">
                     Ch {peak.chapter_number}
                   </span>
                </div>
              )}

              {/* Archetype Peak Dot */}
              <div 
                className={`absolute -left-[37px] top-1.5 w-3 h-3 rounded-full transition-transform duration-500 group-hover:scale-150 ${peak.dominant === 'shadow' ? 'border border-white' : ''}`}
                style={{ backgroundColor: COLORS[peak.dominant] || "#444" }}
              />

              <div className="flex flex-col gap-1">
                <span className="font-hebrew text-[#e8d4a0] text-xs uppercase tracking-widest opacity-60">
                  {peak.dominant}
                </span>
                <p className="font-serif italic text-[#8a857c] text-sm line-clamp-2 group-hover:text-[#e8e4dc] transition-colors">
                  "{peak.content}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}