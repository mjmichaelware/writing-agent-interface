"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useScrollFocus } from '@/hooks/useScrollFocus';
import { useNarrative } from '@/context/NarrativeContext';
import { tokenize } from '@/services/tokenize';

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
    <div ref={containerRef} className="max-w-prose mx-auto py-40 space-y-32">
      {paragraphs.map((p) => {
        const isFocused = focusedId === p.id;
        
        return (
          <p 
            key={p.id}
            id={p.id}
            data-paragraph-id={p.id}
            className={`prose-text text-gray-300 leading-relaxed selection:bg-[#c5a059] selection:text-black transition-all duration-1000 ease-spring ${
              isFocused ? 'opacity-100 scale-100 blur-0' : 'opacity-40 scale-95 blur-[2px]'
            }`}
            dangerouslySetInnerHTML={{ __html: tokenize(p.content) }}
          />
        );
      })}
    </div>
  );
};

export default ManuscriptCore;