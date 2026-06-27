"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Dedication() {
  return (
    <section
      id="dedication"
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Full-bleed background: megiddo1.jpg */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="/assets/megiddo1.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            animation: "breathe 10s ease-in-out infinite",
          }}
        />
        {/* Dark overlay for text legibility */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(5,4,2,0.6) 0%, rgba(5,4,2,0.35) 40%, rgba(5,4,2,0.55) 85%, rgba(5,4,2,0.85) 100%)",
        }} />
        {/* Edge vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.5) 100%)",
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
          alignItems: "center", gap: "0",
          padding: "0 2rem",
        }}
      >
        <h2 className="front-matter-label">Dedicated to</h2>

        {/* Gold rule */}
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
          transition={{ delay: 0.5, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'Frank Ruhl Libre', serif",
            fontStyle: "italic",
            fontSize: "clamp(1.9rem, 5.5vw, 3.2rem)",
            lineHeight: 1.25,
            color: "#e4e0d8",
            textShadow: "0 2px 40px rgba(0,0,0,0.95), 0 0 80px rgba(0,0,0,0.6)",
            margin: 0,
          }}
        >
          James Lee Ware
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'EB Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
            color: "rgba(201,169,110,0.7)",
            letterSpacing: "0.09em",
            marginTop: "1.25rem",
          }}
        >
          In order to keep Curious
        </motion.p>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          style={{
            display: "flex", alignItems: "center", gap: "1rem",
            width: "min(200px, 60vw)", marginTop: "3rem",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.2)" }} />
          <span style={{ color: "rgba(201,169,110,0.45)", fontSize: "0.45rem" }}>✦</span>
          <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.2)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
