"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => setVisible(window.scrollY > window.innerHeight * 3);
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  if (!visible) return null;

  return (
    <button
      className="scroll-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Return to top"
      style={{
        position: "fixed",
        bottom: "2.5rem",
        left: "2.5rem",
        zIndex: 200,
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "rgba(8,7,5,0.88)",
        border: "1px solid rgba(201,169,110,0.32)",
        color: "#c9a96e",
        fontSize: "0.65rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: "0 0 18px rgba(201,169,110,0.08), 0 4px 20px rgba(0,0,0,0.55)",
        transition: "background 300ms cubic-bezier(0.22,1,0.36,1), border-color 300ms, box-shadow 300ms, transform 300ms",
        letterSpacing: "0.02em",
      }}
    >
      ✦
    </button>
  );
}
