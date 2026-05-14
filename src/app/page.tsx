"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  useEffect(() => {
    const handleScroll = () => {
      document.documentElement.style.setProperty('--scroll-offset', window.scrollY.toString());
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-black text-white">
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 bg-cover bg-center parallax-layer" style={{ backgroundImage: "url('/bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black z-10" />
        <div className="relative z-20 text-center animate-reveal">
          <h2 className="text-[10px] uppercase tracking-[0.8em] text-amber-500/60 mb-6 font-sans">An Archetypal Tale</h2>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter">THE WEIGHT<br/>OF THE SKY</h1>
        </div>
      </section>
      <section className="relative z-30 bg-black py-40 px-8 space-y-40">
        <div className="max-w-prose mx-auto text-center">
          <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest mb-8 font-sans">Dedication</h3>
          <p className="text-4xl italic font-serif text-emerald-400/80">Dedicated to James lee ware in order to keep curios.</p>
        </div>
        <div className="max-w-prose mx-auto space-y-12 text-zinc-400 font-serif text-lg text-justify">
          <p>In 1003 BCE Hebron, a young boy named Dan possesses a rare gift: he can walk the dreamscape, moving between the layers of truth.</p>
          <p>A journey from the lowlands of pride to the heights of love. A father left behind. A sister born from the depths of hell itself.</p>
          <p className="text-emerald-400/70 italic">The Weight of the Sky is an archetypal tale set at the threshold where gods still walk the earth, and every step upward demands a sacrifice the heart never wants to give.</p>
          <div className="pt-20 flex justify-center"><Link href="/reader" className="px-16 py-4 border border-white/10 bg-white/5 hover:border-amber-500/50 transition-all text-[10px] uppercase tracking-[0.5em] text-white">Begin Reading</Link></div>
        </div>
      </section>
    </main>
  );
}
