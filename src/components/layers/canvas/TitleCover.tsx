"use client";

import React from "react";
import { motion } from "framer-motion";

interface TitleCoverProps {
  titleOpacity: number;
  titleScale: number;
  topCanvasRef: React.RefObject<HTMLDivElement | null>;
  manuscriptRef: React.RefObject<HTMLDivElement | null>;
  dedicationRef: React.RefObject<HTMLDivElement | null>;
  blurbRef: React.RefObject<HTMLDivElement | null>;
  authorRef: React.RefObject<HTMLDivElement | null>;
  tocRef: React.RefObject<HTMLDivElement | null>;
  jumpTo: (
    ref: React.RefObject<HTMLDivElement | null>
  ) => void;
}

export default function TitleCover({
  titleOpacity,
  titleScale,
  dedicationRef,
  blurbRef,
  authorRef,
  jumpTo
}: TitleCoverProps) {
  return (
    <motion.section
      id="title-page"
      className="relative flex min-h-screen w-full flex-col items-center justify-center text-center select-none"
      style={{
        opacity: titleOpacity,
        scale: titleScale
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/assets/bg.png"
          alt="Moon Boy"
          className="h-full w-full object-cover"
          style={{
            filter: "saturate(0.85) brightness(0.75)"
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-void)]/40 to-[var(--bg-void)]" />
      </div>

      <div className="relative z-10 mt-16 flex flex-col items-center px-6">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1.8,
            ease: "easeOut"
          }}
          className="text-6xl tracking-normal text-[var(--text-body)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] md:text-8xl"
          style={{
            fontFamily: "var(--font-title)"
          }}
        >
          THE WEIGHT OF THE SKY
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.4,
            delay: 0.8,
            ease: "easeOut"
          }}
          className="mt-6 font-serif text-xl italic text-[var(--text-muted)] md:text-2xl"
        >
          An Archetypal Tale
        </motion.h2>

        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 2,
            delay: 1.5,
            ease: "easeInOut"
          }}
          className="mt-32 flex flex-wrap items-center justify-center gap-12 font-serif text-sm"
        >
          <button
            onClick={() => jumpTo(dedicationRef)}
            className="underline decoration-transparent underline-offset-4 transition-colors hover:text-[var(--accent-gold)] hover:decoration-[var(--accent-gold)]"
          >
            Dedication
          </button>

          <button
            onClick={() => jumpTo(blurbRef)}
            className="underline decoration-transparent underline-offset-4 transition-colors hover:text-[var(--accent-gold)] hover:decoration-[var(--accent-gold)]"
          >
            Synopsis
          </button>

          <button
            onClick={() => jumpTo(authorRef)}
            className="underline decoration-transparent underline-offset-4 transition-colors hover:text-[var(--accent-gold)] hover:decoration-[var(--accent-gold)]"
          >
            About the Author
          </button>

          <button
            onClick={() =>
              document
                .getElementById("reading")
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
            className="primary-button"
          >
            Begin Reading
          </button>
        </motion.nav>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 2.5,
          delay: 2
        }}
        className="absolute bottom-8 z-10"
      >
        <p className="font-serif text-sm italic text-[var(--text-muted)]">
          By Michael Alonza Prentice Ware
        </p>
      </motion.div>
    </motion.section>
  );
}
