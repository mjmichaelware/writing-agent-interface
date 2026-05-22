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
    { label: "About Author", target: "author" },
    { label: "Table of Contents", target: "toc" },
  ];

  return (
    <section id="title" className="relative h-screen w-full flex flex-col items-center justify-center text-center px-6">
      <div className="z-10 animate-fade-in">
        <h1 className="title-display text-[var(--accent-gold)] mb-4">
          The Weight of the Sky
        </h1>
        
        <p className="font-serif italic text-[var(--text-muted)] uppercase tracking-[0.25em] text-sm md:text-xl mb-12">
          An Archetypal Tale
        </p>

        <nav className="flex gap-8 mb-16">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => bus.emit('scroll:begin', { target: link.target })}
              className="font-serif italic text-[var(--accent-gold)] text-sm border-b border-transparent hover:border-[var(--accent-gold)] transition-all duration-300"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleBegin}
          className="font-serif italic text-[var(--accent-gold)] border border-[var(--accent-gold)]/40 px-10 py-4 hover:bg-[var(--accent-gold)] hover:text-[var(--bg-void)] transition-all duration-500 tracking-wider"
        >
          Begin Reading
        </button>
      </div>
    </section>
  );
}
