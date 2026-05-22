"use client";

import React, { useState } from "react";
import ReaderLayout from "@/components/ReaderLayout";
import Layer1Void from "@/components/layers/Layer1Void";
import Layer2Cinema from "@/components/layers/Layer2Cinema";
import Layer3Canvas from "@/components/layers/Layer3Canvas";
import Layer4Panel from "@/components/layers/Layer4Panel";
import TitleCover from "@/components/ui/front-matter/TitleCover";
import Dedication from "@/components/ui/front-matter/Dedication";
import Synopsis from "@/components/ui/front-matter/Synopsis";
import AboutAuthor from "@/components/ui/front-matter/AboutAuthor";
import TableOfContents from "@/components/ui/front-matter/TableOfContents";
import ManuscriptCore from "@/components/ManuscriptCore";
import { NarrativeProvider } from "@/context/NarrativeContext";

export default function Page() {
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  return (
    <NarrativeProvider>
      <ReaderLayout>
        <Layer1Void />

        {/* Background Layers */}
        <Layer2Cinema chapterSlug={activeChapterId || "7"} blocks={[]} />
        <Layer3Canvas chapterId={activeChapterId} />

        {/* Main Content Flow */}
        <div className="relative z-30 w-full">
          <TitleCover />

          <Dedication />

          <Synopsis />

          <AboutAuthor />

          <TableOfContents onSelect={setActiveChapterId} />

          {/* The manuscript is now rendered inside Layer3Canvas */}
        </div>
        <Layer4Panel />
      </ReaderLayout>
    </NarrativeProvider>
  );
}
