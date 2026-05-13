"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Feather, Info } from 'lucide-react';
import { Howl } from 'howler';

export default function LandingPage() {
  const [stage, setStage] = useState(-1);

  const initiateSequence = () => {
    const sound = new Howl({
      src: ['https://actions.google.com/sounds/v1/science_fiction/deep_space_drone.ogg'],
      volume: 0.6,
      html5: true,
      onplay: () => {
        setStage(0);
        setTimeout(() => setStage(1), 1500);
        setTimeout(() => setStage(2), 3500);
      }
    });
    sound.play();
  };

  const titleText = "THE WEIGHT OF THE SKY";

  return (
    <div className="relative min-h-[100dvh] bg-black overflow-hidden flex flex-col items-center justify-center text-slate-200">
      
      {/* BACKGROUND LAYER */}
      {stage >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </motion.div>
      )}

      {/* STAGE -1: INITIALIZER */}
      <AnimatePresence>
        {stage === -1 && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black cursor-pointer"
            onClick={initiateSequence}
          >
            <p className="text-cyan-500 tracking-[0.5em] uppercase text-xs animate-pulse">Touch to Initiate</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 0: CENTERED LOGO */}
      <AnimatePresence>
        {stage === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black"
          >
            <h2 className="text-2xl md:text-5xl tracking-[0.4em] uppercase font-light text-slate-400">
              AlliterasBooks <span className="font-bold text-slate-200">LLC</span>
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: MAIN UI */}
      {stage === 2 && (
        <div className="relative z-10 w-full h-screen flex flex-col items-center justify-between py-16 px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-serif text-[10vw] md:text-8xl font-bold text-white tracking-tighter leading-none">
              THE WEIGHT<br/>OF THE SKY
            </h1>
            <h2 className="mt-4 text-cyan-500 tracking-[0.3em] uppercase text-sm">An Archetypal Tale</h2>
          </motion.div>

          <div className="w-full max-w-md space-y-4">
            <Link href="/title" className="block w-full py-6 border-y border-white/10 bg-white/5 backdrop-blur-md text-center group">
              <span className="tracking-[0.3em] uppercase text-sm group-hover:text-cyan-400">Title Page</span>
            </Link>
            <Link href="/dedication" className="block w-full py-6 border-y border-white/10 bg-white/5 backdrop-blur-md text-center group">
              <span className="tracking-[0.3em] uppercase text-sm group-hover:text-emerald-400">Dedication</span>
            </Link>
            <Link href="/blurb" className="block w-full py-6 border-y border-white/10 bg-white/5 backdrop-blur-md text-center group">
              <span className="tracking-[0.3em] uppercase text-sm group-hover:text-purple-400">The Blurb</span>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-[10px] tracking-[0.4em] text-slate-500 uppercase">
              By Michael Alonza P. Ware
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
