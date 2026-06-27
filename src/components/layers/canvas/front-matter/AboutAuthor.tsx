"use client";

import React from "react";

export default function AboutAuthor() {
  return (
    <section
      id="about"
      className="min-h-[55vh] flex flex-col justify-center px-6 scroll-mt-24"
    >
      <h2 className="section-label text-center mb-10">About the Author</h2>
      <div className="reader-column">
        <p className="manuscript-paragraph-segment" style={{ textAlign: "center" }}>
          Michael Alonza Prentice Ware is a systems architecture specialist. He is pursuing a Bachelor of Science in Computer Science at Weber State University, focusing his development research on Machine Learning Alignment Governance and Explainable AI (XAI). Outside of layout engineering, he practices classical piano for three hours daily following the Russian method and Alexander technique principles.
        </p>
      </div>
    </section>
  );
}
