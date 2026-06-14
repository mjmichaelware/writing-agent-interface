"use client";

import React, { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";
import AssetProjector from "@/components/layers/cinema/AssetProjector";
import { resolveAssetByMeaning, resolveAssetByKeyword } from "@/data/cinema";

export default function Layer2Cinema({ chapterSlug = "0" }: { chapterSlug?: string }) {
  const [intensity, setIntensity] = useState(0.5);
  const [currentAsset, setCurrentAsset] = useState("/assets/boy-and-moon.png");
  const [overlayAsset, setOverlayAsset] = useState<string | null>(null);

  useEffect(() => {
    const unsubIntensity = bus.on('cinema:setIntensity', (val: number) => setIntensity(val));
    
    const unsubFocus = bus.on('scroll:focus', (data: any) => {
        const sectionId = data.sectionId;
        const currentChapter = data.chapterSlug || chapterSlug;
        const content = data.content || "";
        const hasWeights = data.weights && Object.keys(data.weights).length > 0;
        
        let asset;
        
        // Spec: Special handling for Front Matter to ensure "Moon Boy" is visible and bright
        if (sectionId === "title-page" || content === "title-page") {
            setIntensity(0.85); // Make it bright as requested
            setCurrentAsset("/assets/boy-and-moon.png");
            setOverlayAsset(null);
            return;
        }

        // Default intensity for prose
        setIntensity(0.4);

        if (hasWeights) {
            asset = resolveAssetByMeaning(
                data.weights,
                data.dualisms || {},
                data.partNumber || "I",
                content
            );
        } else {
            // Fallback to a generic background image if no semantic weights
            asset = "/assets/bg.png";
        }

        // Feature 3.6: Generative Cinema Fallback
        if (asset === "/assets/bg.png" && content.length > 200 && !overlayAsset) {
            // Only fetch if we have enough context
            const prompt = `Cinematic oil painting, deep Levantine shadows, 1003 BCE Hebron: ${content.substring(0, 100)}`;
            // (Assuming /api/visualize is wired up in later phase)
        }
        
        setCurrentAsset(asset);
    });

    return () => {
        unsubIntensity();
        unsubFocus();
    };
  }, [chapterSlug]);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden bg-black">
      {/* Primary Cinema Plane */}
      <div 
        className="absolute inset-0 transition-all duration-[2500ms] ease-out"
        style={{ 
          opacity: intensity,
          filter: intensity > 0.6 ? "brightness(1.2) contrast(1.1)" : "none"
        }}
      >
        <AssetProjector 
            currentSrc={currentAsset} 
            scale={1.1} 
            mixBlend="normal" 
        />
      </div>

      {/* Intelligent Overlay Plane */}
      {overlayAsset && (
        <div 
          className="absolute inset-0 transition-opacity duration-[3000ms] ease-in-out"
          style={{ 
            opacity: intensity * 0.8,
            }}
        >
          <AssetProjector 
              currentSrc={overlayAsset} 
              scale={1.2} 
              mixBlend="normal" 
          />
        </div>
      )}
      
      {/* Vignette & Depth Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />
    </div>
  );
}
