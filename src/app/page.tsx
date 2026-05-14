"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function LandingPage() {
  const [chapter, setChapter] = useState({ blocks: [] });
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const bgColor = useTransform(scrollYProgress, 
    [0, 0.25, 0.5, 0.65, 0.8, 0.95, 1], 
    ["#1a1a2e", "#2d2d4a", "#4a3a6a", "#7a3a3a", "#110d0d", "#000000", "#1a1a2a"]
  );
  
  const blurAmount = useTransform(scrollYProgress, [0, 0.65, 0.95, 1], [0, 5, 20, 0]);
  const textSkew = useTransform(scrollYProgress, [0.5, 0.65, 0.95, 1], [0, 1, -3, 0]);

  useEffect(() => {
    fetch('/data/chapters/7.txt')
      .then(res => res.text())
      .then(text => {
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const lineHeightPixels = 32; 
        const availableHeight = window.innerHeight * 0.75; 
        const linesPerScreen = Math.floor(availableHeight / lineHeightPixels);
        const wordsPerLine = window.innerWidth < 768 ? 6 : 10;
        const nativeBlockSize = Math.max(80, linesPerScreen * wordsPerLine);
        const blocks = [];
        for (let i = 0; i < words.length; i += nativeBlockSize) {
          blocks.push(words.slice(i, i + nativeBlockSize).join(' '));
        }
        setChapter({ blocks });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const getTextColor = (progress) => {
    if (progress < 0.25) return 'text-slate-200';
    if (progress < 0.50) return 'text-emerald-300';
    if (progress < 0.65) return 'text-amber-500';
    if (progress < 0.90) return 'text-red-700';
    return 'text-zinc-500';
  };

  return (
    <motion.main 
      ref={containerRef}
      style={{ backgroundColor: bgColor }}
      className="relative min-h-[400vh] text-slate-200 overflow-x-hidden font-serif"
    >
      <motion.div 
        className="fixed inset-0 z-0 opacity-30 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/bg.png")',
          filter: useTransform(blurAmount, v => `blur(${v}px)`)
        }}
      />

      <section className="relative z-10 h-screen flex flex-col items-center justify-center text-center p-6">
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

      <section id="dedication" className="relative z-10 h-screen flex flex-col items-center justify-center bg-black/60 border-y border-white/5">
        <h2 className="text-[9px] uppercase tracking-[0.6em] text-slate-500 mb-8">Dedication</h2>
        <p className="max-w-xl text-center italic text-3xl text-emerald-400/80 px-8">"For James Lee Ware."</p>
      </section>

      <section id="blurb" className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 md:p-24 bg-zinc-950/80">
        <h2 className="text-[9px] uppercase tracking-[0.6em] text-slate-500 mb-16">The Blurb</h2>
        <div className="max-w-2xl text-center space-y-6 text-lg md:text-xl leading-relaxed">
          <p>In 1003 BCE Hebron, a young boy named Dan possesses a rare gift: he can walk the dreamscape with full consciousness, moving between the layers of divine truth. His father, Aviel, is drowning in grief and hoarded stone.</p>
          <p>A journey from the lowlands of pride to the heights of love. A father left behind. A sister born from the depths of hell itself. And the ultimate question: Is clarity worth the cost of silence?</p>
          <p className="italic text-emerald-400/70">The Weight of the Sky is an archetypal tale set at the threshold where gods still walk the earth, and every step upward demands a sacrifice the heart never wants to give.</p>
        </div>
      </section>

      <section id="chapter7" className="relative z-10 p-8 md:p-32 bg-black/90">
        <h2 className="text-slate-500 uppercase tracking-widest text-[9px] mb-20 italic">VII. The Pit</h2>
        <div className="max-w-prose mx-auto space-y-24">
          {loading ? (
            <p className="animate-pulse text-slate-700 text-xl">Retrieving from the Pit...</p>
          ) : (
            chapter.blocks.map((block, i) => {
              const blockNarrativeProgress = i / Math.max(1, chapter.blocks.length - 1);
              return (
                <motion.p 
                  key={i}
                  style={{ skewY: textSkew }}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-25%" }}
                  className={`${getTextColor(blockNarrativeProgress)} text-2xl md:text-3xl leading-relaxed transition-all duration-700`}
                >
                  {block}
                </motion.p>
              )
            })
          )}
        </div>
      </section>
    </motion.main>
  );
}