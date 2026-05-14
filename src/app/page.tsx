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

  const moonOpacity = useTransform(pageScroll, [0, 0.1, 0.25], [0.8, 0.5, 0]);
  const moonScale = useTransform(pageScroll, [0, 0.3], [1, 1.15]);

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

  const getTextColor = (progress) => {
    if (progress < 0.2) return 'text-slate-200';
    if (progress < 0.45) return 'text-emerald-300';
    if (progress < 0.6) return 'text-amber-500';
    if (progress < 0.85) return 'text-red-700';
    return 'text-zinc-500';
  };

  return (
    <div ref={containerRef} className="relative font-serif text-slate-200">
      <motion.div 
        style={{ backgroundColor: galaxyColor }}
        className="fixed inset-0 z-[-2]"
      />

      <motion.div
        className="fixed inset-0 z-[-1] bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: 'url("/bg.png")',
          backgroundSize: 'contain',
          opacity: moonOpacity,
          scale: moonScale,
          filter: "brightness(0.8) contrast(1.1)"
        }}
      />

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl leading-none">
            THE WEIGHT<br/>OF THE SKY
          </h1>
          <p className="text-cyan-500 tracking-[0.4em] uppercase text-[10px] mt-4">An Archetypal Tale</p>
        </motion.div>

        <div className="w-full max-w-xs space-y-3 mt-20">
          <button onClick={() => scrollTo('dedication')} className="w-full py-4 border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.4em] hover:border-emerald-500 transition-all">Dedication</button>
          <button onClick={() => scrollTo('blurb')} className="w-full py-4 border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.4em] hover:border-purple-500 transition-all">The Blurb</button>
          <button onClick={() => scrollTo('chapter7')} className="w-full py-4 border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all">Begin Reading</button>
        </div>

        <p className="text-[10px] tracking-[0.5em] text-slate-500 uppercase mt-20">Michael Alonza P. Ware</p>
      </section>

      <section id="dedication" className="relative z-10 min-h-screen flex flex-col items-center justify-center bg-black/40">
        <h2 className="text-[9px] uppercase tracking-[0.6em] text-slate-500 mb-8">Dedication</h2>
        <p className="max-w-xl text-center italic text-3xl text-emerald-400/80 px-8">"For James Lee Ware."</p>
      </section>

      <section id="blurb" className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 md:p-24 bg-zinc-950/70">
        <h2 className="text-[9px] uppercase tracking-[0.6em] text-slate-500 mb-16">The Blurb</h2>
        <div className="max-w-2xl text-center space-y-6 text-lg md:text-xl leading-relaxed">
          <p>In 1003 BCE Hebron, a young boy named Dan possesses a rare gift: he can walk the dreamscape with full consciousness, moving between the layers of divine truth. His father, Aviel, is drowning in grief and hoarded stone.</p>
          <p>A journey from the lowlands of pride to the heights of love. A father left behind. A sister born from the depths of hell itself. And the ultimate question: Is clarity worth the cost of silence?</p>
          <p className="italic text-emerald-400/70">The Weight of the Sky is an archetypal tale set at the threshold where gods still walk the earth, and every step upward demands a sacrifice the heart never wants to give.</p>
        </div>
      </section>

      <article ref={chapter7Ref} id="chapter7" className="relative z-10 max-w-2xl mx-auto py-40 px-6">
        <h2 className="text-center text-zinc-600 uppercase tracking-[0.8em] text-[10px] mb-40 italic">VII. The Pit</h2>
        <div className="space-y-10">
          {loading ? (
            <p className="text-center animate-pulse text-zinc-700 text-xl">Retrieving from the Pit...</p>
          ) : (
            paragraphs.map((para, i) => {
              const progress = i / Math.max(1, paragraphs.length - 1);
              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className={`${getTextColor(progress)} text-xl md:text-2xl`}
                  style={{
                    textIndent: "3rem",
                    textAlign: "justify",
                    lineHeight: "1.8"
                  }}
                >
                  {para}
                </motion.p>
              );
            })
          )}
        </div>
      </article>
    </div>
  );
}
