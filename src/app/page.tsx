"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Feather, Info } from 'lucide-react';
import { Howl } from 'howler';

export default function LandingPage() {
  const [stage, setStage] = useState(-1); // -1: Touch to Initiate, 0: Logo, 1: BG, 2: UI

  // --- AUDIO ENGINE ---
  const initiateSequence = () => {
    // Play cinematic drone
    const sound = new Howl({
      src: ['https://actions.google.com/sounds/v1/science_fiction/deep_space_drone.ogg'],
      volume: 0.5,
      loop: true,
      fade: 2000,
    });
    sound.play();

    // Trigger the sequence cascade
    setStage(0);
    setTimeout(() => setStage(1), 2000); // BG starts at 2s
    setTimeout(() => setStage(2), 4000); // UI starts at 4s
  };

  // --- TYPOGRAPHY ENGINE (Splits text for letter-by-letter animation) ---
  const titleText = "THE WEIGHT OF THE SKY";
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 }
    }
  };
  const letterVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)", scale: 1.5 },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { type: "spring", damping: 12, stiffness: 100 } }
  };

  return (
    <div className="relative min-h-[100dvh] bg-black overflow-hidden flex flex-col items-center font-sans text-slate-200">
      
      {/* STAGE -1: The Airlock (Touch to Initiate) */}
      <AnimatePresence>
        {stage === -1 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black cursor-pointer"
            onClick={initiateSequence}
          >
            <motion.p 
              animate={{ opacity: [0.3, 1, 0.3] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-cyan-500 tracking-[0.5em] text-sm md:text-base font-light uppercase drop-shadow-[0_0_15px_rgba(8,145,178,0.8)]"
            >
              Touch to Initiate
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 0: AlliterasBooks Logo */}
      <AnimatePresence>
        {stage === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <h2 className="text-3xl md:text-5xl tracking-[0.4em] uppercase font-light text-slate-400">
              AlliterasBooks <span className="font-bold text-slate-200">LLC</span>
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 1 & 2: Physics-Driven Background */}
      {stage >= 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 0.6, scale: 1.15 }}
          transition={{ duration: 20, ease: "easeOut" }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Hardware Accelerated Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-black/90" />
        </motion.div>
      )}

      {/* STAGE 2: Interactive Framer Motion UI */}
      {stage === 2 && (
        <div className="relative z-10 flex flex-col items-center w-full min-h-[100dvh] pt-[15vh] pb-8 px-6">
          
          {/* Animated Typography Title */}
          <motion.div variants={titleVariants} initial="hidden" animate="visible" className="flex flex-col items-center text-center w-full">
            <h1 className="font-serif text-[12vw] md:text-8xl font-bold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] leading-none flex flex-wrap justify-center max-w-5xl">
              {titleText.split("").map((char, index) => (
                <motion.span key={index} variants={letterVariants} className={char === " " ? "w-4 md:w-8" : ""}>
                  {char}
                </motion.span>
              ))}
            </h1>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5, duration: 1 }}
              className="mt-6 text-xl md:text-3xl text-cyan-500 font-light tracking-[0.4em] uppercase"
            >
              An Archetypal Tale
            </motion.h2>
          </motion.div>

          {/* Staggered Navigation Buttons */}
          <motion.div 
            initial="hidden" animate="visible" 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 3.5 } }
            }}
            className="flex-1 w-full flex flex-col justify-center items-center gap-6 mt-12 max-w-lg"
          >
            {[
              { href: "/title", icon: BookOpen, text: "Title Page", color: "cyan" },
              { href: "/dedication", icon: Feather, text: "Dedication", color: "emerald" },
              { href: "/blurb", icon: Info, text: "The Blurb", color: "purple" }
            ].map((btn, i) => (
              <motion.a 
                key={i} href={btn.href}
                variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { type: "spring" } } }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(15,23,42,0.8)" }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-6 bg-black/40 border-y border-slate-800 text-slate-300 transition-all backdrop-blur-md flex flex-col items-center justify-center`}
              >
                <btn.icon size={24} className={`text-${btn.color}-500 mb-2`} />
                <span className="tracking-[0.3em] uppercase text-sm sm:text-lg font-light">{btn.text}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Author Byline */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.5, duration: 2 }}
            className="mt-auto pt-8"
          >
            <h3 className="text-xs md:text-sm text-slate-500 tracking-[0.3em] uppercase font-light text-center">
              By <br className="sm:hidden" /><span className="text-slate-300 font-normal sm:ml-2">Michael Alonza P. Ware</span>
            </h3>
          </motion.div>

        </div>
      )}
    </div>
  );
}
