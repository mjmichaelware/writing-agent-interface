"use client";
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { SidebarProvider } from '@/context/SidebarContext';
import { ReaderLayout } from '@/components/ReaderLayout';
import { OmniText } from '@/components/OmniText';
import { EMAWord } from '@/core/types';
import { isWordToken } from '@/utils/tokenize';

function InfiniteReelContent() {
  const [emaWords, setEmaWords] = useState<EMAWord[]>([]);
  const [author, setAuthor] = useState<any>(null);
  const [comp, setComp] = useState<any>(null);
  const [activeID, setActiveID] = useState<string | null>(null);
  const visible = useRef<Set<number>>(new Set());

  useEffect(() => {
    fetch('/api/chapters?slug=7').then(r => r.json()).then(d => {
      if (d.xml) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(`<root>${d.xml}</root>`, "text/xml");
        setEmaWords(Array.from(xmlDoc.getElementsByTagName("word")).map((w, i) => ({
          text: w.textContent || "",
          color: w.getAttribute("color") || undefined,
          font: w.getAttribute("font") || undefined,
          reference: w.getAttribute("ref") || undefined,
          foreshadowing: w.getAttribute("sync") || undefined,
          index: i
        })));
      } else if (d.text) {
        setEmaWords(d.text.split(/\s+/).map((t: string, i: number) => ({ text: t, index: i })));
      }
    }).catch(() => {});

    fetch('/api/compendium').then(r => r.json()).then(setComp).catch(() => {});
    fetch('/api/author').then(r => r.json()).then(setAuthor).catch(() => {});

    const handleScroll = () => document.documentElement.style.setProperty('--scroll-offset', window.scrollY.toString());
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const wordTokens = useMemo(() => (emaWords || []).filter(w => isWordToken(w.text)), [emaWords]);

  useEffect(() => {
    // Added safety for comp?.entities
    if (!emaWords.length || !comp?.entities) return;
    const obs = new IntersectionObserver((es) => {
      es.forEach(e => {
        const idx = Number(e.target.getAttribute('data-word-index'));
        if (e.isIntersecting) visible.current.add(idx); else visible.current.delete(idx);
      });
      if (visible.current.size > 0) {
        const arr = Array.from(visible.current);
        const start = Math.min(...arr), end = Math.max(...arr), range = end - start;
        const bS = Math.max(0, start - Math.floor(range * 1.5)), bE = Math.min(wordTokens.length, end + Math.floor(range * 1.5));
        const purview = wordTokens.slice(bS, bE).map(w => w.text).join(" ").toLowerCase();
        let found = null;
        comp.entities.forEach((ent: any) => {
          if (ent.triggers?.some((t: string) => purview.includes(t.toLowerCase()))) found = ent.id;
        });
        setActiveID(found);
      }
    }, { threshold: 0 });
    document.querySelectorAll('[data-word-index]').forEach(w => obs.observe(w));
    return () => obs.disconnect();
  }, [emaWords, comp, wordTokens]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <ReaderLayout activeEntry={comp?.entities?.find((e: any) => e.id === activeID)}>
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black z-10" />
        <div className="relative z-20 text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-2">THE WEIGHT<br/>OF THE SKY</h1>
          <h2 className="text-[10px] uppercase tracking-[0.8em] text-cyan-500/60 mb-20 font-sans italic">An Archetypal Tale</h2>
          <div className="flex flex-col space-y-4 w-64 mx-auto">
            <button onClick={() => scrollTo('dedication')} className="py-4 border border-white/10 bg-black/40 hover:bg-white/5 uppercase tracking-[0.5em] text-[9px] transition-all">Dedication</button>
            <button onClick={() => scrollTo('blurb')} className="py-4 border border-white/10 bg-black/40 hover:bg-white/5 uppercase tracking-[0.5em] text-[9px] transition-all">The Blurb</button>
            <button onClick={() => scrollTo('manuscript')} className="py-4 border border-white/30 bg-white/5 uppercase tracking-[0.6em] text-[9px] transition-all">Begin Reading</button>
          </div>
        </div>
      </section>

      <section id="dedication" className="relative z-30 bg-black py-60 px-8 text-center">
        <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest mb-12">Dedication</h3>
        <p className="text-4xl italic font-serif text-emerald-400/80">Dedicated to James Lee Ware (To keep Curious)</p>
      </section>

      <section id="blurb" className="relative z-30 bg-black py-40 px-8 space-y-12 text-zinc-400 font-serif leading-relaxed text-xl max-w-2xl mx-auto text-center">
        <p>In 1003 BCE Hebron, a young boy named Dan possesses a rare gift: he can walk the dreamscape with full consciousness...</p>
        <p className="italic text-emerald-400/70 text-sm">Written by {author?.name || "Michael Alonza P. Ware"}</p>
      </section>

      <section id="manuscript" className="relative z-30 bg-black py-60 px-8 max-w-2xl mx-auto">
        <h3 className="text-center text-zinc-700 uppercase tracking-[1em] text-[10px] mb-40 italic">VII. THE PIT</h3>
        <div className="space-y-16 font-serif text-2xl leading-relaxed text-zinc-300">
          <OmniText words={emaWords} />
        </div>
      </section>
    </ReaderLayout>
  );
}

export default function InfiniteReel() {
  return (
    <SidebarProvider>
      <InfiniteReelContent />
    </SidebarProvider>
  );
}
