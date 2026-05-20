"use client";

import React from "react";
import Image from "next/image";
import { resolveAsset } from "@/data/cinema";

export default function Layer2Cinema({ chapterSlug }: { chapterSlug: string }) {
  const asset = resolveAsset("", chapterSlug);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden bg-[var(--bg-void)]">
      <Image
        src={asset}
        alt="Cinematic Backdrop"
        fill
        className="object-cover w-full h-full opacity-70"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/75" />
    </div>
  );
}
