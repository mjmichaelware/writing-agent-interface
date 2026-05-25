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
        }}
      >
        James Lee Ware (In order to keep Curious)
      </p>
    </section>
  );
}
