"use client";

import React from "react";
import ReaderLayout from "@/components/ReaderLayout";
import Layer1Void from "@/components/layers/Layer1Void";
import Layer2Cinema from "@/components/layers/Layer2Cinema";
import Layer3Canvas from "@/components/layers/Layer3Canvas";
import Layer4Panel from "@/components/layers/Layer4Panel";
import ManuscriptCore from "@/components/layers/canvas/ManuscriptCore";

export default function Page() {
  return (
    <ReaderLayout>
      <Layer1Void />
      <Layer2Cinema chapterSlug="1" />
      <Layer3Canvas>
        <ManuscriptCore blocks={[]} chapterSlug="1" />
      </Layer3Canvas>
      <Layer4Panel />
    </ReaderLayout>
  );
}
