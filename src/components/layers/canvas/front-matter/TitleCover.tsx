"use client";

import React from "react";
import { motion } from "framer-motion";
import { smoothScroll } from "@/utils/smoothScroll";

export default function TitleCover() {
  return (
    <section id="title-page" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
      
      {/* Title block, vertically centered */}
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="title-display"
      >
        The Weight of the Sky
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.4 }}
        className="title-subtitle"
      >
        An Archetypal Tale
      </motion.p>
      
      {/* Nav row - horizontal with gap-12 (3rem) */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1.2 }}
        className="title-nav"
      >
        <button onClick={() => smoothScroll('dedication')}>Dedication</button>
        <button onClick={() => smoothScroll('synopsis')}>Synopsis</button>
        <button onClick={() => smoothScroll('about')}>About the Author</button>
        <button className="primary-button" onClick={() => smoothScroll('toc')}>
          Begin Reading
        </button>
      </motion.nav>
      
      {/* Byline at bottom */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1.2 }}
        className="title-byline"
      >
        By Michael Alonza Prentice Ware
      </motion.p>
    </section>
  );
}
