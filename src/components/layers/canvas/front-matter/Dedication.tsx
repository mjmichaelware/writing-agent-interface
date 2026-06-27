"use client";

import React from "react";

export default function Dedication() {
  return (
    <section
      id="dedication"
      className="min-h-[55vh] flex flex-col items-center justify-center text-center px-6 scroll-mt-24"
    >
      <h2 className="section-label text-center mb-8">Dedicated to</h2>
      <p
        style={{
          fontFamily: "var(--font-prose)",
          fontStyle: "italic",
          fontSize: "1.6rem",
          lineHeight: 1.5,
          color: "var(--text-body)",
        }}
      >
        James Lee Ware
      </p>
      <p
        style={{
          fontFamily: "var(--font-prose)",
          fontStyle: "italic",
          fontSize: "1rem",
          color: "var(--text-muted)",
          marginTop: "0.5rem",
        }}
      >
        In order to keep Curious
      </p>
    </section>
  );
}
