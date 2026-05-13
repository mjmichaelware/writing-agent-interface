"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [chapter, setChapter] = useState({ blocks: [] });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const fetchChapter = async (retries = 3) => {
      try {
        setLoading(true);
        const res = await fetch('/api/chapters?slug=7');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setChapter(data);
        setError(false);
      } catch (e) {
        if (retries > 0) {
          setTimeout(() => fetchChapter(retries - 1), 2000);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="relative bg-black min-h-[300vh] text-slate-200 font-serif overflow-x-hidden">
      <div 
        className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'url("/bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transform: scrolled ? 'scale(1.05)' : 'scale(1)',
          filter: scrolled ? 'blur(8px)' : 'blur(0px)',
          transition: 'all 0.7s ease-out'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-zinc-950" />
      </div>

      <section className="relative z-10 h-screen flex flex-col items-center justify-between py-16 px-6">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none text-white drop-shadow-2xl">
            THE WEIGHT<br/>OF THE SKY
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-cyan-500 tracking-[0.4em] uppercase text-xs mt-6"
          >
            An Archetypal Tale
          </motion.p>
        </motion.div>

        <div className="w-full max-w-sm space-y-4">
          {[
            { label: 'Dedication', id: 'dedication' },
            { label: 'The Blurb', id: 'chapter7' },
            { label: 'Begin Reading', id: 'chapter7' }
          ].map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + (i * 0.2) }}
              onClick={() => scrollToSection(item.id)}
              className="w-full py-4 border-y border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 hover:text-cyan-400 transition-all duration-300 cursor-pointer"
            >
              {item.label}
            </motion.button>
          ))}
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="text-[10px] tracking-[0.5em] text-slate-500 uppercase"
        >
          Michael Alonza P. Ware
        </motion.p>
      </section>

      <section id="dedication" className="relative z-10 h-screen flex items-center justify-center bg-gradient-to-b from-black/80 to-zinc-950/80 border-y border-white/5">
        <p className="max-w-xl text-center italic text-2xl md:text-3xl text-emerald-400/70 px-6">
          "Dedicated to those who survive the storm."
        </p>
      </section>

      <section id="chapter7" className="relative z-10 p-8 md:p-24 bg-zinc-950 min-h-screen flex items-center">
        <div className="max-w-prose mx-auto w-full">
          <h2 className="text-slate-500 uppercase tracking-widest text-[10px] mb-16 italic">VII. The Pit</h2>
          <div className="space-y-12 text-xl md:text-2xl leading-relaxed opacity-90">
            {error ? (
              <p className="text-red-900/60">Manuscript retrieval encountered an error. Please refresh the page.</p>
            ) : loading ? (
              <p className="text-slate-700 animate-pulse">Retrieving manuscript from archive...</p>
            ) : chapter.blocks && chapter.blocks.length > 0 ? (
              chapter.blocks.slice(0, 3).map((block, i) => <p key={i} className="text-slate-200">{block}</p>)
            ) : (
              <p className="text-slate-700">No content available.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
