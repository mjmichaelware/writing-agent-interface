"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { SidebarProvider } from '@/context/SidebarContext';
import { ReaderLayout } from '@/components/ReaderLayout';
import { OmniText } from '@/components/OmniText';
import { ScopedBackdrop } from '@/components/ui/ScopedBackdrop';
import { useViewport } from '@/hooks/useViewport';

function InfiniteReelContent() {
  const [paragraphs, setParagraphs] = useState<any[]>([]);
  const containerRef = useRef(null);
  const capacity = useViewport(); 

  const { scrollYProgress } = useScroll({ target: containerRef });
  const backdropOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    fetch('/api/chapters?slug=7').then(r => r.json()).then(d => {
      if (d.xml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(`<root>${d.xml}</root>`, "text/xml");
        const parsed = Array.from(xmlDoc.getElementsByTagName("paragraph")).map(p => ({
          tone: p.getAttribute("tone") || "neutral",
          words: Array.from(p.getElementsByTagName("word")).map(w => ({
            text: w.textContent, 
            color: w.getAttribute("color"), 
            font: w.getAttribute("font")
          }))
        }));
        setParagraphs(parsed);
      } else if (d.blocks) {
        setParagraphs(d.blocks.map((b: string) => ({ words: b.split(' ').map(w => ({ text: w })) })));
      }
    });
  }, []);

  return (
    <div ref={containerRef} className="relative bg-black min-h-screen">
      <ScopedBackdrop opacity={backdropOpacity} />

      <div className="relative z-20 font-[var(--font-hebrew)]">
        <section className="h-screen flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
            THE WEIGHT<br/>OF THE SKY
          </h1>
          <p className="mt-6 text-[10px] tracking-[0.6em] text-cyan-500 uppercase">An Archetypal Tale</p>
        </section>

        <section id="manuscript" className="py-60 px-8 max-w-2xl mx-auto space-y-32">
          {paragraphs.map((p, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.5 }}
              style={{ textIndent: '4rem', textAlign: 'justify' }}
            >
              <p className="text-2xl md:text-3xl text-zinc-300 leading-[1.9]">
                <OmniText words={p.words} />
              </p>
            </motion.div>
          ))}
        </section>

        <footer className="py-20 text-center text-[10px] tracking-[0.5em] text-slate-500 uppercase">
          Michael Alonza P. Ware
        </footer>
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
