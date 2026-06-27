"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Synopsis() {
  return (
    <section
      id="synopsis"
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Full-bleed background: flies.jpg */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="/assets/flies.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 40%",
            animation: "breathe 12s ease-in-out infinite",
            animationDelay: "-4s",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(5,4,2,0.7) 0%, rgba(5,4,2,0.48) 30%, rgba(5,4,2,0.48) 70%, rgba(5,4,2,0.82) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.52) 100%)",
        }} />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "-10%" }}
        style={{
          position: "relative", zIndex: 1,
          display: "flex", flexDirection: "column",
          alignItems: "center",
          maxWidth: "min(65ch, calc(100vw - 3rem))",
          padding: "0 1.5rem",
        }}
      >
        <h2 className="front-matter-label">Synopsis</h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          style={{
            width: 70, height: 1,
            background: "rgba(201,169,110,0.45)",
            margin: "0 auto 2.5rem",
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'EB Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 2.8vw, 1.45rem)",
            lineHeight: 1.78,
            color: "#e4e0d8",
            textAlign: "center",
            textShadow: "0 2px 20px rgba(0,0,0,0.95)",
            margin: 0,
          }}
        >
          In{" "}
          <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 700 }}>Hebron</span>{" "}
          in 1003 BCE, during the early days of King{" "}
          <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 700 }}>David</span>'s
          rule over{" "}
          <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 700 }}>Judah</span>,
          sixteen-year-old{" "}
          <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 700 }}>Dan</span>{" "}
          lives inside an oppressive home paralyzed by his father's hoarding grief.{" "}
          <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 700 }}>Dan</span>{" "}
          is a dreamwalker, a visionary uniquely capable of consciously stepping into a hidden world
          constructed from minute cells of universal dust. When his deep interventions fracture his
          family,{" "}
          <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 700 }}>Dan</span>{" "}
          is cast out, forced to embark on a punishing physical trek northward toward Mount{" "}
          <span style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 700 }}>Hermon</span>{" "}
          to find the ultimate source of reality. His path demands a brutal expenditure of tissue
          and will, shattering his physical voice and bringing him face-to-face with an infinite
          cycle of conflict written in the stars.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%", marginTop: "2.5rem" }}
        >
          <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.22)" }} />
          <span style={{ color: "rgba(201,169,110,0.55)", fontSize: "0.5rem" }}>✦</span>
          <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.22)" }} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'EB Garamond', serif",
            fontStyle: "italic",
            fontSize: "0.72rem",
            color: "rgba(201,169,110,0.5)",
            letterSpacing: "0.14em",
            marginTop: "1.5rem",
          }}
        >
          1003 BCE · Hebron
        </motion.p>
      </motion.div>
    </section>
  );
}
