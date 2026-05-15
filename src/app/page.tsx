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
  const capacity = useViewport(); [cite_start]// VIE: Digital Paper Analysis [cite: 101-105]

  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // LAYER 1: Dan/Moon Boy fades out to reveal the Black Void (Layer 0)
  const danOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    fetch('/api/chapters?slug=7').then(r => r.json()).then(d => {
      if (d.xml) {
        [cite_start]// Parse EMA paragraphs for correct indentation and tone [cite: 83-84]
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(`<root>${d.xml}</root>`, "text/xml");
        const parsed = Array.from(xmlDoc.getElementsByTagName("paragraph")).map(p => ({
          tone: p.getAttribute("tone") || "neutral",
          words: Array.from(p.getElementsByTagName("word")).map(w => ({
            text: w.textContent, color: w.getAttribute("color"), font: w.getAttribute("font")
          }))
        }));
        setParagraphs(parsed);
      }
    });
  }, []);

  return (
    <div ref={containerRef} className="relative bg-black min-h-screen">
      
      {/* LAYER 1: THE CINEMA (Auto-generated pictures / Dan) */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <ScopedBackdrop opacity={danOpacity} />
      </div>

      {/* LAYER 2: THE MANUSCRIPT (Text above pictures) */}
      <div className="relative z-20">
        <section className="h-screen flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">THE WEIGHT<br/>OF THE SKY</h1>
        </section>

        <section id="manuscript" className="py-60 px-8 max-w-2xl mx-auto space-y-32 manuscript-text">
          {paragraphs.map((p, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <p className="text-2xl md:text-3xl text-zinc-300">
                <OmniText words={p.words} />
              </p>
            </motion.div>
          ))}
        </section>
      </div>

      {/* LAYER 3: THE CONTROL SURFACE (Dashboard/Panel) */}
      <div className="fixed top-0 right-0 z-50 p-6">
        [cite_start]{/* Dashboard trigger / Control features go here[span_5](end_span) */}
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
