"use client";

import React, { useEffect, useState, useRef } from 'react';

interface Paragraph {
  id: string;
  content: string;
  archetypal_weights: any;
  dualism_map: any;
}

const ManuscriptCore: React.FC<{ chapterId: string }> = ({ chapterId }) => {
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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