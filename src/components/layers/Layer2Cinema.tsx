"use client";

import React, { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";
import AssetProjector from "@/components/layers/cinema/AssetProjector";
import { resolveAssetByMeaning, resolveAssetByKeyword } from "@/data/cinema";

/**
 * LAYER 2: CINEMA PLANE
 * * Manages the high-fidelity background projection system.
 * * Feature 200: Meaning-Driven Asset Swapping.
 */
export default function Layer2Cinema({ chapterSlug = "7" }: { chapterSlug?: string }) {
  const [intensity, setIntensity] = useState(0.4);
  const [currentAsset, setCurrentAsset] = useState("/assets/bg.png");
  const [overlayAsset, setOverlayAsset] = useState<string | null>(null);

  useEffect(() => {
    const unsubIntensity = bus.on('cinema:setIntensity', (val: number) => setIntensity(val));
    
    const unsubFocus = bus.on('scroll:focus', (data: any) => {
        const hasWeights = data.weights && Object.keys(data.weights).length > 0;
        const paraIndex = parseInt(data.paraIndex) || 0;
        const currentChapter = data.chapterSlug || chapterSlug;
        const content = data.content || "";
        
        let asset;
        if (hasWeights) {
            asset = resolveAssetByMeaning(
                data.weights, 
                data.dualisms || {}, 
                data.partNumber || "I",
                content
            );
        } else {
            asset = resolveAssetByKeyword(
                paraIndex,
                currentChapter
            );
        }

        // Feature: Intelligent Layering for Chapter 7
        if (currentChapter === "7") {
          const text = content.toLowerCase();
          if (text.includes("flies") || text.includes("swarm") || text.includes("buzzing")) {
            setOverlayAsset("/assets/flies.jpg");
          } else if (text.includes("megiddo") || text.includes("gate")) {
            setOverlayAsset("/assets/megiddo2.jpg");
            asset = "/assets/megiddo1.jpg"; // Background is the pit/fortress
          } else {
            setOverlayAsset(null);
          }
        } else {
          setOverlayAsset(null);
        }

        // Feature 3.6: Generative Cinema Logic
        if (asset === "/assets/bg.png" && content.length > 100 && !overlayAsset) {
            const prompt = `A cinematic oil painting in 19th-century romantic landscape style, deep Levantine shadows, 1003 BCE Hebron atmosphere: ${content.substring(0, 150)}...`;
            fetch(`/api/visualize?prompt=${encodeURIComponent(prompt)}`)
                .then(res => res.json())
                .then(json => {
                    if (json.imageUrl) {
                        setCurrentAsset(json.imageUrl);
                    }
                })
                .catch(err => console.error("Generative cinema failure:", err));
        } else {
            setCurrentAsset(asset);
        }
    });

    return () => {
        unsubIntensity();
        unsubFocus();
    };
  }, [chapterSlug, overlayAsset]);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden bg-[var(--bg-void)]">
      {/* Primary Cinema Plane */}
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

      {/* Secondary Intelligent Overlay Plane (e.g., Flies over Megiddo) */}
      {overlayAsset && (
        <div 
          className="absolute inset-0 transition-opacity duration-[3000ms] ease-in-out"
          style={{ 
            opacity: intensity * 0.7,
            mixBlendMode: "multiply"
          }}
        >
          <AssetProjector 
              currentSrc={overlayAsset} 
              scale={1.25} 
              mixBlend="screen" 
          />
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none" />
    </div>
  );
}
