"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// "blocked" = first render (SSR + client hydration) — black overlay, nothing shown
// 1 = book tumbles in
// 2 = pages fan, cover opens
// 3 = title revealed, hold
// 4 = fade out
// 5 = removed from DOM
// 0 = already played this session — skip to fast fade then 5

type Phase = "blocked" | 0 | 1 | 2 | 3 | 4 | 5;
const KEY = "nos-intro-v3";

export default function BookOpeningSequence() {
  // Start "blocked" on both SSR and client — renders same thing, no hydration mismatch
  const [phase, setPhase] = useState<Phase>("blocked");

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) {
      // Already played — fade out quickly then remove
      setPhase(4);
      const t = setTimeout(() => setPhase(5), 400);
      return () => clearTimeout(t);
    }
    sessionStorage.setItem(KEY, "1");
    setPhase(1);

    const t1 = setTimeout(() => setPhase(2), 4200);
    const t2 = setTimeout(() => setPhase(3), 7400);
    const t3 = setTimeout(() => setPhase(4), 11000);
    const t4 = setTimeout(() => setPhase(5), 13200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  if (phase === 5) return null;

  const fading = phase === 4;
  const isBlocked = phase === "blocked" || phase === 0;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: fading ? (phase === 0 ? 0.35 : 2.2) : 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 999999,
        background: "radial-gradient(ellipse at 50% 42%, #0f0b06 0%, #030201 65%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "2rem",
        perspective: "2200px",
      }}
    >
      {/* Ambient glow */}
      <motion.div
        animate={{ opacity: isBlocked ? 0 : phase === 1 ? 0.05 : phase === 2 ? 0.14 : 0.24 }}
        transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          width: "min(110vw, 85vh)",
          height: "min(110vw, 85vh)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.85) 0%, rgba(201,169,110,0.2) 42%, transparent 68%)",
          filter: "blur(72px)",
          pointerEvents: "none",
        }}
      />

      {/* Book */}
      <motion.div
        initial={{ rotateX: -18, rotateY: -900, rotateZ: -20, scale: 0.02, z: -2400 }}
        animate={isBlocked
          ? { rotateX: -18, rotateY: -900, rotateZ: -20, scale: 0.02, z: -2400 }
          : phase === 1
          ? { rotateX: 0, rotateY: -22, rotateZ: -3, scale: 1, z: 0 }
          : { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, z: 0 }
        }
        transition={phase === 1
          ? { type: "spring", stiffness: 16, damping: 11, delay: 0.05 }
          : { type: "spring", stiffness: 45, damping: 18 }
        }
        style={{
          position: "relative",
          width: "min(80vw, 52vh, 480px)",
          height: "min(calc(80vw * 1.4), 74vh, 672px)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Spine */}
        <div style={{
          position: "absolute", left: 0, top: 0, width: 14, height: "100%",
          background: "linear-gradient(90deg, #020100, #191206)",
          transform: "rotateY(-90deg) translateZ(0px)",
          transformOrigin: "left center",
        }} />

        {/* Back cover */}
        <div style={{ position: "absolute", inset: 0, background: "#0b0804", border: "1px solid rgba(201,169,110,0.08)" }} />

        {/* Fanning pages — 7 leaves cascade open */}
        {[0,1,2,3,4,5,6].map(i => (
          <motion.div
            key={i}
            animate={{ rotateY: phase >= 2 ? -(12 + (i / 6) * 138) : 0 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: phase >= 2 ? 0.05 + i * 0.065 : 0 }}
            style={{
              position: "absolute", inset: 0,
              transformOrigin: "0% 50%",
              background: `rgba(${13 + i * 3},${10 + i * 2},${6 + i},${0.88 - i * 0.04})`,
              borderRight: "1px solid rgba(201,169,110,0.05)",
            }}
          />
        ))}

        {/* Inner page content — title page */}
        <motion.div
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          transition={{ duration: 1.2, delay: phase >= 2 ? 0.9 : 0 }}
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(155deg, #0f0c08, #080503)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "1rem", padding: "2.5rem 2rem",
          }}
        >
          <motion.div
            animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 14 }}
            transition={{ delay: phase >= 3 ? 0.35 : 0, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", width: "100%" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.26)" }} />
              <span style={{ color: "rgba(201,169,110,0.48)", fontSize: "0.52rem" }}>✦</span>
              <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.26)" }} />
            </div>
            <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "clamp(1.05rem, 3vw, 1.5rem)", color: "#e2ddd5", textAlign: "center", lineHeight: 1.25 }}>
              The Weight<br />of the Sky
            </div>
            <div style={{ width: 28, height: 1, background: "rgba(201,169,110,0.2)" }} />
            <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: "clamp(0.58rem, 1.4vw, 0.76rem)", color: "#8a857c", letterSpacing: "0.1em", textAlign: "center" }}>
              Michael Alonza Prentice Ware
            </div>
          </motion.div>
        </motion.div>

        {/* Front cover — hinges open */}
        <motion.div
          animate={{ rotateY: phase >= 2 ? -164 : 0 }}
          transition={{ duration: 3.4, ease: [0.22, 1, 0.36, 1], delay: phase >= 2 ? 0.8 : 0 }}
          style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transformStyle: "preserve-3d" }}
        >
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(160deg, #1e1408, #120e07 52%, #0d0b06)",
            border: "1px solid rgba(201,169,110,0.48)",
            boxShadow: "9px 0 38px rgba(0,0,0,0.88), inset 0 0 50px rgba(0,0,0,0.4)",
            backfaceVisibility: "hidden",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "space-between",
            padding: "clamp(1.5rem,5vh,3rem) clamp(1.25rem,4vw,2.5rem)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.33)" }} />
              <span style={{ color: "rgba(201,169,110,0.58)", fontSize: "0.42rem" }}>✦</span>
              <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.33)" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "clamp(1.4rem,4vw,2.2rem)", color: "#c9a96e", lineHeight: 1.15, textShadow: "0 0 28px rgba(201,169,110,0.68), 0 0 70px rgba(201,169,110,0.2)", letterSpacing: "-0.01em" }}>
                The Weight<br />of the Sky
              </div>
              <div style={{ marginTop: "0.85rem", fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: "clamp(0.68rem,2vw,0.95rem)", color: "rgba(201,169,110,0.46)", letterSpacing: "0.06em" }}>
                An Archetypal Tale
              </div>
            </div>
            <div style={{ width: "100%", textAlign: "center" }}>
              <div style={{ height: 1, background: "rgba(201,169,110,0.15)", marginBottom: "0.9rem" }} />
              <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: "clamp(0.54rem,1.4vw,0.7rem)", color: "rgba(201,169,110,0.42)", letterSpacing: "0.12em" }}>
                M. A. P. WARE
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, background: "#040200", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} />
        </motion.div>

        {/* Shadow */}
        <div style={{ position: "absolute", bottom: -32, left: "6%", right: "6%", height: 32, background: "radial-gradient(ellipse, rgba(201,169,110,0.1) 0%, transparent 70%)", filter: "blur(16px)" }} />
      </motion.div>

      {/* Subtitle */}
      <motion.div
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        transition={{ delay: phase >= 3 ? 1.0 : 0, duration: 1.2 }}
        style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: "clamp(0.72rem,2vw,0.88rem)", color: "#8a857c", letterSpacing: "0.16em" }}
      >
        1003 BCE · Hebron
      </motion.div>
    </motion.div>
  );
}
