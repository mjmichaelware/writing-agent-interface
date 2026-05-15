"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { OmniText } from '@/components/OmniText';

/**
 * LAYER 3: THE COMMAND CENTER (Z-50)
 * Completely unmounts when closed for a distraction-free fugue.
 */
function Dashboard({ isOpen, close }: { isOpen: boolean, close: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
          className="fixed inset-0 z-50 flex justify-end"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" onClick={close} />
          <div className="relative w-full max-w-lg h-full bg-zinc-950 border-l border-cyan-900/20 p-12 space-y-12 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
              <h2 className="text-cyan-500 font-bold tracking-[0.5em] text-xs uppercase">Command Center</h2>
              <button onClick={close} className="text-zinc-600 hover:text-white">✕</button>
            </div>
            <div className="space-y-8">
              <input type="text" placeholder="Search Narrative Graph..." className="w-full bg-black border border-zinc-800 p-4 text-white outline-none focus:border-cyan-500" />
              <button className="w-full bg-zinc-900 p-4 text-left text-[10px] tracking-widest uppercase hover:bg-cyan-900 transition-colors">Add Biblical Hyperlink</button>
              <button className="w-full bg-zinc-900 p-4 text-left text-[10px] tracking-widest uppercase hover:bg-cyan-900 transition-colors">Toggle Generative Lens</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function InfiniteFugue() {
  const [paragraphs, setParagraphs] = useState<any[]>([]);
  const [isDashOpen, setIsDashOpen] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // LAYER 1: THE CINEMA (Dynamic Reel)
  const danOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.4], [0, 1, 0]);
  const megiddoOpacity = useTransform(scrollYProgress, [0.4, 0.55, 0.7], [0, 1, 0]);

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

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div ref={containerRef} className="relative bg-black text-white min-h-[700vh] selection:bg-cyan-500/30">
      
      {/* LAYER 3: HUD (Z-40) */}
      <button onClick={() => setIsDashOpen(true)} className="fixed top-8 right-8 z-40 bg-zinc-900/50 p-4 border border-zinc-800 text-[10px] tracking-widest uppercase hover:bg-cyan-900 transition-all backdrop-blur-md">
        Dashboard
      </button>
      <Dashboard isOpen={isDashOpen} close={() => setIsDashOpen(false)} />

      {/* LAYER 1: THE CINEMA (Z-10) */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <motion.div style={{ opacity: danOpacity }} className="absolute inset-0 bg-[url('/dan_flies.png')] bg-cover bg-center grayscale contrast-125" />
        <motion.div style={{ opacity: megiddoOpacity }} className="absolute inset-0 bg-[url('/megiddo_city.png')] bg-cover bg-center" />
      </div>

      {/* LAYER 2: THE MANUSCRIPT (Z-20) */}
      <div className="relative z-20 font-[var(--font-hebrew)]">
        
        {/* INTRO DECK */}
        <section className="h-screen flex flex-col items-center justify-center text-center p-10">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none">THE WEIGHT<br/>OF THE SKY</h1>
          <p className="text-cyan-500 tracking-[1em] uppercase text-[10px] mb-12">Michael Alonza P. Ware</p>
          
          <div className="flex gap-4">
            <button onClick={() => scrollTo('dedication')} className="px-8 py-3 border border-zinc-800 text-[10px] uppercase tracking-widest hover:bg-zinc-900">Dedication</button>
            <button onClick={() => scrollTo('blurb')} className="px-8 py-3 border border-zinc-800 text-[10px] uppercase tracking-widest hover:bg-zinc-900">The Blurb</button>
            <button onClick={() => scrollTo('pit')} className="px-8 py-3 bg-white text-black text-[10px] uppercase tracking-widest font-bold">Enter The Pit</button>
          </div>
        </section>

        <section id="dedication" className="h-screen flex items-center justify-center text-zinc-500 italic text-xl">
          "Dedicated to those who see the stars from the bottom of the pit."
        </section>

        <section id="blurb" className="max-w-xl mx-auto py-40 px-10 text-justify text-zinc-400 leading-relaxed border-y border-zinc-900/50">
          <h3 className="text-white text-xs uppercase tracking-widest mb-10">The Blurb</h3>
          At the gates of Megiddo, Dan faces the layered mound of history built upon forgotten ages.
        </section>

        {/* CLICKABLE CHAPTER 7 TEXT */}
        <section id="pit" className="py-60 px-8 max-w-2xl mx-auto space-y-32">
          {paragraphs.map((p, i) => (
            <motion.div key={i} className="text-2xl md:text-3xl text-zinc-200 leading-[2.1] text-justify" style={{ textIndent: '4rem' }}>
              <span className="cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => console.log("Semantic Search Engaged")}>
                <OmniText words={p.words} />
              </span>
            </motion.div>
          ))}
        </section>

        <footer id="author" className="py-60 text-center bg-zinc-950/20 border-t border-zinc-900">
          <h3 className="text-white text-xs uppercase tracking-widest mb-6">About the Author</h3>
          <p className="text-zinc-500 text-sm">{ "Michael Alonza P. Ware" /* cite: User Summary */ }</p>
        </footer>
      </div>
    </div>
  );
}
