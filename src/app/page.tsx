"use client";
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { SidebarProvider } from '@/context/SidebarContext';
import { ReaderLayout } from '@/components/ReaderLayout';
import { OmniText } from '@/components/OmniText';
import { EMAWord } from '@/core/types';
import { tokenize, isWordToken } from '@/utils/tokenize';

function InfiniteReelContent() {
  const [emaWords, setEmaWords] = useState<EMAWord[]>([]);
  const [author, setAuthor] = useState<any>(null);
  const [comp, setComp] = useState<any>(null);
  const [activeID, setActiveID] = useState<string | null>(null);
  const visible = useRef<Set<number>>(new Set());

  useEffect(() => {
    fetch('/api/chapters?slug=7&format=ema').then(r => r.json()).then(d => setEmaWords(d.words));
    fetch('/api/compendium').then(r => r.json()).then(setComp);
    fetch('/api/author').then(r => r.json()).then(setAuthor);
    const handleScroll = () => document.documentElement.style.setProperty('--scroll-offset', window.scrollY.toString());
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const wordOnlyTokens = useMemo(() => emaWords.filter(w => isWordToken(w.text)), [emaWords]);

  useEffect(() => {
    if (emaWords.length === 0 || !comp) return;
    const obs = new IntersectionObserver((es) => {
      es.forEach(e => {
        const idx = Number(e.target.getAttribute('data-word-index'));
        if (e.isIntersecting) visible.current.add(idx); else visible.current.delete(idx);
      });
      if (visible.current.size > 0) {
        const arr = Array.from(visible.current);
        const start = Math.min(...arr), end = Math.max(...arr), range = end - start;
        const bS = Math.max(0, start - Math.floor(range * 1.5)), bE = Math.min(wordOnlyTokens.length, end + Math.floor(range * 1.5));
        const purview = wordOnlyTokens.slice(bS, bE).map(w => w.text).join(" ").toLowerCase();
        let found = null;
        comp.entities.forEach((ent: any) => {
          if (ent.triggers.some((t: string) => purview.includes(t.toLowerCase()))) found = ent.id;
        });
        setActiveID(found);
      }
    }, { threshold: 0 });
    document.querySelectorAll('[data-word-index]').forEach(w => obs.observe(w));
    return () => obs.disconnect();
  }, [emaWords, comp, wordOnlyTokens]);

  const activeEntry = comp?.entities.find((e: any) => e.id === activeID);

  return (
    <ReaderLayout activeEntry={activeEntry}>
      <article className="relative">
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-cover bg-center parallax-layer" style={{ backgroundImage: "url('/bg.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black z-10" />
          <div className="relative z-20 text-center animate-reveal">
            <h2 className="text-[10px] uppercase tracking-[0.8em] text-amber-500/60 mb-6 font-sans">An Archetypal Tale</h2>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">THE WEIGHT<br/>OF THE SKY</h1>
          </div>
        </section>

        <section className="relative z-30 bg-black py-40 px-8">
          <div className="max-w-prose mx-auto text-center">
            <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest mb-8">Dedication</h3>
            <p className="text-4xl italic font-serif text-emerald-400/80 underline decoration-amber-900/40 underline-offset-8">
              Dedicated to James Lee Ware (To keep Curious)
            </p>
          </div>
        </section>

        <section className="relative z-30 bg-black py-40 px-8">
          <div className="max-w-prose mx-auto space-y-12 text-zinc-400 font-serif leading-relaxed text-xl">
            <p>In 1003 BCE Hebron, a young boy named Dan possesses a rare gift: he can walk the dreamscape with full consciousness, moving between the layers of divine truth.</p>
            <p>A journey from the lowlands of pride to the heights of love. A father left behind. A sister born from the depths of hell itself. And the ultimate question: Is clarity worth the cost of silence?</p>
            <p className="text-emerald-400/70 italic text-center">The Weight of the Sky is an archetypal tale set at the threshold where gods still walk the earth, and every step upward demands a sacrifice the heart never wants to give.</p>
          </div>
        </section>

        <section className="relative z-30 bg-black py-60 px-8">
          <div className="max-w-prose mx-auto">
            <h2 className="text-center text-zinc-700 uppercase tracking-[1em] text-[10px] mb-40 italic">VII. THE PIT</h2>
            <OmniText emaWords={emaWords} />
          </div>
        </section>

        <section className="relative z-30 bg-black py-40 px-8 border-t border-white/5">
          <div className="max-w-prose mx-auto space-y-12">
            <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest text-center">About the Author</h3>
            {author && (
              <div className="space-y-8">
                <h4 className="text-3xl font-serif text-white text-center italic">{author.name}</h4>
                <p className="text-zinc-400 text-lg leading-relaxed text-justify">{author.bio}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                  <div className="space-y-4">
                    <span className="text-amber-500/60 text-[9px] uppercase tracking-widest">Ongoing Goals</span>
                    <ul className="text-xs text-zinc-500 space-y-2">{author.achievements.map((a: string, i: number) => <li key={i}>// {a}</li>)}</ul>
                  </div>
                  <div className="text-xs text-zinc-500 italic flex items-end justify-end uppercase tracking-widest opacity-50">{author.contact}</div>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000">
          <div className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ${activeID ? 'opacity-20' : 'opacity-0'}`}
               style={{ backgroundImage: activeEntry ? `url('${activeEntry.visualAsset}')` : 'none' }} />
        </div>
      </article>
    </ReaderLayout>
  );
}

export default function Page() {
  return <SidebarProvider><InfiniteReelContent /></SidebarProvider>;
}
