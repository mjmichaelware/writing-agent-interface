"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function LandingPage() {
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const chapter7Ref = useRef(null);
  
  const { scrollYProgress: chapterScroll } = useScroll({ 
    target: chapter7Ref,
    offset: ["start end", "end start"]
  });

  const galaxyColor = useTransform(chapterScroll,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ["#0a0a1a", "#1a1a2e", "#2a1a3a", "#3a1010", "#000000", "#0a0a1a"]
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
    <div ref={containerRef} className="relative bg-black font-serif text-slate-200 selection:bg-emerald-500/30">
      
      {/* LAYER 0: GALAXY */}
      <motion.div style={{ backgroundColor: galaxyColor }} className="fixed inset-0 z-0" />

      {/* LAYER 10: THE MOON BOY (THE NUCLEAR OPTION: ACTUAL IMG TAG) */}
      <img 
        src="/bg.png?v=2" 
        alt="The Weight of the Sky"
        className="fixed inset-0 w-full h-full object-contain z-10 pointer-events-none opacity-100"
      />

      {/* LAYER 20: THE CONTENT */}
      <div className="relative z-20">
        
        <section className="min-h-screen flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-[0_0_35px_rgba(0,0,0,0.9)]">
            THE WEIGHT<br/>OF THE SKY
          </h1>
          
          <div className="w-full max-w-xs space-y-3 mt-20 font-sans">
            <button onClick={() => scrollTo('dedication')} className="w-full py-4 border border-white/20 bg-black/60 text-[10px] uppercase tracking-[0.4em] backdrop-blur-md">Dedication</button>
            <button onClick={() => scrollTo('blurb')} className="w-full py-4 border border-white/20 bg-black/60 text-[10px] uppercase tracking-[0.4em] backdrop-blur-md">The Blurb</button>
            <button onClick={() => scrollTo('chapter7')} className="w-full py-4 border border-white/40 bg-white/10 text-[10px] uppercase tracking-[0.4em] backdrop-blur-md">Begin Reading</button>
          </div>
        </section>

        <section id="dedication" className="min-h-screen flex flex-col items-center justify-center bg-black/80">
          <p className="max-w-xl text-center italic text-3xl text-emerald-400/90 px-8">"For James Lee Ware."</p>
        </section>

        <section id="blurb" className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-950/90">
          <div className="max-w-2xl text-center space-y-8 text-xl leading-relaxed">
            <p>A journey from the lowlands of pride to the heights of love.</p>
            <p className="italic text-emerald-400/70">"Is clarity worth the cost of silence?"</p>
          </div>
        </section>

        <article ref={chapter7Ref} id="chapter7" className="max-w-2xl mx-auto py-40 px-6 bg-black/95">
          <h2 className="text-center text-zinc-600 uppercase tracking-[0.8em] text-[10px] mb-40 italic">VII. The Pit</h2>
          <div className="space-y-12">
            {!loading && paragraphs.map((para, i) => (
              <p key={i} className="text-2xl leading-relaxed text-slate-300" style={{ textIndent: "4rem", textAlign: "justify" }}>
                {para}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
