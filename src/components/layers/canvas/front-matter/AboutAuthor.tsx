"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AboutAuthor() {
  return (
    <section
      id="about"
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
      {/* Full-bleed background: megiddo2.jpg */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="/assets/megiddo2.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 35%",
            animation: "breathe 11s ease-in-out infinite",
            animationDelay: "-2s",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(5,4,2,0.65) 0%, rgba(5,4,2,0.42) 40%, rgba(5,4,2,0.55) 80%, rgba(5,4,2,0.9) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 48%, rgba(0,0,0,0.5) 100%)",
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
          maxWidth: "min(62ch, calc(100vw - 3rem))",
          padding: "0 1.5rem",
        }}
      >
        <h2 className="front-matter-label">About the Author</h2>

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
            fontSize: "clamp(1rem, 2.8vw, 1.35rem)",
            lineHeight: 1.78,
            color: "#e4e0d8",
            textAlign: "center",
            textShadow: "0 2px 20px rgba(0,0,0,0.95)",
            margin: 0,
          }}
        >
          <span style={{
            fontFamily: "'Frank Ruhl Libre', serif",
            fontWeight: 700,
            color: "#c9a96e",
            textShadow: "0 0 20px rgba(201,169,110,0.4)",
          }}>
            Michael Alonza Prentice Ware
          </span>{" "}
          is a systems architecture specialist. He is pursuing a Bachelor of Science in Computer
          Science at Weber State University, focusing his development research on Machine Learning
          Alignment Governance and Explainable AI (XAI). Outside of layout engineering, he practices
          classical piano for three hours daily following the Russian method and Alexander technique
          principles.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%", marginTop: "2.5rem" }}
        >
          <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.2)" }} />
          <span style={{ color: "rgba(201,169,110,0.45)", fontSize: "0.5rem" }}>✦</span>
          <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.2)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
