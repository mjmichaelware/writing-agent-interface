"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function LandingPage() {
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const chapter7Ref = useRef(null);
  
  const { scrollYProgress: pageScroll } = useScroll({ target: containerRef });
  const { scrollYProgress: chapterScroll } = useScroll({ 
    target: chapter7Ref,
    offset: ["start end", "end start"]
  });

  const galaxyColor = useTransform(chapterScroll,
    [0, 0.2, 0.4, 0.55, 0.75, 0.9, 1],
    ["#1a1a2e", "#2d2d4a", "#4a3a6a", "#7a3a3a", "#110d0d", "#000000", "#1a1a2a"]
  );

  useEffect(() => {
    fetch('/data/chapters/7.txt')
      .then(res => res.text())
      .then(text => {
        const cleaned = text.replace(/\*\*/g, '').replace(/\*/g, '');
        const blocks = cleaned.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        setParagraphs(blocks);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div ref={containerRef} className="relative font-serif text-slate-200">
      {/* LAYER 0: THE GALAXY (Deep Background) */}
      <motion.div 
        style={{ backgroundColor: galaxyColor }}
        className="fixed inset-0 z-0"
      />

      {/* LAYER 50: THE MOON BOY (NUCLEAR VISIBILITY) */}
      <div
        className="fixed inset-0 z-50 bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: 'url("/bg.png")',
          backgroundSize: 'contain',
          opacity: 1
        }}
      />

      {/* LAYER 100: THE CONTENT (Top Layer) */}
      <div className="relative z-[100]">
        
        <section className="min-h-screen flex flex-col items-center justify-center text-center p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-[0_0_35px_rgba(0,0,0,0.9)] leading-none">
              THE WEIGHT<br/>OF THE SKY
            </h1>
            <p className="text-cyan-500 tracking-[0.4em] uppercase text-[10px] mt-4">An Archetypal Tale</p>
          </motion.div>

          <div className="w-full max-w-xs space-y-3 mt-20 font-sans">
            <button onClick={() => scrollTo('dedication')} className="w-full py-4 border border-white/20 bg-black/40 text-[10px] uppercase tracking-[0.4em] backdrop-blur-md">Dedication</button>
            <button onClick={() => scrollTo('blurb')} className="w-full py-4 border border-white/20 bg-black/40 text-[10px] uppercase tracking-[0.4em] backdrop-blur-md">The Blurb</button>
            <button onClick={() => scrollTo('chapter7')} className="w-full py-4 border border-white/40 bg-white/10 text-[10px] uppercase tracking-[0.4em] backdrop-blur-md">Begin Reading</button>
          </div>
          <p className="text-[10px] tracking-[0.5em] text-slate-500 uppercase mt-20">Michael Alonza P. Ware</p>
        </section>

        <section id="dedication" className="min-h-screen flex flex-col items-center justify-center bg-black/60 border-y border-white/5">
          <p className="max-w-xl text-center italic text-3xl text-emerald-400/90 px-8">"For James Lee Ware."</p>
        </section>

        <section id="blurb" className="min-h-screen flex flex-col items-center justify-center p-8 md:p-24 bg-zinc-950/80">
          <div className="max-w-2xl text-center space-y-8 text-lg md:text-xl leading-relaxed">
            <p>A journey from the lowlands of pride to the heights of love. A father left behind. A sister born from the depths of hell itself.</p>
            <p className="italic text-emerald-400/70 text-lg">"Is clarity worth the cost of silence?"</p>
          </div>
        </section>

        <article ref={chapter7Ref} id="chapter7" className="max-w-2xl mx-auto py-40 px-6 bg-black/90">
          <h2 className="text-center text-zinc-600 uppercase tracking-[0.8em] text-[10px] mb-40 italic">VII. The Pit</h2>
          <div className="space-y-12">
            {loading ? (
              <p className="text-center animate-pulse text-zinc-700 text-xl">Retrieving...</p>
            ) : (
              paragraphs.map((para, i) => (
                <p key={i} className="text-xl md:text-2xl leading-relaxed text-slate-300" style={{ textIndent: "3.5rem", textAlign: "justify" }}>
                  {para}
                </p>
              ))
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
