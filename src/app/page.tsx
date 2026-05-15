"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { OmniText } from '@/components/OmniText';
import { useRuntime } from '@/runtime/runtimeContext';
import { initAudioListener } from '@/features/audioListener';
import { initThematicListener } from '@/features/thematicListener';
import { initDistortionListener } from '@/features/distortionListener';

/**
 * LAYER 3: THE COMMAND CENTER (Z-50)
 * Retractable overlay sitting ABOVE the manuscript.
 */
function Dashboard({ isOpen, close, nodeCount }: { isOpen: boolean; close: () => void; nodeCount: number }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
          className="fixed inset-0 z-50 flex justify-end"
        >
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={close} />
          <div className="relative w-full max-w-xl h-full bg-zinc-950 border-l border-cyan-900/30 p-12 space-y-12 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-6 text-cyan-500">
              <h2 className="font-bold tracking-[0.5em] text-[10px] uppercase">Command Center</h2>
              <button onClick={close} className="text-zinc-600 hover:text-white uppercase text-[10px]">Close</button>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <div className="p-8 bg-zinc-900/50 border border-zinc-800 space-y-6 text-cyan-400">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans">Graph Manifest</p>
                <p className="text-3xl font-light tracking-tighter">{nodeCount} Nodes Active</p>
                <button className="w-full bg-cyan-950/40 p-4 text-left text-[10px] tracking-widest uppercase hover:bg-cyan-900 border border-cyan-900/20">Search 181 Nodes</button>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans text-cyan-500">EMA Functions</p>
                <button className="w-full bg-zinc-900 p-4 text-left text-[10px] tracking-widest uppercase hover:bg-cyan-900 border border-zinc-800">Biblical Hyperlinks</button>
                <button className="w-full bg-zinc-900 p-4 text-left text-[10px] tracking-widest uppercase hover:bg-cyan-900 border border-zinc-800">Narrative Foreshadowing</button>
                <button className="w-full bg-zinc-900 p-4 text-left text-[10px] tracking-widest uppercase hover:bg-cyan-900 border border-zinc-800">EMA Metadata Viewer</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SingularityOS() {
  const { bus } = useRuntime();
  const [paragraphs, setParagraphs] = useState<any[]>([]);
  const [isDashOpen, setIsDashOpen] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const cinemaOpacity = useTransform(scrollYProgress, [0, 0.15, 0.4], [1, 1, 0]);

  useEffect(() => {
    initAudioListener(bus);
    initThematicListener(bus);
    initDistortionListener(bus);

    const unsubscribe = scrollYProgress.on("change", (v) => {
      bus.emit("scroll:update", { depth: v });
    });

    fetch('/api/chapters?slug=7').then(r => r.json()).then(d => {
      if (d.xml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(`<root>${d.xml}</root>`, "text/xml");
        setParagraphs(Array.from(xmlDoc.getElementsByTagName("paragraph")).map((p, i) => ({
          words: Array.from(p.getElementsByTagName("word")).map(w => ({ 
            text: w.textContent, color: w.getAttribute("color"), font: w.getAttribute("font"), intensity: w.getAttribute("intensity")
          })),
          isBlood: i > 12 
        })));
        bus.emit("chapter:load", { id: 7 });
      }
    });
    return () => unsubscribe();
  }, [bus, scrollYProgress]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div ref={containerRef} className="relative bg-[#000000] text-white min-h-[1000vh] font-[var(--font-hebrew)] selection:bg-cyan-500/30">
      
      {/* LAYER 3: HUD (Z-50) */}
      <button onClick={() => setIsDashOpen(true)} className="fixed top-8 right-8 z-40 bg-zinc-900/40 p-4 border border-zinc-800 text-[10px] tracking-widest uppercase hover:bg-cyan-900 backdrop-blur-md transition-all">
        Dashboard
      </button>
      <Dashboard isOpen={isDashOpen} close={() => setIsDashOpen(false)} nodeCount={181} />

      {/* LAYER 1: CINEMA (Z-10) - Fixed Backdrop */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <motion.img 
          src="/bg.png" 
          style={{ opacity: cinemaOpacity }} 
          className="w-full h-full object-cover grayscale contrast-[1.2] brightness-[0.7]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
      </div>

      {/* LAYER 2: MANUSCRIPT (Z-20) - Glass Layer */}
      <div className="relative z-20">
        
        {/* TITLE SECTION */}
        <section className="h-screen flex flex-col items-center justify-center text-center p-10 bg-black/40 backdrop-blur-sm">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 uppercase leading-none mix-blend-difference">
            THE WEIGHT<br/>OF THE SKY
          </h1>
          <p className="text-cyan-500 tracking-[1.5em] uppercase text-[10px] mb-20 font-sans font-bold">
            Michael Alonza P. Ware
          </p>
          <div className="flex gap-6">
            <button onClick={() => scrollTo('dedication')} className="px-10 py-4 border border-zinc-800 text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-900 transition-all">Dedication</button>
            <button onClick={() => scrollTo('blurb')} className="px-10 py-4 border border-zinc-800 text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-900 transition-all">The Blurb</button>
            <button onClick={() => scrollTo('pit')} className="px-10 py-4 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-black hover:bg-cyan-500 transition-all">Enter The Pit</button>
          </div>
        </section>

        {/* DEDICATION */}
        <section id="dedication" className="h-screen flex items-center justify-center italic text-4xl text-emerald-400/80 px-10 text-center bg-transparent">
          "For James Lee Ware."
        </section>

        {/* THE HEBRON BLURB */}
        <section id="blurb" className="min-h-screen flex flex-col items-center justify-center p-10 md:p-24 bg-transparent border-y border-zinc-900/10 backdrop-blur-[2px]">
          <h2 className="text-[10px] uppercase tracking-[0.8em] text-slate-500 mb-20 font-sans">The Narrative Blurb</h2>
          <div className="max-w-2xl text-center space-y-12 text-xl md:text-2xl leading-[1.8] font-light">
            <p>In 1003 BCE Hebron, a young boy named Dan possesses a rare gift: he can walk the dreamscape with full consciousness, moving between the layers of divine truth.</p>
            <p>A journey from the lowlands of pride to the heights of love. A father left behind. A sister born from the depths of hell itself.</p>
            <p className="italic text-emerald-400/70 border-t border-zinc-900/20 pt-12">The Weight of the Sky is an archetypal tale set at the threshold where gods still walk the earth...</p>
          </div>
        </section>

        {/* CHAPTER 7 MANUSCRIPT (4rem indents) */}
        <section id="pit" className="py-60 px-8 max-w-2xl mx-auto space-y-32 bg-transparent">
          {paragraphs.map((p, i) => (
            <motion.div 
              key={i} 
              onViewportEnter={() => bus.emit("block:render", { tone: p.words[0]?.intensity })}
              className={`text-2xl md:text-3xl leading-[2.1] text-justify selection:bg-red-900/50 ${p.isBlood ? 'text-red-700/90' : 'text-zinc-200'}`} 
              style={{ textIndent: '4rem' }}
            >
              <OmniText words={p.words} />
            </motion.div>
          ))}
        </section>

        {/* AUTHOR SECTION */}
        <section className="py-80 text-center bg-black/60 border-t border-zinc-900/50">
          <h3 className="text-white uppercase tracking-[0.6em] text-[10px] mb-10 font-sans opacity-40">Architect of the Singularity</h3>
          <p className="text-white text-3xl font-black tracking-tighter mb-4">MICHAEL ALONZA P. WARE</p>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">Architect of the Singularity Narrative OS and writer of the Weight of the Sky manifest.</p>
        </section>
      </div>
    </div>
  );
}
