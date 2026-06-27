"use client";

import React, { useEffect, useRef, useState } from "react";
import { bus } from "@/core/runtimeEngine";
import AssetProjector from "@/components/layers/cinema/AssetProjector";
import { resolveAssetByMeaning, resolveAssetByKeyword } from "@/data/cinema";

/**
 * LAYER 2: CINEMA PLANE
 * * Manages the high-fidelity background projection system.
 * * Feature 200: Meaning-Driven Asset Swapping.
 */
export default function Layer2Cinema() {
  const [intensity, setIntensity] = useState(0.4);
  const [currentAsset, setCurrentAsset] = useState("/assets/bg.png");
  const gyroX = useRef(0);
  const gyroY = useRef(0);
  const bgDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      gyroX.current = Math.max(-10, Math.min(10, (e.gamma ?? 0) * 0.3));
      gyroY.current = Math.max(-10, Math.min(10, (e.beta ?? 0) * 0.15));
    };

    const tick = () => {
      if (bgDivRef.current) {
        bgDivRef.current.style.transform =
          `translate(${gyroX.current}px, ${gyroY.current}px) scale(1.05)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const requestGyro = async () => {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      ) {
        try {
          const perm = await (DeviceOrientationEvent as any).requestPermission();
          if (perm === 'granted') window.addEventListener('deviceorientation', handleOrientation);
        } catch { /* iOS denied — no parallax, no crash */ }
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };
    requestGyro();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  useEffect(() => {
    const unsubIntensity = bus.on('cinema:setIntensity', (val: number) => setIntensity(val));
    
    const unsubFocus = bus.on('scroll:focus', (data: any) => {
        const hasWeights = data.weights && Object.keys(data.weights).length > 0;
        const paraIndex = parseInt(data.paraIndex) || 0;
        const chapterSlug = data.chapterSlug || "7";
        const content = data.content || "";
        
        let asset;
        if (hasWeights) {
            asset = resolveAssetByMeaning(
                data.weights, 
                data.dualisms || {}, 
                data.partNumber || "I"
            );
        } else {
            asset = resolveAssetByKeyword(
                paraIndex,
                chapterSlug
            );
        }

        // Feature 3.6: Generative Cinema Logic
        // If we are on the default asset and have enough content, trigger a generative run
        if (asset === "/assets/bg.png" && content.length > 100) {
            const prompt = `A cinematic oil painting in 19th-century romantic landscape style, deep Levantine shadows, 1003 BCE Hebron atmosphere: ${content.substring(0, 150)}...`;
            fetch(`/api/visualize?prompt=${encodeURIComponent(prompt)}&hash=${encodeURIComponent(data.paraIndex || '0')}`)
                .then(res => res.json())
                .then(json => {
                    if (json.url && !json.error) {
                        setCurrentAsset(json.url);
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
  }, []);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden bg-[var(--bg-void)]">
      <div
        ref={bgDivRef}
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
