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
    const t1 = setTimeout(() => setPhase(2), 3400);   // book arrives → cover opens
    const t2 = setTimeout(() => setPhase(3), 7200);   // start fade (7.2s in)
    const t3 = setTimeout(() => setPhase(4), 9200);   // remove from DOM
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 0 || phase === 4) return null;

  return (
    <motion.div
      key="nos-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 3 ? 0 : 1 }}
      transition={{ duration: phase === 3 ? 2.2 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed", inset: 0, zIndex: 999999,
        background: "radial-gradient(ellipse at 50% 45%, #0f0b06 0%, #040302 60%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "2.5rem",
        perspective: "1800px",
      }}
    >
      {/* Ambient glow behind book */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 0.18 : 0.06 }}
        transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          width: "min(90vw, 70vh)",
          height: "min(90vw, 70vh)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,1) 0%, rgba(201,169,110,0.3) 40%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Book body — spins in from afar */}
      <motion.div
        initial={{ rotateX: -24, rotateY: -600, scale: 0.04, z: -1200 }}
        animate={{ rotateX: 0, rotateY: 0, scale: 1, z: 0 }}
        transition={{
          type: "spring",
          stiffness: 30,
          damping: 11,
          delay: 0.1,
        }}
        style={{
          position: "relative",
          width: "min(85vw, 58vh, 520px)",
          height: "min(calc(85vw * 1.38), 80vh, 718px)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Book spine (left side in 3D) */}
        <div style={{
          position: "absolute",
          left: 0, top: 0, width: 14, height: "100%",
          background: "linear-gradient(90deg, #060402, #1c1509)",
          transform: "rotateY(-90deg) translateZ(0px)",
          transformOrigin: "left center",
        }} />

        {/* Back page / inner pages (revealed when cover opens) */}
        <div style={{
          position: "absolute", inset: 0,
          background: "#0c0907",
          border: "1px solid rgba(201,169,110,0.12)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "1rem",
          padding: "2.5rem 2rem",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 12 }}
            transition={{ delay: phase >= 2 ? 2.0 : 0, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.3)" }} />
              <span style={{ color: "rgba(201,169,110,0.55)", fontSize: "0.55rem" }}>✦</span>
              <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.3)" }} />
            </div>
            <div style={{
              fontFamily: "'Frank Ruhl Libre', serif",
              fontSize: "clamp(1.1rem, 3vw, 1.6rem)", color: "#e4e0d8",
              textAlign: "center", lineHeight: 1.25,
            }}>
              The Weight<br />of the Sky
            </div>
            <div style={{ width: 32, height: 1, background: "rgba(201,169,110,0.22)" }} />
            <div style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: "italic", fontSize: "clamp(0.6rem, 1.5vw, 0.8rem)",
              color: "#8a857c", letterSpacing: "0.1em",
              textAlign: "center",
            }}>
              Michael Alonza Prentice Ware
            </div>
          </motion.div>
        </div>

        {/* Front cover — hinges open on left edge */}
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: phase >= 2 ? -168 : 0 }}
          transition={{
            duration: 3.6,
            ease: [0.22, 1, 0.36, 1],
            delay: phase >= 2 ? 0.5 : 0,
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
            background: "linear-gradient(160deg, #1f1509 0%, #130f07 52%, #0e0c06 100%)",
            border: "1px solid rgba(201,169,110,0.55)",
            boxShadow: "8px 0 36px rgba(0,0,0,0.8), 0 0 60px rgba(201,169,110,0.06), inset 0 0 40px rgba(0,0,0,0.4)",
            backfaceVisibility: "hidden",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "space-between",
            padding: "clamp(1.5rem, 5vh, 3rem) clamp(1.25rem, 4vw, 2.5rem)",
          }}>
            {/* Top rule */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.38)" }} />
              <span style={{ color: "rgba(201,169,110,0.65)", fontSize: "0.45rem" }}>✦</span>
              <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.38)" }} />
            </div>

            {/* Title embossed */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Frank Ruhl Libre', serif",
                fontSize: "clamp(1.4rem, 4vw, 2.2rem)", color: "#c9a96e",
                lineHeight: 1.15,
                textShadow: "0 0 28px rgba(201,169,110,0.65), 0 0 70px rgba(201,169,110,0.22)",
                letterSpacing: "-0.01em",
              }}>
                The Weight<br />of the Sky
              </div>
              <div style={{
                marginTop: "1rem",
                fontFamily: "'EB Garamond', serif",
                fontStyle: "italic", fontSize: "clamp(0.7rem, 2vw, 1rem)",
                color: "rgba(201,169,110,0.5)", letterSpacing: "0.06em",
              }}>
                An Archetypal Tale
              </div>
            </div>

            {/* Author + bottom rule */}
            <div style={{ width: "100%", textAlign: "center" }}>
              <div style={{ height: 1, background: "rgba(201,169,110,0.18)", marginBottom: "1rem" }} />
              <div style={{
                fontFamily: "'EB Garamond', serif",
                fontStyle: "italic", fontSize: "clamp(0.55rem, 1.5vw, 0.75rem)",
                color: "rgba(201,169,110,0.46)", letterSpacing: "0.12em",
              }}>
                M. A. P. WARE
              </div>
            </div>
          </div>

          {/* Cover back face (visible mid-flip) */}
          <div style={{
            position: "absolute", inset: 0,
            background: "#060402",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }} />
        </motion.div>

        {/* Drop shadow beneath */}
        <div style={{
          position: "absolute", bottom: -30, left: "6%", right: "6%", height: 30,
          background: "radial-gradient(ellipse, rgba(201,169,110,0.09) 0%, transparent 70%)",
          filter: "blur(14px)",
        }} />
      </motion.div>

      {/* Subtitle beneath the book */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        transition={{ delay: phase >= 2 ? 2.8 : 0, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "'EB Garamond', serif",
          fontStyle: "italic", fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
          color: "#8a857c", letterSpacing: "0.14em",
        }}
      >
        1003 BCE · Hebron
      </motion.div>
    </motion.div>
  );
}
