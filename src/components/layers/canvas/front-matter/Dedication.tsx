"use client";

import React from "react";

export default function Dedication() {
  return (
    <section
      id="dedication"
      className="min-h-[55vh] flex flex-col items-center justify-center text-center px-6 scroll-mt-24"
    >
      <p
        style={{
          fontFamily: "var(--font-prose)",
          fontStyle: "italic",
          fontSize: "1.6rem",
          lineHeight: 1.5,
          color: "var(--text-body)",
          marginBottom: "1rem",
        }}
      >
        For James Lee Ware
      </p>
      <p
        style={{
          fontFamily: "var(--font-prose)",
          fontStyle: "italic",
          fontSize: "1.2rem",
          color: "var(--text-body)",
          opacity: 0.85,
        }}
      >
        (in order to keep Curious)
      </p>
    </section>
  );
}
