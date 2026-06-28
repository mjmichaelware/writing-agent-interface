"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let tx = -800;
    let ty = -800;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      if (el) {
        el.style.left = `${tx}px`;
        el.style.top = `${ty}px`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 9,
        width: 640,
        height: 640,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(201,169,110,0.038) 0%, rgba(201,169,110,0.012) 40%, transparent 68%)",
        transform: "translate(-50%, -50%)",
        left: -800,
        top: -800,
      }}
    />
  );
}
