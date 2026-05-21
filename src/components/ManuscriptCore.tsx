"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useScrollFocus } from '@/hooks/useScrollFocus';
import { useNarrative } from '@/context/NarrativeContext';

interface Paragraph {
  id: string;
  content: string;
  archetypal_weights: any;
  dualism_map: any;
}

const ManuscriptCore: React.FC<{ chapterId: string }> = ({ chapterId }) => {
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setFocus } = useNarrative();
  const focusedId = useScrollFocus(containerRef);

  useEffect(() => {
    if (focusedId) {
      const p = paragraphs.find(para => para.id === focusedId);
      if (p) {
        setFocus(p.id, p.archetypal_weights, p.dualism_map);
      }
    }
  }, [focusedId, paragraphs, setFocus]);

  useEffect(() => {
    if (chapterId) {
      fetch(`/api/manuscript?chapterId=${chapterId}`)
        .then(res => res.json())
        .then(data => setParagraphs(data));
    }
  }, [chapterId]);

  return (
    <div ref={containerRef} className="max-w-prose mx-auto py-40 space-y-24">
      {paragraphs.map((p, index) => (
        <p 
          key={p.id}
          id={p.id}
          data-paragraph-id={p.id}
          className="text-2xl md:text-3xl font-serif text-gray-300 leading-relaxed selection:bg-[#c5a059] selection:text-black transition-all duration-700"
          style={{
            // Placeholder for spring-damped kinetics driven by scroll
            // transform: `scale(${focusScale})`,
            // filter: `blur(${focusBlur}px)`
          }}
        >
          {p.content}
        </p>
      ))}
    </div>
  );
};

export default ManuscriptCore;