"use client";
import React, { useEffect, useState, useRef } from 'react';
import { SidebarProvider } from '@/context/SidebarContext';
import { ReaderLayout } from '@/components/ReaderLayout';
import { OmniText } from '@/components/OmniText';
import { ScopedBackdrop } from '@/components/ui/ScopedBackdrop';
import { getRuntime } from "@/runtime/runtimeContext";

function InfiniteReelContent() {
  const [paragraphs, setParagraphs] = useState<any[]>([]);
  const { bus } = getRuntime();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetch('/api/chapters?slug=7').then(r => r.json()).then(d => {
      if (d.xml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(`<root>${d.xml}</root>`, "text/xml");
        
        // Parse Paragraphs to preserve hierarchy and metadata
        const parsedParagraphs = Array.from(xmlDoc.getElementsByTagName("paragraph")).map((p, pIdx) => ({
          tone: p.getAttribute("tone") || "neutral",
          words: Array.from(p.getElementsByTagName("word")).map((w, wIdx) => ({
            text: w.textContent || "",
            color: w.getAttribute("color"),
            font: w.getAttribute("font"),
            sync: w.getAttribute("sync"),
            index: pIdx * 1000 + wIdx // Global index for tracking
          }))
        }));
        setParagraphs(parsedParagraphs);
      } else {
        setParagraphs(d.blocks.map((b: string) => ({ words: b.split(' ').map(w => ({ text: w })) })));
      }
    });
  }, []);

  useEffect(() => {
    if (paragraphs.length === 0) return;

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tone = entry.target.getAttribute('data-tone');
          const text = entry.target.textContent?.substring(0, 100);
          
          // Trigger the Image Engine via the EventBus
          if (tone && tone !== 'neutral') {
            bus.emit("visual:request", { tone, context: text });
          }
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.ema-paragraph').forEach(p => observerRef.current?.observe(p));
    return () => observerRef.current?.disconnect();
  }, [paragraphs, bus]);

  return (
    <div className="relative bg-black min-h-screen">
      <ScopedBackdrop opacity={1} /> {/* Integrated Op 1 fix here */}
      <section id="manuscript" className="relative z-30 py-60 px-8 max-w-2xl mx-auto space-y-24">
        {paragraphs.map((para, i) => (
          <div 
            key={i} 
            data-tone={para.tone} 
            className="ema-paragraph group transition-opacity duration-1000"
          >
            <p className="text-2xl md:text-3xl leading-[2] text-zinc-300 font-serif text-justify" style={{ textIndent: '4rem' }}>
              <OmniText words={para.words} />
            </p>
            {para.tone !== 'neutral' && (
              <span className="text-[8px] uppercase tracking-[0.5em] text-cyan-500/40 mt-4 block">
                [{para.tone} resonance]
              </span>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <SidebarProvider>
      <ReaderLayout>
        <InfiniteReelContent />
      </ReaderLayout>
    </SidebarProvider>
  );
}
