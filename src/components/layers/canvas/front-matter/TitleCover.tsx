"use client";

import React, { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { smoothScroll } from "@/utils/smoothScroll";
import { bus } from "@/core/runtimeEngine";

export default function TitleCover() {
  const { scrollYProgress } = useScroll();
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  // Tell Layer2Cinema to show the title bg at full intensity
  useEffect(() => {
    bus.emit("scroll:focus", { sectionId: "title-page", content: "title-page" });
  }, []);

  return (
    <motion.section
      id="title-page"
      style={{ opacity: sectionOpacity, position: "relative" }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
    >
      {/* Full-bleed background image embedded in the section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}
      >
        <img
          src="/assets/bg.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 30%",
          }}
        />
        {/* Multi-stop gradient for text legibility */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(5,4,2,0.35) 40%, rgba(5,4,2,0.72) 85%, rgba(5,4,2,0.9) 100%)",
        }} />
      </motion.div>

      {/* Content layer — above the background */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>

        {/* Title — drops from top */}
        <motion.h1
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="title-display"
        >
          The Weight of the Sky
        </motion.h1>

        {/* Subtitle — rises from bottom */}
        <motion.p
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
          className="title-subtitle"
        >
          An Archetypal Tale
        </motion.p>

        {/* Nav row */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1.2 }}
          className="title-nav"
        >
          <button onClick={() => smoothScroll("dedication")}>Dedication</button>
          <button onClick={() => smoothScroll("synopsis")}>Synopsis</button>
          <button onClick={() => smoothScroll("about")}>About the Author</button>
          <button className="primary-button" onClick={() => smoothScroll("toc")}>
            Begin Reading
          </button>
        </motion.nav>

        {/* Byline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1.2 }}
          className="title-byline"
        >
          By Michael Alonza Prentice Ware
        </motion.p>
      </div>
    </motion.section>
  );
}
