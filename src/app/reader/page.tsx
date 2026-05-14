"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { OmniText } from '@/components/OmniText';
import { getRuntime } from '@/runtime/runtimeContext';
import { State, Compendium } from '@/core/types';
import { tokenize, isWordToken } from '@/utils/tokenize';

const TITLES: Record<number, string> = { 7: 'VII. THE PIT' };

export default function ReaderPage() {
  const { bus, engine } = getRuntime();
  const [content, setContent] = useState('');
  const [comp, setComp] = useState<Compendium | null>(null);
  const [loading, setLoading] = useState(true);
  const [chapter, setChapter] = useState(engine.getState().chapter);
  const [activeID, setActiveID] = useState<string | null>(null);
  const [lastAsset, setLastAsset] = useState<string | null>(null);
  const visible = useRef<Set<number>>(new Set());

  const wordTokens = useMemo(() => tokenize(content).filter(isWordToken), [content]);
  const triggerMap = useMemo(() => {
    const map: Record<string, { id: string; weight: number }> = {};
    comp?.entities.forEach(e => e.triggers.forEach(t => map[t.toLowerCase()] = { id: e.id, weight: e.weight }));
    return map;
  }, [comp]);

  useEffect(() => {
    const onC = (s: State) => setChapter(s.chapter);
    bus.on('state:change', onC);
    return () => bus.off('state:change', onC);
  }, [bus]);

  useEffect(() => { fetch('/api/compendium').then(r => r.json()).then(setComp).catch(() => {}); }, []);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    fetch(`/api/chapters?slug=${chapter}`, { signal: ac.signal })
      .then(r => r.json()).then(d => { setContent(d.content || ''); setLoading(false); })
      .catch(e => { if (e.name !== 'AbortError') setLoading(false); });
    return () => ac.abort();
  }, [chapter]);

  const analyze = useCallback(() => {
    if (visible.current.size === 0 || !comp) { setActiveID(null); return; }
    const arr = Array.from(visible.current);
    const start = arr.reduce((a, b) => Math.min(a, b)), end = arr.reduce((a, b) => Math.max(a, b));
    const range = end - start, bS = Math.max(0, Math.floor(start - range * 1.5)), bE = Math.min(wordTokens.length, Math.floor(end + range * 1.5));
    const scores: Record<string, number> = {};
    wordTokens.slice(bS, bE).forEach(t => { const m = triggerMap[t.toLowerCase()]; if (m) scores[m.id] = (scores[m.id] || 0) + m.weight; });
    const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    setActiveID(top ? top[0] : null);
  }, [wordTokens, comp, triggerMap]);

  useEffect(() => {
    if (loading || !content) return;
    const obs = new IntersectionObserver(es => {
      es.forEach(e => {
        const idx = Number(e.target.getAttribute('data-word-index'));
        if (Number.isNaN(idx) || idx < 0) return;
        if (e.isIntersecting) visible.current.add(idx); else visible.current.delete(idx);
      });
      analyze();
    }, { threshold: 0 });
    document.querySelectorAll('[data-word-index]').forEach(w => obs.observe(w));
    return () => obs.disconnect();
  }, [loading, content, analyze]);

  useEffect(() => {
    const entry = comp?.entities.find(e => e.id === activeID);
    if (entry) setLastAsset(entry.visualAsset);
  }, [activeID, comp]);

  if (loading) return <div className="p-20 text-zinc-800 animate-pulse font-serif">Retrieving...</div>;

  return (
    <article className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ${activeID ? 'opacity-20' : 'opacity-0'}`}
          style={{ backgroundImage: lastAsset ? `url('${lastAsset}')` : 'none' }} />
      </div>
      <div className="relative z-10 animate-reveal">
        <header className="mb-40 text-center"><h2 className="text-zinc-700 uppercase tracking-[1em] text-[10px] font-sans">{TITLES[chapter] || `CHAPTER ${chapter}`}</h2></header>
        <OmniText content={content} />
      </div>
    </article>
  );
}
