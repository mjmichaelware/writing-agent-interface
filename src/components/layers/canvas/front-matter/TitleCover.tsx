"use client";

import React from "react";
import { bus } from "@/core/runtimeEngine";

export default function TitleCover() {
  const handleBegin = () => {
    bus.emit('scroll:begin', { target: 'dedication' });
  };

  const navLinks = [
    { label: "Dedication", target: "dedication" },
    { label: "Synopsis", target: "synopsis" },
    { label: "About the Author", target: "author" },
    { label: "Table of Contents", target: "toc" },
  ];

  return (
    <section 
        id="title" 
        className="relative h-screen w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Feature 100: Prestige Title Overlay */}
      <div className="z-10 animate-fade-in flex flex-col items-center">
        
        <h1 
            className="font-hebrew text-[#c9a96e] mb-4"
            style={{ fontSize: "clamp(2.8rem, 10vw, 6.5rem)", lineHeight: 1.1 }}
        >
          The Weight of the Sky
        </h1>
        
        <p className="font-serif italic text-[#8a857c] uppercase tracking-[0.25em] text-sm md:text-xl mb-12">
          An Archetypal Tale
        </p>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-16">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => bus.emit('scroll:begin', { target: link.target })}
              className="toc-row font-serif italic text-[#c9a96e] text-sm md:text-base"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleBegin}
          className="primary-button font-serif italic text-[#c9a96e] tracking-wider"
        >
          Begin Reading
        </button>
      </div>

      {/* Note: Backdrop bg.png is managed by Layer 2 Cinema at z-10. 
          The TitleCover is at Layer 3 Canvas z-20. */}
    </section>
  );
}