"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { smoothScroll } from "@/utils/smoothScroll";
import { bus } from "@/core/runtimeEngine";

const NAV_ITEMS = [
  { label: "Dedication", target: "dedication" },
  { label: "Synopsis", target: "synopsis" },
  { label: "About the Author", target: "about" },
];

const PARTICLES = [
  { left: "18%", delay: 0,  duration: 14 },
  { left: "62%", delay: 4,  duration: 17 },
  { left: "38%", delay: 9,  duration: 13 },
  { left: "80%", delay: 2,  duration: 19 },
];

export default function TitleCover() {
  const { scrollYProgress } = useScroll();
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.07]);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    bus.emit("scroll:focus", { sectionId: "title-page", content: "title-page" });
  }, []);

  // Magnetic buttons: pull toward cursor within 90px radius
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const onMove = (e: MouseEvent) => {
      nav.querySelectorAll<HTMLElement>("button").forEach(btn => {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < 90) {
          const pull = (1 - dist / 90) * 9;
          btn.style.transform = `translate(${(dx / dist) * pull}px, ${(dy / dist) * pull}px)`;
        } else {
          btn.style.transform = "";
        }
      });
    };

    const onLeave = () => {
      nav.querySelectorAll<HTMLElement>("button").forEach(btn => {
        btn.style.transform = "";
      });
    };

    nav.addEventListener("mousemove", onMove);
    nav.addEventListener("mouseleave", onLeave);
    return () => {
      nav.removeEventListener("mousemove", onMove);
      nav.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <motion.section
      id="title-page"
      style={{ opacity: sectionOpacity, position: "relative", height: "100vh", overflow: "hidden" }}
      className="flex flex-col items-center justify-center text-center"
    >
      {/* Full-bleed background with scroll parallax */}
      <motion.div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", scale: bgScale }}>
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
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(5,4,2,0.3) 35%, rgba(5,4,2,0.62) 80%, rgba(5,4,2,0.92) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(0,0,0,0.52) 100%)",
        }} />
      </motion.div>

      {/* 15. Four floating gold particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: p.left,
            bottom: "10%",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "#c9a96e",
            boxShadow: "0 0 6px rgba(201,169,110,0.7)",
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "0 1.5rem" }}>

        {/* Title drops from above — slow and dramatic */}
        <motion.h1
          initial={{ opacity: 0, y: -180 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="title-display title-shimmer"
        >
          The Weight of the Sky
        </motion.h1>

        {/* Subtitle rises from below */}
        <motion.p
          initial={{ opacity: 0, y: 120 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
          className="title-subtitle"
        >
          An Archetypal Tale
        </motion.p>

        {/* Gold ornament rule unfurls from center */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 1.4 }}
          style={{
            display: "flex", alignItems: "center", gap: "1rem",
            width: "min(280px, 70vw)", margin: "2.5rem auto 0",
            transformOrigin: "center",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.3)" }} />
          <span style={{ color: "rgba(201,169,110,0.65)", fontSize: "0.5rem" }}>✦</span>
          <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.3)" }} />
        </motion.div>

        {/* Nav row — staggered, magnetic */}
        <motion.nav
          ref={navRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 1.4 }}
          className="title-nav"
        >
          {NAV_ITEMS.map((item, i) => (
            <motion.button
              key={item.target}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.85 + i * 0.14, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => smoothScroll(item.target)}
            >
              {item.label}
            </motion.button>
          ))}
          <motion.button
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.27, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
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
