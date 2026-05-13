"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Howl } from 'howler';

export default function LandingPage() {
  const [stage, setStage] = useState(-1);
  const timers = useRef<number[]>([]);
  const soundRef = useRef<Howl | null>(null);

  // Preload and manage audio lifecycle
  useEffect(() => {
    soundRef.current = new Howl({
      src: ['https://actions.google.com/sounds/v1/science_fiction/deep_space_drone.ogg'],
      volume: 0.6,
      html5: true,
      preload: true,
    });

    return () => {
      soundRef.current?.unload();
    };
  }, []);

  // Play audio when stage hits 1
  useEffect(() => {
    if (stage === 1) {
      const audioTimer = setTimeout(() => {
        soundRef.current?.play();
      }, 50);
      timers.current.push(audioTimer);
    }
  }, [stage]);

  // Click initiates the sequence - guard against double-triggering
  const initiateSequence = useCallback(() => {
    if (stage !== -1) return;

    setStage(0);

    timers.current.push(
      window.setTimeout(() => setStage(1), 1500)
    );

    timers.current.push(
      window.setTimeout(() => setStage(2), 3500)
    );
  }, [stage]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <main className="relative min-h-screen w-screen bg-black overflow-hidden flex flex-col items-center justify-center text-slate-200 touch-manipulation">
      
      {/* Background Layer */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-600 motion-reduce:transition-none ${
          stage >= 1 ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundImage: 'url("/bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* STAGE -1: INITIALIZER */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-black cursor-pointer touch-manipulation transition-opacity duration-400 motion-reduce:transition-none ${
          stage === -1 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={initiateSequence}
      >
        <p className="text-cyan-500 tracking-[0.5em] uppercase text-[10px] animate-pulse motion-reduce:animate-none">
          Touch to Initiate
        </p>
      </div>

      {/* STAGE 0: CENTERED LOGO */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-600 motion-reduce:transition-none ${
          stage === 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <h2 className="text-2xl md:text-5xl tracking-[0.4em] uppercase font-light text-slate-400">
          AlliterasBooks <span className="font-bold text-slate-200">LLC</span>
        </h2>
      </div>

      {/* STAGE 2: MAIN UI */}
      <div
        className={`fixed inset-0 z-10 w-full flex flex-col items-center justify-between py-8 px-6 transition-opacity duration-600 motion-reduce:transition-none ${
          stage === 2 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Title with GPU promotion */}
        <div
          className={`text-center pt-12 transform-gpu transition-opacity transition-transform duration-700 motion-reduce:transition-none motion-reduce:transform-none ${
            stage === 2
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
          style={{ contain: 'layout paint' }}
        >
          <h1 className="font-serif text-[11vw] md:text-8xl font-bold text-white tracking-tighter leading-none">
            THE WEIGHT<br/>OF THE SKY
          </h1>
          <h2 className="mt-4 text-cyan-500 tracking-[0.3em] uppercase text-[10px] sm:text-xs">
            An Archetypal Tale
          </h2>
        </div>

        {/* Navigation */}
        <div className="w-full max-w-sm space-y-4">
          <Link href="/title" className="block w-full py-5 border-y border-white/10 bg-black/40 text-center group hover:bg-white/10 transition-colors touch-manipulation">
            <span className="tracking-[0.3em] uppercase text-[11px] group-hover:text-cyan-400 transition-colors">Title Page</span>
          </Link>
          <Link href="/dedication" className="block w-full py-5 border-y border-white/10 bg-black/40 text-center group hover:bg-white/10 transition-colors touch-manipulation">
            <span className="tracking-[0.3em] uppercase text-[11px] group-hover:text-emerald-400 transition-colors">Dedication</span>
          </Link>
          <Link href="/blurb" className="block w-full py-5 border-y border-white/10 bg-black/40 text-center group hover:bg-white/10 transition-colors touch-manipulation">
            <span className="tracking-[0.3em] uppercase text-[11px] group-hover:text-purple-400 transition-colors">The Blurb</span>
          </Link>
        </div>

        {/* Author */}
        <div className="text-center pb-8">
          <p className="text-[9px] tracking-[0.4em] text-slate-500 uppercase">
            By Michael Alonza P. Ware
          </p>
        </div>
      </div>
    </main>
  );
}
