"use client";

import React, { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";
import AssetProjector from "@/components/layers/cinema/AssetProjector";
import { resolveAssetByMeaning } from "@/data/cinema";

/**
 * LAYER 2: CINEMA PLANE
 * * Manages the high-fidelity background projection system.
 * * Feature 200: Meaning-Driven Asset Swapping.
 */
export default function Layer2Cinema() {
  const [intensity, setIntensity] = useState(0.4);
  const [currentAsset, setCurrentAsset] = useState("/assets/bg.png");

  useEffect(() => {
    const unsubIntensity = bus.on('cinema:setIntensity', (val: number) => setIntensity(val));
    
    const unsubFocus = bus.on('scroll:focus', (data: any) => {
        // Feature 200: Resolve by Semantic Meaning
        // Data contains weights, dualisms, and partNumber from Supabase/Vertex AI
        const asset = resolveAssetByMeaning(
            data.weights || {}, 
            data.dualisms || {}, 
            data.partNumber || "I"
        );
        setCurrentAsset(asset);
    });

    return () => {
        unsubIntensity();
        unsubFocus();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden bg-[var(--bg-void)]">
      <div 
        className="absolute inset-0 transition-opacity duration-[2000ms] ease-out"
        style={{ opacity: intensity }}
      >
        <AssetProjector 
            currentSrc={currentAsset} 
            scale={1.12} 
            mixBlend="normal" 
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none" />
    </div>
  );
}
