"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Phase timeline:
// "blocked" — first client paint, black screen, check sessionStorage
// 0          — already played this session → skip immediately to done
// 1          — book tumbles in from far distance (0–6s)
// 2          — book settles, pages fan open (6–10s)
// 3          — title revealed, hold (10–14s)
// 4          — fade out (14–16.5s)
// 5          — removed from DOM

type Phase = "blocked" | 0 | 1 | 2 | 3 | 4 | 5;

const SESSION_KEY = "nos-intro-v2";

export default function BookOpeningSequence() {
  const [phase, setPhase] = useState<Phase>("blocked");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      setPhase(5);
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");
    setPhase(1);

    const t1 = setTimeout(() => setPhase(2), 5800);   // book settles → pages fan
    const t2 = setTimeout(() => setPhase(3), 9600);   // pages fanned → title holds
    const t3 = setTimeout(() => setPhase(4), 13800);  // start fade
    const t4 = setTimeout(() => setPhase(5), 16600);  // remove DOM

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  if (phase === 5) return null;

  const pageCount = 7;

  return (
    <AnimatePresence>
      <motion.div
        key="nos-intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 4 ? 0 : 1 }}
        transition={{ duration: phase === 4 ? 2.8 : 0, ease: [0.22, 1, 0.36, 1] }}
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
          animate={{ opacity: phase === "blocked" || phase === 0 ? 0 : phase === 1 ? 0.04 : phase === 2 ? 0.12 : 0.22 }}
          transition={{ duration: 3.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            width: "min(110vw, 85vh)",
            height: "min(110vw, 85vh)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.9) 0%, rgba(201,169,110,0.25) 40%, transparent 68%)",
            filter: "blur(72px)",
            pointerEvents: "none",
          }}
        />

        {/* Book container */}
        <motion.div
          // Tumble in from far away — long approach with multiple rotations
          initial={{ rotateX: -18, rotateY: -1080, rotateZ: -22, scale: 0.02, z: -2800 }}
          animate={
            phase === "blocked" || phase === 0
              ? { rotateX: -18, rotateY: -1080, rotateZ: -22, scale: 0.02, z: -2800 }
              : phase === 1
              ? { rotateX: 0, rotateY: -30, rotateZ: -4, scale: 1, z: 0 }
              : { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, z: 0 }
          }
          transition={{
            type: "spring",
            stiffness: 14,
            damping: 10,
            delay: phase === 1 ? 0.05 : 0,
            ...(phase >= 2 ? { stiffness: 40, damping: 18 } : {}),
          }}
          style={{
            position: "relative",
            width: "min(82vw, 54vh, 500px)",
            height: "min(calc(82vw * 1.4), 76vh, 700px)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Spine */}
          <div style={{
            position: "absolute", left: 0, top: 0, width: 16, height: "100%",
            background: "linear-gradient(90deg, #030200, #1a1307)",
            transform: "rotateY(-90deg) translateZ(0px)",
            transformOrigin: "left center",
          }} />

          {/* Back cover */}
          <div style={{
            position: "absolute", inset: 0,
            background: "#0c0907",
            border: "1px solid rgba(201,169,110,0.1)",
          }} />

          {/* Pages fanning — cascade of thin leaves */}
          {Array.from({ length: pageCount }).map((_, i) => {
            const progress = i / (pageCount - 1);
            const fanAngle = phase >= 2 ? -(10 + progress * 140) : 0;
            const delay = phase >= 2 ? 0.04 + i * 0.07 : 0;
            return (
              <motion.div
                key={i}
                animate={{ rotateY: fanAngle }}
                transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1], delay }}
                style={{
                  position: "absolute", inset: 0,
                  transformOrigin: "0% 50%",
                  background: `rgba(${14 + i * 3}, ${11 + i * 2}, ${7 + i}, ${0.85 - i * 0.04})`,
                  borderRight: "1px solid rgba(201,169,110,0.06)",
                }}
              />
            );
          })}

          {/* Inner pages — visible once fanned */}
          <motion.div
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            transition={{ duration: 1.5, delay: phase >= 2 ? 1.0 : 0 }}
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(160deg, #0f0c08, #080603)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "1rem", padding: "2.5rem 2rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 16 }}
              transition={{ delay: phase >= 3 ? 0.4 : 0, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", width: "100%" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.28)" }} />
                <span style={{ color: "rgba(201,169,110,0.5)", fontSize: "0.55rem" }}>✦</span>
                <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.28)" }} />
              </div>
              <div style={{
                fontFamily: "'Frank Ruhl Libre', serif",
                fontSize: "clamp(1.1rem, 3vw, 1.55rem)", color: "#e4e0d8",
                textAlign: "center", lineHeight: 1.25,
              }}>
                The Weight<br />of the Sky
              </div>
              <div style={{ width: 32, height: 1, background: "rgba(201,169,110,0.22)" }} />
              <div style={{
                fontFamily: "'EB Garamond', serif", fontStyle: "italic",
                fontSize: "clamp(0.6rem, 1.5vw, 0.78rem)",
                color: "#8a857c", letterSpacing: "0.1em", textAlign: "center",
              }}>
                Michael Alonza Prentice Ware
              </div>
            </motion.div>
          </motion.div>

          {/* Front cover — hinges open */}
          <motion.div
            animate={{ rotateY: phase >= 2 ? -166 : 0 }}
            transition={{
              duration: 3.8,
              ease: [0.22, 1, 0.36, 1],
              delay: phase >= 2 ? 0.85 : 0,
            }}
            style={{
              position: "absolute", inset: 0,
              transformOrigin: "0% 50%",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Cover front face */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(160deg, #1e1408 0%, #120e07 52%, #0d0b06 100%)",
              border: "1px solid rgba(201,169,110,0.5)",
              boxShadow: "10px 0 40px rgba(0,0,0,0.85), 0 0 60px rgba(201,169,110,0.05), inset 0 0 50px rgba(0,0,0,0.45)",
              backfaceVisibility: "hidden",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "space-between",
              padding: "clamp(1.5rem, 5vh, 3rem) clamp(1.25rem, 4vw, 2.5rem)",
            }}>
              {/* Top rule */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.35)" }} />
                <span style={{ color: "rgba(201,169,110,0.6)", fontSize: "0.45rem" }}>✦</span>
                <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.35)" }} />
              </div>

              {/* Title */}
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Frank Ruhl Libre', serif",
                  fontSize: "clamp(1.4rem, 4vw, 2.2rem)", color: "#c9a96e",
                  lineHeight: 1.15,
                  textShadow: "0 0 30px rgba(201,169,110,0.7), 0 0 80px rgba(201,169,110,0.22)",
                  letterSpacing: "-0.01em",
                }}>
                  The Weight<br />of the Sky
                </div>
                <div style={{
                  marginTop: "0.9rem",
                  fontFamily: "'EB Garamond', serif", fontStyle: "italic",
                  fontSize: "clamp(0.7rem, 2vw, 1rem)",
                  color: "rgba(201,169,110,0.48)", letterSpacing: "0.06em",
                }}>
                  An Archetypal Tale
                </div>
              </div>

              {/* Author + bottom rule */}
              <div style={{ width: "100%", textAlign: "center" }}>
                <div style={{ height: 1, background: "rgba(201,169,110,0.16)", marginBottom: "1rem" }} />
                <div style={{
                  fontFamily: "'EB Garamond', serif", fontStyle: "italic",
                  fontSize: "clamp(0.55rem, 1.5vw, 0.72rem)",
                  color: "rgba(201,169,110,0.44)", letterSpacing: "0.12em",
                }}>
                  M. A. P. WARE
                </div>
              </div>
            </div>

            {/* Cover back face */}
            <div style={{
              position: "absolute", inset: 0,
              background: "#050301",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }} />
          </motion.div>

          {/* Drop shadow */}
          <div style={{
            position: "absolute", bottom: -35, left: "5%", right: "5%", height: 35,
            background: "radial-gradient(ellipse, rgba(201,169,110,0.12) 0%, transparent 70%)",
            filter: "blur(18px)",
          }} />
        </motion.div>

        {/* Subtitle beneath */}
        <motion.div
          animate={{ opacity: phase >= 3 ? 1 : 0 }}
          transition={{ delay: phase >= 3 ? 1.2 : 0, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'EB Garamond', serif", fontStyle: "italic",
            fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
            color: "#8a857c", letterSpacing: "0.16em",
          }}
        >
          1003 BCE · Hebron
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
