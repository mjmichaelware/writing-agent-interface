"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { SidebarProvider } from '@/context/SidebarContext';
import { OmniText } from '@/components/OmniText';
import { ScopedBackdrop } from '@/components/ui/ScopedBackdrop';
import { useViewport } from '@/hooks/useViewport';

function Dashboard({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) {
  return (
    <div className={`fixed top-0 right-0 z-50 h-full w-80 bg-zinc-900/95 border-l border-zinc-800 transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <button onClick={toggle} className="absolute -left-10 top-10 bg-zinc-800 p-2 rounded-l-md text-cyan-500">
        {isOpen ? '→' : '←'}
      </button>
      <div className="p-6 space-y-6">
        <h2 className="text-cyan-500 font-bold tracking-widest text-xs uppercase">Command Center</h2>
        <input type="text" placeholder="Search Names..." className="w-full bg-black border border-zinc-700 p-2 text-sm text-white" />
        <div className="space-y-2">
          <p className="text-[10px] text-zinc-500 uppercase">Feature Entry</p>
          <button className="w-full bg-zinc-800 p-2 text-xs text-zinc-300 hover:bg-cyan-900">Add Biblical Hyperlink</button>
        </div>
      </div>
    </div>
  );
}

function InfiniteReelContent() {
  const [paragraphs, setParagraphs] = useState<any[]>([]);
  const [dashOpen, setDashOpen] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const danOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    fetch('/api/chapters?slug=7').then(r => r.json()).then(d => {
      if (d.xml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(`<root>${d.xml}</root>`, "text/xml");
        setParagraphs(Array.from(xmlDoc.getElementsByTagName("paragraph")).map(p => ({
          words: Array.from(p.getElementsByTagName("word")).map(w => ({
            text: w.textContent, color: w.getAttribute("color"), font: w.getAttribute("font")
          }))
        })));
      }
    });
  }, []);

  const handleWordClick = (word: string) => {
    console.log(`Searching Narrative Hyperlinks for: ${word}`);
  };

  return (
    <div ref={containerRef} className="relative bg-black min-h-screen selection:bg-cyan-500/30">
      <Dashboard isOpen={dashOpen} toggle={() => setDashOpen(!dashOpen)} />
      
      {/* LAYER 1: CINEMA */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <ScopedBackdrop opacity={danOpacity} />
      </div>

      {/* LAYER 2: MANUSCRIPT */}
      <div className="relative z-20 font-[var(--font-hebrew)]">
        <section className="h-screen flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">THE WEIGHT<br/>OF THE SKY</h1>
        </section>

        <section className="py-60 px-8 max-w-2xl mx-auto space-y-32">
          {paragraphs.map((p, i) => (
            <motion.div key={i} className="text-2xl md:text-3xl text-zinc-300 leading-[1.9] text-justify" style={{ textIndent: '4rem' }}>
              <span onClick={() => handleWordClick(p.words.map((w: any) => w.text).join(' '))}>
                <OmniText words={p.words} />
              </span>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default function Page() {
  return <SidebarProvider><InfiniteReelContent /></SidebarProvider>;
}
