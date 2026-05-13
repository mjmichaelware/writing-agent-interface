"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [chapter, setChapter] = useState({ blocks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    fetch('/data/chapters/7.txt')
      .then(res => res.text())
      .then(text => {
        const words = text.split(/\s+/);
        const blocks = [];
        for (let i = 0; i < words.length; i += 200) {
          blocks.push(words.slice(i, i + 200).join(' '));
        }
        setChapter({ blocks });
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="relative bg-black min-h-[400vh] text-slate-200 overflow-x-hidden font-serif">
      
      <div 
        className="fixed inset-0 z-0 opacity-40 transition-all duration-1000"
        style={{
          backgroundImage: 'url("/bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: scrolled ? 'blur(10px) brightness(0.5)' : 'none'
        }}
      />

      <section className="relative z-10 h-screen flex flex-col items-center justify-between py-20 px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl">
            THE WEIGHT<br/>OF THE SKY
          </h1>
          <p className="text-cyan-500 tracking-[0.4em] uppercase text-xs mt-6">An Archetypal Tale</p>
        </motion.div>

        <div className="w-full max-w-sm space-y-4">
          <button onClick={() => scrollTo('dedication')} className="w-full py-4 border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 hover:border-cyan-500 transition-all">
            Dedication
          </button>
          <button onClick={() => scrollTo('blurb')} className="w-full py-4 border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 hover:border-purple-500 transition-all">
            The Blurb
          </button>
          <button onClick={() => scrollTo('chapter7')} className="w-full py-4 border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.4em] hover:bg-cyan-500 hover:text-black transition-all">
            Begin Reading
          </button>
        </div>

        <p className="text-[10px] tracking-[0.5em] text-slate-500 uppercase">Michael Alonza P. Ware</p>
      </section>

      <section id="dedication" className="relative z-10 h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black/80 to-zinc-950/80 border-y border-white/5">
        <h2 className="text-[10px] uppercase tracking-[0.6em] text-slate-500 mb-8">Dedication</h2>
        <p className="max-w-xl text-center italic text-2xl md:text-4xl text-emerald-400/80 px-8">
          "For James Lee Ware."
        </p>
      </section>

      <section id="blurb" className="relative z-10 min-h-screen flex flex-col items-center justify-center p-10 md:p-20 bg-zinc-950">
        <h2 className="text-[10px] uppercase tracking-[0.6em] text-slate-500 mb-16">The Blurb</h2>
        <div className="max-w-2xl text-center text-lg md:text-xl leading-relaxed opacity-90 space-y-6">
          <p>In 1003 BCE Hebron, a young boy named Dan possesses a rare gift: he can walk the dreamscape with full consciousness, moving between the layers of divine truth. His father, Aviel, is drowning in grief and hoarded stone. When Dan refuses to save him—choosing instead to climb Mount Hermon and seek the Source—he begins a spiritual ascent that will strip from him everything he loves.</p>
          <p>A journey from the lowlands of pride to the heights of love. A father left behind. A sister born from the depths of hell itself. And the ultimate question: Is clarity worth the cost of silence?</p>
          <p className="italic text-emerald-400/70">The Weight of the Sky is an archetypal tale set at the threshold where gods still walk the earth, and every step upward demands a sacrifice the heart never wants to give.</p>
        </div>
      </section>

      <section id="chapter7" className="relative z-10 p-12 md:p-32 bg-black min-h-screen">
        <h2 className="text-slate-500 uppercase tracking-widest text-[10px] mb-20">VII. The Pit</h2>
        <div className="max-w-prose mx-auto space-y-12 text-2xl md:text-3xl leading-relaxed">
          {loading ? (
            <p className="animate-pulse text-slate-700">Retrieving from the Pit...</p>
          ) : (
            chapter.blocks.slice(0, 5).map((block, i) => <p key={i} className="text-slate-200">{block}</p>)
          )}
        </div>
      </section>
    </main>
  );
}
