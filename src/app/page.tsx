"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function WritingAgentInterface() {
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const chapter7Ref = useRef(null);
  
  // SCROLL TRACKING
  const { scrollYProgress: pageScroll } = useScroll({ target: containerRef });
  const { scrollYProgress: chapterScroll } = useScroll({ 
    target: chapter7Ref,
    offset: ["start end", "end start"]
  });

  // LAYER 0: THE MOON BACKDROP FADE
  const moonOpacity = useTransform(pageScroll, [0, 0.15, 0.3], [1, 0.5, 0]);

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

  // THE SYSTEM: Dynamic Text Styling
  const getDynamicStyle = (index) => {
    const progress = index / Math.max(1, paragraphs.length - 1);
    if (progress < 0.2) return 'text-slate-200';
    if (progress < 0.4) return 'text-emerald-400/90';
    if (progress < 0.6) return 'text-amber-500/80';
    if (progress < 0.8) return 'text-red-700'; // The color of old blood
    return 'text-zinc-500';
  };

  return (
    <div ref={containerRef} className="relative bg-black min-h-screen selection:bg-emerald-500/30">
      
      {/* LAYER 0: THE BACKDROP (Always Moon, No Galaxy Fallback) */}
      <motion.img 
        src="/bg.png?v=5" 
        style={{ opacity: moonOpacity }}
        className="fixed inset-0 w-full h-full object-contain z-0 pointer-events-none"
      />

      {/* FRONT LAYER: THE TEXT (The System) */}
      <div className="relative z-10" style={{ fontFamily: 'var(--font-hebrew), serif' }}>
        
        {/* TITLE SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2 }}>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-[0_0_20px_rgba(0,0,0,1)] leading-none">
              THE WEIGHT<br/>OF THE SKY
            </h1>
            <p className="text-cyan-500 tracking-[0.5em] uppercase text-[10px] mt-6">An Archetypal Tale</p>
          </motion.div>
          
          <div className="w-full max-w-xs space-y-4 mt-24 font-sans">
            <button onClick={() => scrollTo('dedication')} className="w-full py-4 border border-white/10 bg-black/40 text-[9px] uppercase tracking-[0.5em] backdrop-blur-md">Dedication</button>
            <button onClick={() => scrollTo('blurb')} className="w-full py-4 border border-white/10 bg-black/40 text-[9px] uppercase tracking-[0.5em] backdrop-blur-md">The Blurb</button>
            <button onClick={() => scrollTo('chapter7')} className="w-full py-4 border border-white/30 bg-white/5 text-[9px] uppercase tracking-[0.6em] backdrop-blur-md">Begin Reading</button>
          </div>
          <p className="text-[10px] tracking-[0.5em] text-slate-500 uppercase mt-20">Michael Alonza P. Ware</p>
        </section>

        {/* DEDICATION SECTION */}
        <section id="dedication" className="min-h-screen flex flex-col items-center justify-center bg-black/60 border-y border-white/5">
          <h2 className="text-[9px] uppercase tracking-[0.6em] text-slate-500 mb-8 font-sans">Dedication</h2>
          <p className="max-w-xl text-center italic text-4xl text-emerald-400/80 px-8">"For James Lee Ware."</p>
        </section>

        {/* BLURB SECTION (Full Restore) */}
        <section id="blurb" className="min-h-screen flex flex-col items-center justify-center p-8 md:p-24 bg-zinc-950/90">
          <h2 className="text-[9px] uppercase tracking-[0.6em] text-slate-500 mb-16 font-sans">The Blurb</h2>
          <div className="max-w-2xl text-center space-y-8 text-lg md:text-xl leading-relaxed">
            <p>In 1003 BCE Hebron, a young boy named Dan possesses a rare gift: he can walk the dreamscape with full consciousness, moving between the layers of divine truth.</p>
            <p>A journey from the lowlands of pride to the heights of love. A father left behind. A sister born from the depths of hell itself. And the ultimate question: Is clarity worth the cost of silence?</p>
            <p className="italic text-emerald-400/70">The Weight of the Sky is an archetypal tale set at the threshold where gods still walk the earth, and every step upward demands a sacrifice the heart never wants to give.</p>
          </div>
        </section>

        {/* THE MANUSCRIPT (With Distortion System) */}
        <article ref={chapter7Ref} id="chapter7" className="max-w-2xl mx-auto py-60 px-6 bg-black/95">
          <h2 className="text-center text-zinc-700 uppercase tracking-[1em] text-[10px] mb-60 italic font-sans">VII. The Pit</h2>
          <div className="space-y-20">
            {loading ? (
              <p className="text-center text-zinc-800 animate-pulse">Retrieving...</p>
            ) : (
              paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 50, filter: "blur(15px)", skewX: -6 }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", skewX: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className={`${getDynamicStyle(i)} text-2xl md:text-3xl leading-[1.9]`}
                  style={{ textIndent: "4rem", textAlign: "justify" }}
                >
                  {para}
                </motion.p>
              ))
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
