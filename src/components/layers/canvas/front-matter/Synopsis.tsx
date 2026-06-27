"use client";

import React from "react";

export default function Synopsis() {
  return (
    <section
      id="synopsis"
      className="min-h-[70vh] flex flex-col justify-center px-6 scroll-mt-24"
    >
      <h2 className="section-label text-center mb-10">Synopsis</h2>
      <div className="reader-column">
        <p className="manuscript-paragraph-segment" style={{ textAlign: "center" }}>
          In <span className="font-hebrew">Hebron</span> in 1003 BCE, during the early days of King <span className="font-hebrew">David</span>'s rule over <span className="font-hebrew">Judah</span>, 
          sixteen-year-old <span className="font-hebrew">Dan</span> lives inside an oppressive home paralyzed by his father's hoarding grief. 
          <span className="font-hebrew">Dan</span> is a dreamwalker, a visionary uniquely capable of consciously stepping into a hidden world constructed from minute cells of universal dust. 
          When his deep interventions fracture his family, <span className="font-hebrew">Dan</span> is cast out, forced to embark on a punishing physical trek northward toward Mount <span className="font-hebrew">Hermon</span> 
          to find the ultimate source of reality. His path demands a brutal expenditure of tissue and will, shattering his physical voice and bringing him face-to-face with an infinite cycle of conflict written in the stars.
        </p>
      </div>
    </section>
  );
}
