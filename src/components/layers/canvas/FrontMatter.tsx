"use client";

import React from "react";

interface FrontMatterProps {
  dedicationRef: React.RefObject<HTMLDivElement | null>;
  blurbRef: React.RefObject<HTMLDivElement | null>;
  authorRef: React.RefObject<HTMLDivElement | null>;
}

const TOC_DATA = [
  { title: "PART I: THE JOURNEY", isHeader: true },

  { title: "Stardust to Stardust", roman: "I", available: true },
  { title: "Living Sacrifice", roman: "II", available: true },
  { title: "Lift Up", roman: "III", available: true },
  { title: "Pilgrimage", roman: "IV", available: true },
  { title: "The Snare", roman: "V", available: true },
  { title: "Beelzebub, Beelzebub", roman: "VI", available: true },
  { title: "The Pit", roman: "VII", available: true },
  { title: "Sea People", roman: "VIII", available: true },
  { title: "The Ascent", roman: "IX", available: true },

  { title: "PART II: THE DECEPTION & REVEAL", isHeader: true },

  { title: "Forsaken", roman: "X", available: true },
  { title: "Forsaken (II)", roman: "XI", available: true },
  { title: "—", roman: "XII", available: false },
  { title: "Exodus", roman: "XIII", available: true },
  { title: "—", roman: "XIV", available: false },
  { title: "—", roman: "XV", available: false },
  { title: "—", roman: "XVI", available: false },
  { title: "—", roman: "XVII", available: false },

  { title: "PART III: THE COSMIC UNION", isHeader: true },

  { title: "—", roman: "XVIII", available: false },
  { title: "—", roman: "XIX", available: false },
  { title: "—", roman: "XX", available: false },
  { title: "—", roman: "XXI", available: false },
  { title: "—", roman: "XXII", available: false },
  { title: "—", roman: "XXIII", available: false },
  { title: "—", roman: "XXIV", available: false },

  { title: "EPILOGUE", isHeader: true },

  {
    title: "The Unresolved Question: Why",
    roman: "",
    available: false
  }
];

export default function FrontMatter({
  dedicationRef,
  blurbRef,
  authorRef
}: FrontMatterProps) {
  return (
    <div className="flex w-full flex-col items-center font-serif text-[var(--text-body)]">
      <section
        id="dedication"
        ref={dedicationRef}
        className="flex min-h-[60vh] w-full items-center justify-center"
      >
        <p className="text-xl italic tracking-wide text-[var(--text-body)]">
          James Lee Ware (In order to keep Curious)
        </p>
      </section>

      <section
        id="blurb"
        ref={blurbRef}
        className="flex min-h-[70vh] w-full flex-col items-center justify-center px-6 md:px-0"
      >
        <h3 className="section-label mb-12 text-sm text-[var(--text-muted)]">
          Synopsis
        </h3>

        <div className="max-w-2xl text-justify text-lg leading-[1.7]">
          <p className="mb-6">
            In Hebron in 1003 BCE, during the early days of King David's rule over Judah, sixteen-year-old Dan lives inside an oppressive home paralyzed by his father's hoarding grief. Dan is a dreamwalker, a visionary uniquely capable of consciously stepping into a hidden world constructed from minute cells of universal dust.
          </p>

          <p className="mb-6">
            When his deep interventions fracture his family, Dan is cast out, forced to embark on a punishing physical trek northward toward Mount Hermon to find the ultimate source of reality.
          </p>

          <p>
            His path demands a brutal expenditure of tissue and will, shattering his physical voice and bringing him face-to-face with an infinite cycle of conflict written in the stars.
          </p>
        </div>
      </section>

      <section
        id="about"
        ref={authorRef}
        className="flex min-h-[60vh] w-full flex-col items-center justify-center px-6 md:px-0"
      >
        <h3 className="section-label mb-12 text-sm text-[var(--text-muted)]">
          About the Author
        </h3>

        <div className="max-w-2xl text-justify text-lg leading-[1.7]">
          <p>
            Michael Alonza Prentice Ware is a systems architecture specialist. He is pursuing a Bachelor of Science in Computer Science at Weber State University, focusing his development research on Machine Learning Alignment Governance and Explainable AI (XAI). Outside of layout engineering, he practices classical piano for three hours daily following the Russian method and Alexander technique principles.
          </p>
        </div>
      </section>

      <section
        id="toc"
        className="flex min-h-screen w-full max-w-2xl flex-col items-center px-6 py-32 md:px-0"
      >
        <h3 className="section-label mb-16 text-sm text-[var(--text-muted)]">
          Table of Contents
        </h3>

        <div className="flex w-full flex-col gap-4">
          {TOC_DATA.map((node, i) => {
            if (node.isHeader) {
              return (
                <div
                  key={i}
                  className="mb-4 mt-12 w-full border-b border-[var(--text-muted)]/20 pb-2"
                >
                  <p className="text-center font-serif text-sm font-bold tracking-[0.15em] text-[var(--text-body)]">
                    {node.title}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={i}
                className={`group relative flex items-center justify-between py-2 transition-all duration-500 ${
                  node.available
                    ? "cursor-pointer"
                    : "cursor-default italic opacity-40"
                }`}
              >
                <span className="font-serif text-lg text-[var(--text-body)]">
                  {node.title}
                </span>

                <span className="text-sm tracking-widest text-[var(--text-muted)]">
                  {node.roman}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
