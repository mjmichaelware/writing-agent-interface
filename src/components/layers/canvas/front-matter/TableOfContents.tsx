"use client";

import React from "react";

const ROMAN: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI",
  7: "VII", 8: "VIII", 9: "IX", 10: "X", 11: "XI", 13: "XIII", 24: "XXIV",
};

interface Props {
  TITLES: Record<number, string>;
  onLoadChapter: (n: number) => void;
}

function Row({ num, title, onClick }: { num: number; title: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="toc-row">
      <span className="toc-title">{title}</span>
      <span className="toc-numeral">{ROMAN[num]}</span>
    </button>
  );
}

function Pending({ numeral }: { numeral: string }) {
  return (
    <div className="toc-pending">
      <span className="toc-title">—</span>
      <span className="toc-numeral">{numeral}</span>
    </div>
  );
}

export default function TableOfContents({ TITLES, onLoadChapter }: Props) {
  return (
    <section id="toc" className="min-h-screen px-6 scroll-mt-24 pb-32">
      <h2 className="section-label text-center">Table of Contents</h2>

      <div className="reader-column">
        <h3 className="toc-part-heading">Part I — The Journey</h3>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <Row key={n} num={n} title={TITLES[n]} onClick={() => onLoadChapter(n)} />
        ))}

        <h3 className="toc-part-heading">Part II — The Deception &amp; Reveal</h3>
        <Row num={10} title={TITLES[10]} onClick={() => onLoadChapter(10)} />
        <Row num={11} title={TITLES[11]} onClick={() => onLoadChapter(11)} />
        <Pending numeral="XII" />
        <Row num={13} title={TITLES[13]} onClick={() => onLoadChapter(13)} />
        <Pending numeral="XIV–XVII" />

        <h3 className="toc-part-heading">Part III — The Cosmic Union</h3>
        <Pending numeral="XVIII–XXIII" />
        <Row num={24} title={TITLES[24]} onClick={() => onLoadChapter(24)} />

        <h3 className="toc-part-heading">Epilogue</h3>
        <Pending numeral="XXV" />
      </div>
    </section>
  );
}
