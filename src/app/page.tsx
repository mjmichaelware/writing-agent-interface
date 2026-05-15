"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { OmniText } from '@/components/OmniText';
import { useViewport } from '@/hooks/useViewport';

function CommandCenter({ isOpen, close }: { isOpen: boolean, close: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-10"
        >
          <div className="w-full max-w-4xl space-y-10">
            <div className="flex justify-between items-center border-b border-cyan-900 pb-4">
              <h2 className="text-cyan-500 font-bold tracking-[0.5em] uppercase">Command Center</h2>
              <button onClick={close} className="text-zinc-500 hover:text-white">CLOSE [ESC]</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Search Corpus</p>
                <input type="text" placeholder="Search Names..." className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-cyan-500 outline-none" />
              </div>
              <div className="space-y-4">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Visual Control</p>
                <button className="w-full bg-zinc-900 p-4 text-left hover:bg-zinc-800">Toggle AI Gen Engine</button>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Feature Entry</p>
                <button className="w-full bg-zinc-900 p-4 text-left hover:bg-zinc-800">New Biblical Hyperlink</button>
              </div>
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

  // CINEMA REEL (Layer 1): Images fade in/out based on scroll depth
  const danOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [0, 1, 0]);
  const megiddoOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.4], [0, 1, 0]);
  const flyOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0]);

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
    <div ref={containerRef} className="relative bg-black text-white min-h-[500vh] selection:bg-cyan-500/30">
      
      {/* LAYER 3: COMMAND CENTER (Z-50) */}
      <button onClick={() => setIsDashOpen(true)} className="fixed top-6 right-6 z-40 bg-zinc-900/50 hover:bg-cyan-900 p-4 text-[10px] tracking-widest uppercase border border-zinc-800">
        Dashboard
      </button>
      <CommandCenter isOpen={isDashOpen} close={() => setIsDashOpen(false)} />

      {/* LAYER 1: THE CINEMA (Z-10) */}
      <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
        <motion.div style={{ opacity: danOpacity }} className="absolute inset-0 bg-[url('/dan_city.png')] bg-cover bg-center grayscale contrast-125" />
        <motion.div style={{ opacity: megiddoOpacity }} className="absolute inset-0 bg-[url('/megiddo.png')] bg-cover bg-center" />
        <motion.div style={{ opacity: flyOpacity }} className="absolute inset-0 bg-[url('/flies.png')] bg-cover bg-center" />
      </div>

      {/* LAYER 2: THE MANUSCRIPT (Z-20) */}
      <div className="relative z-20">
        
        {/* INTRO DECK */}
        <section className="h-screen flex flex-col items-center justify-center text-center p-10">
          <h1 className="text-7xl font-black tracking-tighter mb-4">THE WEIGHT<br/>OF THE SKY</h1>
          <p className="text-cyan-500 tracking-[1em] uppercase text-[10px] mb-12">Michael Alonza P. Ware</p>
          
          <div className="flex gap-4 mb-20">
            <button onClick={() => scrollTo('dedication')} className="px-6 py-2 border border-zinc-800 text-[10px] uppercase tracking-widest hover:bg-zinc-900">Dedication</button>
            <button onClick={() => scrollTo('blurb')} className="px-6 py-2 border border-zinc-800 text-[10px] uppercase tracking-widest hover:bg-zinc-900">The Blurb</button>
            <button onClick={() => scrollTo('author')} className="px-6 py-2 border border-zinc-800 text-[10px] uppercase tracking-widest hover:bg-zinc-900">The Author</button>
            <button onClick={() => scrollTo('pit')} className="px-6 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-bold">Enter The Pit</button>
          </div>
        </section>

        {/* METADATA SECTIONS */}
        <section id="dedication" className="h-screen flex items-center justify-center italic text-zinc-500">
          "Dedicated to the searchers of the light."
        </section>

        <section id="blurb" className="max-w-xl mx-auto py-40 px-10 text-justify text-zinc-400 leading-relaxed">
          <h3 className="text-white uppercase tracking-[0.5em] text-xs mb-8">The Blurb</h3>
          At the gates of Megiddo, history isn't just buried; it's waiting.
        </section>

        {/* THE MANUSCRIPT (CHAPTER 7) */}
        <section id="pit" className="py-60 px-8 max-w-2xl mx-auto space-y-32 font-[var(--font-hebrew)]">
          {paragraphs.map((p, i) => (
            <motion.div key={i} className="text-2xl md:text-3xl text-zinc-200 leading-[2.1] text-justify" style={{ textIndent: '4rem' }}>
              <span className="cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => console.log("Word Insight Triggered")}>
                <OmniText words={p.words} />
              </span>
            </motion.div>
          ))}
        </section>

        <section id="author" className="py-40 bg-zinc-950/50 text-center">
          <h3 className="text-white uppercase tracking-[0.5em] text-xs mb-8">About the Author</h3>
          <p className="max-w-md mx-auto text-zinc-500 text-sm">Michael Alonza P. Ware is the architect of the Singularity Narrative OS.</p>
        </section>
      </div>
    </div>
  );
}
