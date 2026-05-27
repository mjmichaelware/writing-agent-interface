/* ==================== FILE: src/components/layers/Layer2Cinema.tsx ==================== */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { bus } from "@/core/runtimeEngine";
import AssetProjector from "@/components/layers/cinema/AssetProjector";
import { resolveAssetByMeaning, resolveAssetByKeyword } from "@/data/cinema";

/**
 * SYSTEM LEVEL ORCHESTRATOR: LAYER 2 CINEMATIC BACKGROUND MANAGER
 * * Binds image projection channels, raw SVG fractal shaders, and telemetry logs
 * into a single unified deployment layout component layer.
 * * Decoupled Architecture Model Compliant. Handles cross-platform engines.
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
    const evaluateTargetMilestoneRouting = (): string => {
      if (depth < 0.03) return "cover_page";
      if (chapter === 1) return "ch1_stardust_horizon";

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

    const targetKey = evaluateTargetMilestoneRouting();
    if (targetKey !== activeFrameKey) {
      setActiveFrameKey(targetKey);
      setTotalBackdropSwaps(prev => prev + 1);
    }
    
    const microVelocityFactor = Math.min(2.0, 1.0 + (activePara * 0.05));
    setGovernorDamping(microVelocityFactor);
    setSystemActiveStatus("CORE_RUNSTATE_STEADY");
  }, [chapter, activePara, depth, activeFrameKey]);

  const activeConfig = SYSTEM_CINEMATIC_REGISTRY[activeFrameKey] || SYSTEM_CINEMATIC_REGISTRY["universal_fallback_void"];

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden bg-[var(--bg-void)]">
      <div
        ref={bgDivRef}
        className="absolute inset-0 transition-opacity duration-[2000ms] ease-out"
        style={{ opacity: intensity }}
      >
        <AssetProjector 
          currentSrc={activeConfig.src} 
          scale={activeConfig.scale * governorDamping} 
          mixBlend={activeConfig.mixBlend} 
        />

        {/* Module B: Raw SVG Turbulence Fractal Shader Overlays Component */}
        <ShaderEffects 
          grainOpacity={activeConfig.grainOpacity} 
          chromaticAberration={`${parseFloat(activeConfig.chromaticAberration) * governorDamping}px`} 
        />

        {/* Module C: High-Density HUD Code Data Metrics Readout Component */}
        {/* FIXED: Removed self-referencing Prop binding error from the wrapper execution */}
        <TelemetryOverlay 
          chapter={chapter}
          activePara={activePara}
          depth={depth}
          thematicTone={activeConfig.thematicTone}
          narrativeSector={activeConfig.narrativeSector}
        />

        {/* Top-level system telemetry status panel layer */}
        <div className="absolute top-8 left-8 flex flex-col space-y-0.5 hidden xl:flex">
          <p className="orchestrator-telemetry-tag">// NOS_L2_ORCHESTRATOR_LOG: {systemActiveStatus}</p>
          <p className="orchestrator-telemetry-tag">TOTAL_BACKGROUND_SWAPS: {totalBackdropSwaps} PACKETS</p>
          <p className="orchestrator-telemetry-tag">VELOCITY_DAMPING_FACTOR: {governorDamping.toFixed(4)}X</p>
          <p className="orchestrator-telemetry-tag">ACTIVE_REGISTRY_KEYNAME: {activeFrameKey}</p>
        </div>
      </div>
    </div>
  );
}


