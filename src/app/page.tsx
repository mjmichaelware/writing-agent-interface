"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { SidebarProvider } from '@/context/SidebarContext';
import { ReaderLayout } from '@/components/ReaderLayout';
import { OmniText } from '@/components/OmniText';
import { ScopedBackdrop } from '@/components/ui/ScopedBackdrop';
import { getRuntime } from "@/runtime/runtimeContext";

function InfiniteReelContent() {
  const [paragraphs, setParagraphs] = useState<any[]>([]);
  const { bus } = getRuntime();
  const containerRef = useRef(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fading logic for the moon backdrop
  const { scrollYProgress } = useScroll({ target: containerRef });
  const backdropOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    fetch('/api/chapters?slug=7').then(r => r.json()).then(d => {
      if (d.xml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(`<root>${d.xml}</root>`, "text/xml");
        
        // Map XML paragraphs to preserve tone and word metadata
        const parsed = Array.from(xmlDoc.getElementsByTagName("paragraph")).map((p, pIdx) => ({
          tone: p.getAttribute("tone") || "neutral",
          words: Array.from(p.getElementsByTagName("word")).map((w, wIdx) => ({
            text: w.textContent || "",
            color: w.getAttribute("color"),
            font: w.getAttribute("font"),
            index: pIdx * 1000 + wIdx
          }))
        }));
        setParagraphs(parsed);
      } else if (d.blocks) {
        setParagraphs(d.blocks.map((b: string) => ({ words: b.split(' ').map(w => ({ text: w })) })));
      }
    });
  }, []);

  useEffect(() => {
    if (!paragraphs.length) return;

    // Observer to trigger images based on paragraph tone
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tone = entry.target.getAttribute('data-tone');
          if (tone && tone !== 'neutral') {
            bus.emit("visual:request", { 
              tone, 
              context: entry.target.textContent?.substring(0, 150) 
            });
          }
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.ema-paragraph').forEach(p => observerRef.current?.observe(p));
    return () => observerRef.current?.disconnect();
  }, [paragraphs, bus]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div ref={containerRef} className="relative bg-black min-h-screen">
      <ScopedBackdrop opacity={backdropOpacity} />

      <div className="relative z-10">
        <section className="h-screen flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">THE WEIGHT<br/>OF THE SKY</h1>
          <button onClick={() => scrollTo('manuscript')} className="mt-20 py-4 px-12 border border-white/30 bg-white/5 uppercase tracking-[0.6em] text-[9px]">Begin Reading</button>
        </section>

        <section id="manuscript" className="relative z-30 py-60 px-8 max-w-2xl mx-auto space-y-32">
          {paragraphs.map((p, i) => (
            <div key={i} data-tone={p.tone} className="ema-paragraph">
              <p className="text-2xl md:text-3xl leading-[2] text-zinc-300 font-serif text-justify" style={{ textIndent: '4rem' }}>
                <OmniText words={p.words} />
              </p>
            </div>
          ))}
        </section>
      </div>
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

