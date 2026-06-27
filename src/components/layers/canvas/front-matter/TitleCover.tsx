"use client";

import React, { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { smoothScroll } from "@/utils/smoothScroll";
import { bus } from "@/core/runtimeEngine";

const NAV_ITEMS = [
  { label: "Dedication", target: "dedication" },
  { label: "Synopsis", target: "synopsis" },
  { label: "About the Author", target: "about" },
];

export default function TitleCover() {
  const { scrollYProgress } = useScroll();
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.08]);

  useEffect(() => {
    bus.emit("scroll:focus", { sectionId: "title-page", content: "title-page" });
  }, []);

  return (
    <motion.section
      id="title-page"
      style={{ opacity: sectionOpacity, position: "relative", height: "100vh", overflow: "hidden" }}
      className="flex flex-col items-center justify-center text-center"
    >
      {/* Full-bleed background image with parallax out on scroll */}
      <motion.div
        style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", scale: bgScale }}
      >
        <motion.img
          src="/assets/bg.png"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 28%",
          }}
        />
        {/* Vignette gradient for legibility */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(5,4,2,0.32) 35%, rgba(5,4,2,0.65) 80%, rgba(5,4,2,0.92) 100%)",
        }} />
        {/* Edge vignette for cinema feel */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }} />
      </motion.div>

      {/* Content layer — above the background */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "0 1.5rem" }}>

        {/* Title — drops from top, slow and dramatic */}
        <motion.h1
          initial={{ opacity: 0, y: -180 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="title-display title-shimmer"
        >
          The Weight of the Sky
        </motion.h1>

        {/* Subtitle — rises from below */}
        <motion.p
          initial={{ opacity: 0, y: 120 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
          className="title-subtitle"
        >
          An Archetypal Tale
        </motion.p>

        {/* Gold ornament rule */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 1.4 }}
          style={{
            display: "flex", alignItems: "center", gap: "1rem",
            width: "min(280px, 70vw)", margin: "2.5rem auto 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.3)" }} />
          <span style={{ color: "rgba(201,169,110,0.65)", fontSize: "0.5rem" }}>✦</span>
          <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.3)" }} />
        </motion.div>

        {/* Nav row — staggered reveals */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 1.5 }}
          className="title-nav"
        >
          {NAV_ITEMS.map((item, i) => (
            <motion.button
              key={item.target}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 + i * 0.15, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => smoothScroll(item.target)}
            >
              {item.label}
            </motion.button>
          ))}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.25, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="primary-button"
            onClick={() => smoothScroll("toc")}
          >
            Begin Reading
          </motion.button>
        </motion.nav>

        {/* Byline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 1.6 }}
          className="title-byline"
          style={{ marginTop: "3rem" }}
        >
          By Michael Alonza Prentice Ware
        </motion.p>
      </div>
    </motion.section>
  );
}
