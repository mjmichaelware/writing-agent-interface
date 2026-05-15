"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OmniText } from '@/components/OmniText';
import { getRuntime } from '@/runtime/runtimeContext';
import { initAudioListener } from '@/features/audioListener';
import { initThematicListener } from '@/features/thematicListener';
import { initDistortionListener } from '@/features/distortionListener';

type SectionId = 'title' | 'dedication' | 'blurb' | 'pit' | 'author';
type Word = { text?: string | null; color?: string | null; font?: string | null };
type Paragraph = { words: Word[]; isBlood: boolean };

// ─── Z-10: CINEMA — single fixed layer, content swaps per active section ───
function CinemaLayer({ active }: { active: SectionId }) {
  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      {/* Moon Boy — only on title */}
      <motion.img
        src="/bg.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        initial={false}
        animate={{
          opacity: active === 'title' ? 1 : 0,
          scale: active === 'title' ? 1 : 1.05,
        }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
        style={{ filter: 'grayscale(0.15) contrast(1.1) brightness(0.85)' }}
      />
      {/* Pit — old-blood descent tint */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: active === 'pit' ? 1 : 0 }}
        transition={{ duration: 1.6 }}
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(185,28,28,0.22) 0%, rgba(0,0,0,0.95) 70%)',
        }}
      />
      {/* Interior wash — subtle vertical gradient on non-title sections */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: active !== 'title' && active !== 'pit' ? 1 : 0 }}
        transition={{ duration: 1.0 }}
        style={{
          background:
            'linear-gradient(180deg, rgba(20,20,30,0.6) 0%, rgba(0,0,0,1) 60%)',
        }}
      />
    </div>
  );
}

// ─── Z-50: CONTROL SURFACE ───
function Dashboard({ isOpen, close }: { isOpen: boolean; close: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed inset-0 z-50 flex justify-end"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" onClick={close} />
          <div className="relative w-full max-w-lg h-full bg-zinc-950 border-l border-cyan-900/20 p-12 space-y-12 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
              <h2 className="text-cyan-500 font-bold tracking-[0.5em] text-xs uppercase">
                Command Center
              </h2>
              <button onClick={close} className="text-zinc-500 hover:text-white uppercase text-[10px]">
                Close
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans">
                Singularity Index
              </p>
              <button className="w-full bg-zinc-900 p-4 text-left text-[10px] tracking-widest uppercase hover:bg-cyan-900 transition-colors border border-zinc-800/60">
                Search 181 Nodes
              </button>
              <button className="w-full bg-zinc-900 p-4 text-left text-[10px] tracking-widest uppercase hover:bg-cyan-900 transition-colors border border-zinc-800/60">
                Biblical References
              </button>
              <button className="w-full bg-zinc-900 p-4 text-left text-[10px] tracking-widest uppercase hover:bg-cyan-900 transition-colors border border-zinc-800/60">
                Narrative Foreshadowing
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SingularityOS() {
  const { bus } = getRuntime();
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [isDashOpen, setIsDashOpen] = useState(false);
  const [active, setActive] = useState<SectionId>('title');
  const containerRef = useRef<HTMLDivElement>(null);

  // Listeners once (runtime is a singleton — survives StrictMode double-mount)
  useEffect(() => {
    initAudioListener(bus);
    initThematicListener(bus);
    initDistortionListener(bus);
  }, [bus]);

  // Scroll depth → bus
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const depth = max > 0 ? doc.scrollTop / max : 0;
      bus.emit('scroll:update', { depth });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [bus]);

  // Active section via IntersectionObserver (drives the cinema layer)
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) => (b.intersectionRatio > a.intersectionRatio ? b : a));
        const id = top.target.getAttribute('data-section') as SectionId | null;
        if (id) setActive(id);
      },
      { threshold: [0.25, 0.5, 0.75] }
    );
    document.querySelectorAll('[data-section]').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Bridge active section into existing event types
  useEffect(() => {
    if (active === 'pit') {
      bus.emit('chapter:load', { id: 7 });
      bus.emit('block:render', { tone: 'intense' });
    } else if (active === 'dedication') {
      bus.emit('block:render', { tone: 'sacred' });
    } else {
      bus.emit('block:render', { tone: 'baseline' });
    }
  }, [active, bus]);

  // Load Chapter 7
  useEffect(() => {
    const ac = new AbortController();
    fetch('/api/chapters?slug=7', { signal: ac.signal })
      .then((r) => r.json())
      .then((d) => {
        if (!d.xml) return;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(`<root>${d.xml}</root>`, 'text/xml');
        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
          console.error('[CHAPTER] XML parse error');
          return;
        }
        const ps: Paragraph[] = Array.from(xmlDoc.getElementsByTagName('paragraph')).map(
          (p, i) => ({
            words: Array.from(p.getElementsByTagName('word')).map((w) => ({
              text: w.textContent,
              color: w.getAttribute('color'),
              font: w.getAttribute('font'),
            })),
            isBlood: i > 12,
          })
        );
        setParagraphs(ps);
      })
      .catch((e) => {
        if (e.name !== 'AbortError') console.error('[CHAPTER] fetch failed', e);
      });
    return () => ac.abort();
  }, []);

  const scrollTo = (id: SectionId) => {
    document
      .querySelector(`[data-section="${id}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-black text-white font-[var(--font-hebrew)]"
    >
      {/* Z-50 */}
      <button
        onClick={() => setIsDashOpen(true)}
        className="fixed top-6 right-6 z-50 bg-zinc-900/40 px-4 py-3 border border-zinc-800 text-[10px] tracking-widest uppercase hover:bg-cyan-900 backdrop-blur-md transition-colors"
        aria-label="Open dashboard"
      >
        Dashboard
      </button>
      <Dashboard isOpen={isDashOpen} close={() => setIsDashOpen(false)} />

      {/* Z-10 */}
      <CinemaLayer active={active} />

      {/* Z-20 — sections, each its own positioning context */}
      <main className="relative z-20">
        {/* TITLE */}
        <section
          data-section="title"
          className="min-h-screen flex flex-col items-center justify-center text-center px-6"
        >
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 leading-none uppercase mix-blend-difference">
            THE WEIGHT<br />OF THE SKY
          </h1>
          <p className="text-cyan-400 tracking-[1em] uppercase text-[10px] mb-16 font-sans font-bold">
            Michael Alonza P. Ware
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => scrollTo('dedication')}
              className="px-6 py-3 border border-zinc-700/70 text-[10px] uppercase tracking-widest hover:bg-zinc-900/60 backdrop-blur-sm transition-colors"
            >
              Dedication
            </button>
            <button
              onClick={() => scrollTo('blurb')}
              className="px-6 py-3 border border-zinc-700/70 text-[10px] uppercase tracking-widest hover:bg-zinc-900/60 backdrop-blur-sm transition-colors"
            >
              The Blurb
            </button>
            <button
              onClick={() => scrollTo('pit')}
              className="px-6 py-3 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-cyan-400 transition-colors"
            >
              Enter The Pit
            </button>
          </div>
        </section>

        {/* DEDICATION */}
        <section
          data-section="dedication"
          className="min-h-screen flex items-center justify-center px-8 text-center"
        >
          <p className="italic text-3xl md:text-4xl text-emerald-400/80 max-w-2xl leading-relaxed">
            "For James Lee Ware."
          </p>
        </section>

        {/* BLURB — no opaque backplate, cinema bleeds through */}
        <section
          data-section="blurb"
          className="min-h-screen flex flex-col items-center justify-center px-6 md:px-20 py-32 border-y border-zinc-900/30"
        >
          <h2 className="text-[10px] uppercase tracking-[0.8em] text-slate-500 mb-16 font-sans">
            The Narrative Blurb
          </h2>
          <div className="max-w-2xl text-center space-y-8 text-lg md:text-xl leading-[1.8] font-light">
            <p>
              In 1003 BCE Hebron, a young boy named Dan possesses a rare gift: he can walk the
              dreamscape with full consciousness, moving between the layers of divine truth.
            </p>
            <p>
              A journey from the lowlands of pride to the heights of love. A father left behind.
              A sister born from the depths of hell itself. And the ultimate question: Is clarity
              worth the cost of silence?
            </p>
            <p className="italic text-emerald-400/70 border-t border-zinc-900/40 pt-8">
              The Weight of the Sky is an archetypal tale set at the threshold where gods still
              walk the earth.
            </p>
          </div>
        </section>

        {/* PIT — Chapter 7, blood-tinted via cinema layer */}
        <section
          data-section="pit"
          className="min-h-screen py-40 px-6 max-w-2xl mx-auto"
        >
          <header className="mb-24 text-center">
            <h3 className="text-zinc-500 uppercase tracking-[1em] text-[10px] font-sans">
              VII. The Pit
            </h3>
          </header>
          <div className="space-y-12">
            {paragraphs.length === 0 ? (
              <p className="text-zinc-700 text-center text-sm font-sans uppercase tracking-widest animate-pulse">
                Retrieving manuscript…
              </p>
            ) : (
              paragraphs.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ duration: 0.8 }}
                  onViewportEnter={() =>
                    bus.emit('block:render', { tone: p.isBlood ? 'intense' : 'sacred' })
                  }
                  className={`text-xl md:text-2xl leading-[1.95] text-justify ${
                    p.isBlood ? 'text-red-700/95' : 'text-zinc-200'
                  }`}
                  style={{ textIndent: '3rem' }}
                >
                  <OmniText words={p.words} />
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* AUTHOR */}
        <section
          data-section="author"
          className="min-h-screen flex flex-col items-center justify-center px-8 py-32 text-center border-t border-zinc-900/40"
        >
          <p className="text-white text-2xl md:text-3xl font-black tracking-tighter mb-4 uppercase">
            Michael Alonza P. Ware
          </p>
          <p className="text-zinc-500 text-xs md:text-sm max-w-md leading-relaxed uppercase tracking-widest font-sans">
            Architect of the Singularity Narrative OS
          </p>
        </section>
      </main>
    </div>
  );
}
