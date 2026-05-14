"use client";
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { SidebarProvider } from '@/context/SidebarContext';
import { ReaderLayout } from '@/components/ReaderLayout';
import { OmniText } from '@/components/OmniText';
import { tokenize, isWordToken } from '@/utils/tokenize';

function InfiniteReelContent() {
  const [content, setContent] = useState("");
  const [comp, setComp] = useState<any>(null);
  const [activeID, setActiveID] = useState<string | null>(null);
  const visible = useRef<Set<number>>(new Set());

  useEffect(() => {
    fetch('/api/chapters?slug=7').then(r => r.json()).then(d => setContent(d.content));
    fetch('/api/compendium').then(r => r.json()).then(setComp);
    const handleScroll = () => document.documentElement.style.setProperty('--scroll-offset', window.scrollY.toString());
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const wordTokens = useMemo(() => tokenize(content).filter(isWordToken), [content]);

  useEffect(() => {
    if (!content || !comp) return;
    const obs = new IntersectionObserver((es) => {
      es.forEach(e => {
        const idx = Number(e.target.getAttribute('data-word-index'));
        if (e.isIntersecting) visible.current.add(idx); else visible.current.delete(idx);
      });
      if (visible.current.size > 0) {
        const arr = Array.from(visible.current);
        const start = Math.min(...arr), end = Math.max(...arr), range = end - start;
        const bS = Math.max(0, start - Math.floor(range * 1.5)), bE = Math.min(wordTokens.length, end + Math.floor(range * 1.5));
        const purview = wordTokens.slice(bS, bE).join(" ").toLowerCase();
        let found = null;
        comp.entities.forEach((ent: any) => {
          if (ent.triggers.some((t: string) => purview.includes(t.toLowerCase()))) found = ent.id;
        });
        setActiveID(found);
      }
    }, { threshold: 0 });
    document.querySelectorAll('[data-word-index]').forEach(w => obs.observe(w));
    return () => obs.disconnect();
  }, [content, comp, wordTokens]);

  const activeEntry = comp?.entities.find((e: any) => e.id === activeID);

  return (
    <ReaderLayout activeEntry={activeEntry}>
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 bg-cover bg-center parallax-layer" style={{ backgroundImage: "url('/bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black z-10" />
        <div className="relative z-20 text-center animate-reveal">
          <h2 className="text-[10px] uppercase tracking-[0.8em] text-amber-500/60 mb-6 font-sans">An Archetypal Tale</h2>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">THE WEIGHT<br/>OF THE SKY</h1>
        </div>
      </section>

      <section className="relative z-30 bg-black py-40 px-8 space-y-40">
        <div className="max-w-prose mx-auto text-center">
          <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest mb-8 font-sans">Dedication</h3>
          <p className="text-4xl italic font-serif text-emerald-400/80">Dedicated to James lee ware in order to keep curios.</p>
        </div>
        <div className="max-w-prose mx-auto space-y-12 text-zinc-400 font-serif leading-relaxed text-lg text-justify">
          <p>In 1003 BCE Hebron, a young boy named Dan possesses a rare gift: he can walk the dreamscape, moving between the layers of truth.</p>
          <p>A journey from the lowlands of pride to the heights of love. A father left behind. A sister born from the depths of hell itself.</p>
          <p className="text-emerald-400/70 italic">The Weight of the Sky is an archetypal tale set at the threshold where gods still walk the earth, and every step upward demands a sacrifice the heart never wants to give.</p>
        </div>
      </section>

      <section className="relative z-30 bg-black pb-96 px-8">
        <div className="max-w-prose mx-auto">
          <h2 className="text-center text-zinc-700 uppercase tracking-[1em] text-[10px] mb-40 italic">VII. THE PIT</h2>
          <OmniText content={content} />
        </div>
      </section>
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ${activeID ? 'opacity-20' : 'opacity-0'}`}
             style={{ backgroundImage: activeEntry ? `url('${activeEntry.visualAsset}')` : 'none' }} />
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
