"use client";

import React from "react";

export default function AboutAuthor() {
  return (
    <section
      id="about"
      className="min-h-[55vh] flex flex-col justify-center px-6 scroll-mt-24"
    >
      <h2 className="section-label text-center mb-10">About the Author</h2>
      <div className="mx-auto w-full max-w-[min(65ch,90vw)]">
        <p className="manuscript-paragraph-segment">
          Michael Alonza Prentice Ware is composing <em>The Weight of the Sky</em>
          {" "}on a discipline of one chapter every two weeks. He is a student of
          Computer Science at Weber State University, where his research interest
          is machine learning alignment and explainable AI &mdash; the work of
          forcing a system to render its reasoning legible to the human auditing
          it.
        </p>
        <p className="manuscript-paragraph-segment">
          The same instinct shapes the book: a boy who can step into the
          dreamscape, and must still account for what he saw there. Outside of
          his studies, he plays classical piano and reads widely across
          philosophy and the Spanish and Russian classics.
        </p>
      </div>
    </section>
  );
}
