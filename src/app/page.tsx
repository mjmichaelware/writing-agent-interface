"use client";
import React, { useState, useEffect } from 'react';

export default function LandingPage() {
  const [stage, setStage] = useState(-1);
  const [chapter, setChapter] = useState({ title: '', blocks: [] as string[] });
  const [depth, setDepth] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (stage < 2) return;
      setDepth(window.scrollY / window.innerHeight);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [stage]);

  useEffect(() => {
    if (stage === 0) {
      fetch('/api/chapters?slug=7')
        .then(res => res.json())
        .then(data => {
          if (data.error) setError(true);
          else setChapter(data);
        })
        .catch(() => setError(true));
    }
  }, [stage]);

  const initiateSequence = () => {
    setStage(0);
    setTimeout(() => setStage(1), 1500);
    setTimeout(() => setStage(2), 3000);
  };

  return (
    <main className="relative bg-black text-slate-200 font-serif">
      {/* Background */}
      <div 
        className="fixed inset-0 z-0 opacity-30 pointer-events-none transition-transform duration-300"
        style={{
          backgroundImage: 'url("/bg.png")',
          backgroundSize: 'cover',
          filter: `blur(${Math.min(depth * 5, 10)}px)`,
          transform: `scale(${1 + depth * 0.05}) translateZ(0)`
        }}
      />

      {/* Stage -1: Initiate */}
      {stage === -1 && (
        <div onClick={initiateSequence} className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer bg-black">
          <p className="text-cyan-500 tracking-[0.5em] text-[10px] animate-pulse uppercase">Initiate Witness</p>
        </div>
      )}

      {/* Stage 0: Logo fade */}
      {stage === 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <h2 className="text-2xl md:text-5xl tracking-[0.4em] uppercase font-light text-slate-400 animate-fade-in">
            AlliterasBooks <span className="font-bold text-slate-200">LLC</span>
          </h2>
        </div>
      )}

      {/* Scrollable content (Stage 2+) */}
      <div className={`relative z-10 transition-opacity duration-1000 ${stage < 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Title Section */}
        <section className="h-screen flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight">
            THE WEIGHT<br/>OF THE SKY
          </h1>
          <p className="text-cyan-500 tracking-[0.3em] text-xs uppercase mt-4">Michael Alonza P. Ware</p>
          <div className="mt-20 text-slate-600 text-sm">↓ Scroll to continue</div>
        </section>

        {/* Dedication Section */}
        <section className="min-h-screen flex items-center justify-center p-10 bg-black/60 backdrop-blur border-y border-white/10">
          <div className="max-w-2xl text-center italic font-serif text-2xl md:text-3xl opacity-80 text-emerald-400/70">
            "Dedicated to those who survive the storm."
          </div>
        </section>

        {/* Chapter 7 Section */}
        <section className="min-h-screen p-8 md:p-24 bg-zinc-950">
          <h2 className="text-slate-500 uppercase tracking-widest text-[10px] mb-20">VII. The Pit</h2>
          <div className="max-w-prose mx-auto space-y-8 text-xl md:text-2xl leading-relaxed">
            {error ? (
              <p className="text-red-900/60">Manuscript retrieval in progress...</p>
            ) : chapter.blocks.length ? (
              chapter.blocks.slice(0, 3).map((block, i) => (
                <p key={i} className="opacity-90">{block}</p>
              ))
            ) : (
              <p className="opacity-60">Loading text...</p>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
