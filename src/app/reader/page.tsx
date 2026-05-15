"use client";

import React, { useEffect, useState } from 'react';
import { useRuntime } from '@/runtime/runtimeContext';
import { OmniText } from '@/components/OmniText';

export default function ReaderPage() {
  const { bus } = useRuntime();
  const [paragraphs, setParagraphs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/chapters?slug=7').then(r => r.json()).then(d => {
      if (d.xml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(`<root>${d.xml}</root>`, "text/xml");
        setParagraphs(Array.from(xmlDoc.getElementsByTagName("paragraph")).map((p, i) => ({
          words: Array.from(p.getElementsByTagName("word")).map(w => ({ 
            text: w.textContent, color: w.getAttribute("color"), font: w.getAttribute("font")
          })),
          isBlood: i > 12 
        })));
      }
    });
  }, []);

  return (
    <div className="bg-black text-white min-h-screen p-20">
      <div className="max-w-2xl mx-auto space-y-16">
        {paragraphs.map((p, i) => (
          <div key={i} className={`text-2xl leading-relaxed ${p.isBlood ? 'text-red-700' : 'text-zinc-300'}`} style={{ textIndent: '4rem' }}>
            <OmniText words={p.words} />
          </div>
        ))}
      </div>
    </div>
  );
}
