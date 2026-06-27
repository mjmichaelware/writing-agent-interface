"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookOpeningSequence() {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("nos-intro-v1")) return;
    sessionStorage.setItem("nos-intro-v1", "1");

    setPhase(1);
    const t1 = setTimeout(() => setPhase(2), 900);
    const t2 = setTimeout(() => setPhase(3), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === 0 || phase === 3) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="book-intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 2 ? 1 : phase === 1 ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", inset: 0, zIndex: 999999,
          background: "radial-gradient(ellipse at 50% 60%, #0e0b06 0%, #050402 70%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "2.5rem",
          perspective: "1600px",
        }}
      >
        {/* Book container */}
        <div style={{ position: "relative", width: 220, height: 300, transformStyle: "preserve-3d" }}>

          {/* Back panel — title page revealed after opening */}
          <div style={{
            position: "absolute", inset: 0,
            background: "#0a0805",
            border: "1px solid rgba(201,169,110,0.15)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "1.25rem", padding: "2rem",
          }}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: phase === 2 ? 1 : 0, y: phase === 2 ? 0 : 8 }}
              transition={{ delay: 2.0, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}
            >
              <div style={{ width: 36, height: 1, background: "rgba(201,169,110,0.4)" }} />
              <div style={{ fontFamily: "'Frank Ruhl Libre', serif", fontSize: "1.25rem", color: "#e8e4dc", textAlign: "center", lineHeight: 1.25 }}>
                The Weight<br />of the Sky
              </div>
              <div style={{ width: 24, height: 1, background: "rgba(201,169,110,0.3)" }} />
              <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: "0.7rem", color: "#8a857c", letterSpacing: "0.1em" }}>
                Michael Alonza Prentice Ware
              </div>
            </motion.div>
          </div>

          {/* Front cover — flips open */}
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: phase === 2 ? -162 : 0 }}
            transition={{ duration: 2.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            style={{
              position: "absolute", inset: 0,
              transformOrigin: "0% 50%",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Cover front face */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(160deg, #1d1409 0%, #120e07 55%, #0e0c06 100%)",
              border: "1px solid rgba(201,169,110,0.55)",
              boxShadow: "6px 0 30px rgba(0,0,0,0.7), 0 0 60px rgba(201,169,110,0.05)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "space-between",
              padding: "2rem 1.75rem",
              backfaceVisibility: "hidden",
            }}>
              {/* Top rule */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.4)" }} />
                <span style={{ color: "rgba(201,169,110,0.7)", fontSize: "0.45rem" }}>✦</span>
                <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.4)" }} />
              </div>

              {/* Title embossed */}
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Frank Ruhl Libre', serif",
                  fontSize: "1.45rem",
                  color: "#c9a96e",
                  lineHeight: 1.2,
                  textShadow: "0 0 24px rgba(201,169,110,0.55), 0 0 60px rgba(201,169,110,0.18)",
                  letterSpacing: "-0.01em",
                }}>
                  The Weight<br />of the Sky
                </div>
                <div style={{
                  marginTop: "0.75rem",
                  fontFamily: "'EB Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "0.78rem",
                  color: "rgba(201,169,110,0.55)",
                  letterSpacing: "0.05em",
                }}>
                  An Archetypal Tale
                </div>
              </div>

              {/* Bottom author line */}
              <div style={{ width: "100%", textAlign: "center" }}>
                <div style={{ height: 1, background: "rgba(201,169,110,0.22)", marginBottom: "0.875rem" }} />
                <div style={{
                  fontFamily: "'EB Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "0.65rem",
                  color: "rgba(201,169,110,0.5)",
                  letterSpacing: "0.1em",
                }}>
                  M. A. P. WARE
                </div>
              </div>
            </div>

            {/* Cover back face (seen mid-flip) */}
            <div style={{
              position: "absolute", inset: 0,
              background: "#08060300",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }} />
          </motion.div>

          {/* Subtle shadow beneath the book */}
          <div style={{
            position: "absolute", bottom: -20, left: "10%", right: "10%", height: 20,
            background: "radial-gradient(ellipse, rgba(201,169,110,0.06) 0%, transparent 70%)",
            filter: "blur(8px)",
          }} />
        </div>

        {/* Subtitle beneath the book */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 2 ? 1 : 0 }}
          transition={{ delay: 2.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'EB Garamond', serif",
            fontStyle: "italic",
            fontSize: "0.8125rem",
            color: "#8a857c",
            letterSpacing: "0.12em",
          }}
        >
          1003 BCE · Hebron
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
