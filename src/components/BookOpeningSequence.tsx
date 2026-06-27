"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Phase timeline:
// 0 — not shown (already played, or SSR)
// 1 — book enters: spins out of darkness toward viewer
// 2 — book settled: cover opens
// 3 — overlay fades out
// 4 — removed from DOM

export default function BookOpeningSequence() {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("nos-intro-v1")) return;
    sessionStorage.setItem("nos-intro-v1", "1");

    setPhase(1);
    const t1 = setTimeout(() => setPhase(2), 2200);   // book arrives → cover opens
    const t2 = setTimeout(() => setPhase(3), 4800);   // start fade
    const t3 = setTimeout(() => setPhase(4), 6200);   // remove from DOM
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 0 || phase === 4) return null;

  return (
    <motion.div
      key="nos-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 3 ? 0 : 1 }}
      transition={{ duration: phase === 3 ? 1.6 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed", inset: 0, zIndex: 999999,
        background: "radial-gradient(ellipse at 50% 45%, #0e0b06 0%, #040302 65%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "2.5rem",
        perspective: "1400px",
      }}
    >
      {/* Book body — spins in from afar */}
      <motion.div
        initial={{ rotateX: -20, rotateY: -540, scale: 0.1, z: -400 }}
        animate={{ rotateX: 0, rotateY: 0, scale: 1, z: 0 }}
        transition={{
          type: "spring",
          stiffness: 55,
          damping: 16,
          delay: 0.15,
        }}
        style={{
          position: "relative",
          width: 210,
          height: 290,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Book spine (left side in 3D) */}
        <div style={{
          position: "absolute",
          left: 0, top: 0, width: 10, height: "100%",
          background: "linear-gradient(90deg, #0a0805, #1a140a)",
          transform: "rotateY(-90deg) translateZ(0px)",
          transformOrigin: "left center",
        }} />

        {/* Back page / inner pages (revealed when cover opens) */}
        <div style={{
          position: "absolute", inset: 0,
          background: "#0b0906",
          border: "1px solid rgba(201,169,110,0.12)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "0.875rem",
          padding: "2rem 1.75rem",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 8 }}
            transition={{ delay: phase >= 2 ? 1.7 : 0, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}
          >
            <div style={{ width: 38, height: 1, background: "rgba(201,169,110,0.38)" }} />
            <div style={{
              fontFamily: "'Frank Ruhl Libre', serif",
              fontSize: "1.2rem", color: "#e4e0d8",
              textAlign: "center", lineHeight: 1.3,
            }}>
              The Weight<br />of the Sky
            </div>
            <div style={{ width: 26, height: 1, background: "rgba(201,169,110,0.28)" }} />
            <div style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: "italic", fontSize: "0.65rem",
              color: "#8a857c", letterSpacing: "0.1em",
            }}>
              Michael Alonza Prentice Ware
            </div>
          </motion.div>
        </div>

        {/* Front cover — hinges open on left edge */}
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: phase >= 2 ? -164 : 0 }}
          transition={{
            duration: 2.1,
            ease: [0.22, 1, 0.36, 1],
            delay: phase >= 2 ? 0.4 : 0,
          }}
          style={{
            position: "absolute", inset: 0,
            transformOrigin: "0% 50%",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Cover — front face */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(160deg, #1d1409 0%, #120e07 52%, #0e0c06 100%)",
            border: "1px solid rgba(201,169,110,0.52)",
            boxShadow: "6px 0 28px rgba(0,0,0,0.75), 0 0 50px rgba(201,169,110,0.05)",
            backfaceVisibility: "hidden",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "space-between",
            padding: "2rem 1.75rem",
          }}>
            {/* Top rule */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.38)" }} />
              <span style={{ color: "rgba(201,169,110,0.65)", fontSize: "0.42rem" }}>✦</span>
              <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.38)" }} />
            </div>

            {/* Title embossed */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Frank Ruhl Libre', serif",
                fontSize: "1.45rem", color: "#c9a96e",
                lineHeight: 1.2,
                textShadow: "0 0 22px rgba(201,169,110,0.55), 0 0 55px rgba(201,169,110,0.18)",
                letterSpacing: "-0.01em",
              }}>
                The Weight<br />of the Sky
              </div>
              <div style={{
                marginTop: "0.75rem",
                fontFamily: "'EB Garamond', serif",
                fontStyle: "italic", fontSize: "0.78rem",
                color: "rgba(201,169,110,0.52)", letterSpacing: "0.05em",
              }}>
                An Archetypal Tale
              </div>
            </div>

            {/* Author + bottom rule */}
            <div style={{ width: "100%", textAlign: "center" }}>
              <div style={{ height: 1, background: "rgba(201,169,110,0.2)", marginBottom: "0.875rem" }} />
              <div style={{
                fontFamily: "'EB Garamond', serif",
                fontStyle: "italic", fontSize: "0.62rem",
                color: "rgba(201,169,110,0.48)", letterSpacing: "0.1em",
              }}>
                M. A. P. WARE
              </div>
            </div>
          </div>

          {/* Cover back face (visible mid-flip) */}
          <div style={{
            position: "absolute", inset: 0,
            background: "#070504",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }} />
        </motion.div>

        {/* Drop shadow beneath */}
        <div style={{
          position: "absolute", bottom: -22, left: "8%", right: "8%", height: 22,
          background: "radial-gradient(ellipse, rgba(201,169,110,0.07) 0%, transparent 70%)",
          filter: "blur(10px)",
        }} />
      </motion.div>

      {/* Subtitle beneath the book */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        transition={{ delay: phase >= 2 ? 2.3 : 0, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "'EB Garamond', serif",
          fontStyle: "italic", fontSize: "0.8125rem",
          color: "#8a857c", letterSpacing: "0.12em",
        }}
      >
        1003 BCE · Hebron
      </motion.div>
    </motion.div>
  );
}
