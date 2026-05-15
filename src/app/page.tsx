"use client";
import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SidebarProvider } from '@/context/SidebarContext';
import { ReaderLayout } from '@/components/ReaderLayout';
import { OmniText } from '@/components/OmniText';

function InfiniteReelContent() {
  const [xmlContent, setXmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const moonOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 0.5, 0]);

  useEffect(() => {
    fetch('/api/chapters?slug=7')
      .then(res => res.json())
      .then(data => {
        setXmlContent(data.xml || data.text);
        setLoading(false);
      });
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <ReaderLayout>
      <div ref={containerRef} className="relative bg-black min-h-screen selection:bg-emerald-500/30">
        
        {/* LAYER 0: THE BACKDROP */}
        <motion.img 
          src="/bg.png" 
          style={{ opacity: moonOpacity }}
          className="fixed inset-0 w-full h-full object-contain z-0 pointer-events-none"
        />

        <div className="relative z-10" style={{ fontFamily: 'var(--font-hebrew), serif' }}>
          
          {/* TITLE SECTION WITH COMMAND BUTTONS */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2 }}>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(0,0,0,1)] leading-none mb-6">
                THE WEIGHT<br/>OF THE SKY
              </h1>
              <p className="text-cyan-500 tracking-[0.5em] uppercase text-[10px] italic">An Archetypal Tale</p>
            </motion.div>
            
            <div className="w-full max-w-xs space-y-4 mt-24 font-sans">
              <button onClick={() => scrollTo('dedication')} className="w-full py-4 border border-white/10 bg-black/40 text-[9px] uppercase tracking-[0.5em] backdrop-blur-md hover:bg-white/5 transition-all">Dedication</button>
              <button onClick={() => scrollTo('blurb')} className="w-full py-4 border border-white/10 bg-black/40 text-[9px] uppercase tracking-[0.5em] backdrop-blur-md hover:bg-white/5 transition-all">The Blurb</button>
              <button onClick={() => scrollTo('chapter7')} className="w-full py-4 border border-white/30 bg-white/5 text-[9px] uppercase tracking-[0.6em] backdrop-blur-md hover:bg-white/10 transition-all">Begin Reading</button>
            </div>
            
            <p className="text-[10px] tracking-[0.5em] text-slate-500 uppercase mt-20">Michael Alonza P. Ware</p>
          </section>

          {/* DEDICATION SECTION */}
          <section id="dedication" className="min-h-screen flex flex-col items-center justify-center bg-black/60 border-y border-white/5 px-8">
            <h2 className="text-[9px] uppercase tracking-[0.6em] text-slate-500 mb-12 font-sans">Dedication</h2>
            <p className="max-w-2xl text-center italic text-4xl md:text-5xl text-emerald-400/80 leading-snug">
              Dedicated to James Lee Ware (To keep Curious)
            </p>
          </section>

          {/* BLURB SECTION */}
          <section id="blurb" className="min-h-screen flex flex-col items-center justify-center p-8 md:p-24 bg-zinc-950/90 text-center">
            <h2 className="text-[9px] uppercase tracking-[0.6em] text-slate-500 mb-16 font-sans">The Blurb</h2>
            <div className="max-w-2xl space-y-10 text-xl text-zinc-400 leading-relaxed font-serif">
              <p>In 1003 BCE Hebron, a young boy named Dan possesses a rare gift: he can walk the dreamscape with full consciousness, moving between the layers of divine truth.</p>
              <p>A journey from the lowlands of pride to the heights of love. A father left behind. A sister born from the depths of hell itself. And the ultimate question: Is clarity worth the cost of silence?</p>
              <p className="italic text-emerald-400/70 border-t border-white/5 pt-10">The Weight of the Sky is set at the threshold where gods still walk the earth, and every step upward demands a sacrifice the heart never wants to give.</p>
            </div>
          </section>

          {/* THE MANUSCRIPT (EMA RENDER) */}
          <article id="chapter7" className="max-w-3xl mx-auto py-60 px-6 bg-black/95">
            <h2 className="text-center text-zinc-700 uppercase tracking-[1.5em] text-[10px] mb-60 italic font-sans">VII. The Pit</h2>
            {loading ? (
              <p className="text-center text-zinc-800 animate-pulse uppercase tracking-widest text-xs">Synchronizing EMA Data...</p>
            ) : (
              <OmniText xmlData={xmlContent} />
            )}
          </article>

          {/* ABOUT THE AUTHOR */}
          <section className="py-40 text-center bg-black border-t border-white/5">
             <h3 className="text-[9px] uppercase tracking-[0.6em] text-zinc-600 mb-4 font-sans">About the Author</h3>
             <p className="text-zinc-500 font-serif italic text-lg tracking-widest uppercase">Michael Alonza P. Ware</p>
          </section>
        </div>
      </div>
    </ReaderLayout>
  );
}

export default function Page() {
  return (
    <SidebarProvider>
      <InfiniteReelContent />
    </SidebarProvider>
  );
}
