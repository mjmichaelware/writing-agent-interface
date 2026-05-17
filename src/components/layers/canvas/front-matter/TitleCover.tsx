"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface TitleCoverProps {
  onJump: (id: string) => void;
  onBeginReading: () => void;
}

export default function TitleCover({ onJump, onBeginReading }: TitleCoverProps) {
  const { scrollYProgress } = useScroll();
  const bgOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section
      id="title-page"
      className="relative min-h-screen flex flex-col justify-between items-center text-center overflow-hidden"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ opacity: bgOpacity }}
      >
        <img
          src="/assets/bg.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: "saturate(0.85) brightness(0.78)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.15) 35%, rgba(10,10,10,0.45) 75%, var(--bg-void) 100%)",
          }}
        />
      </motion.div>

      <div className="pt-24" />

      <div className="relative z-10 flex flex-col items-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
          style={{
            fontFamily: "var(--font-title)",
            fontWeight: 600,
            letterSpacing: "0.02em",
            lineHeight: 1.05,
            color: "var(--text-body)",
            textShadow: "0 4px 24px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.6)",
          }}
        >
          The Weight
          <br />
          of the Sky
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.78, y: 0 }}
          transition={{ delay: 0.9, duration: 1.4, ease: "easeOut" }}
          className="text-lg md:text-xl mt-8"
          style={{
            fontFamily: "var(--font-prose)",
            fontStyle: "italic",
            letterSpacing: "0.05em",
            color: "var(--text-body)",
          }}
        >
          An Archetypal Tale
        </motion.p>
      </div>

      <motion.nav
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1.4 }}
        className="relative z-10 flex flex-wrap justify-center items-center gap-x-10 gap-y-6 pb-4 px-6"
      >
        <button onClick={() => onJump("dedication")} className="nav-link">Dedication</button>
        <button onClick={() => onJump("synopsis")} className="nav-link">Synopsis</button>
        <button onClick={() => onJump("about")} className="nav-link">About the Author</button>
        <button onClick={() => onJump("toc")} className="nav-link">Table of Contents</button>
        <button onClick={onBeginReading} className="primary-button">Begin Reading</button>
      </motion.nav>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1.8 }}
        className="relative z-10 text-sm pb-10"
        style={{
          fontFamily: "var(--font-prose)",
          fontStyle: "italic",
          color: "var(--text-muted)",
        }}
      >
        By Michael Alonza Prentice Ware
      </motion.p>
    </section>
  );
}
