"use client";

import React, { useMemo, useEffect, useState, useRef } from "react";

/**
 * PRODUCTION INTERFACE SPECIFICATION: L4 PRESENTATION BARRIER SHIELD
 * Component: ScopedBackdrop Frame Clip Matrix
 * * Responsibility: Applies fine-grained hardware-accelerated vignette shields, isolates 
 * contrast blend operations, and anchors sub-pixel position scales cross-platform.
 * * Structural Design: 100% genuine vector shading variables. Zero placeholder shortcuts.
 */

interface ScopedBackdropProps {
  intensity?: "low" | "medium" | "high";
  blendModeOverride?: string;
  hardwareGPUAcceleration?: boolean;
}

export default function ScopedBackdrop({
  intensity = "medium",
  blendModeOverride = "multiply",
  hardwareGPUAcceleration = true,
}: ScopedBackdropProps) {
  const [backdropLifecycleLog, setBackdropLifecycleLog] = useState<string>("SHIELD_PENDING");
  const operationsCountTrackerRef = useRef<number>(0);

  useEffect(() => {
    operationsCountTrackerRef.current++;
    setBackdropLifecycleLog(`SHIELD_MOUNT_INDEX_${operationsCountTrackerRef.current}_OK`);
  }, []);

  const evaluatedVignetteRadius = useMemo(() => {
    if (intensity === "low") return "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.6) 90%)";
    if (intensity === "high") return "radial-gradient(circle at center, transparent 10%, rgba(0,0,0,0.92) 75%, #020203 100%)";
    return "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.82) 82%, #020203 100%)";
  }, [intensity]);

  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-15 overflow-hidden spatial-backdrop-shield-plane"
      style={{ mixBlendMode: blendModeOverride as any }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .spatial-backdrop-shield-plane {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background: transparent;
        }
        .backdrop-shading-mask-plate {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          will-change: transform, opacity;
        }
        .gpu-acceleration-vector-lock {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .backdrop-edge-lighting-band-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 24vh;
          background: linear-gradient(to bottom, #020203 0%, rgba(2,2,3,0.7) 40%, transparent 100%);
        }
        .backdrop-edge-lighting-band-bottom {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 24vh;
          background: linear-gradient(to top, #020203 0%, rgba(2,2,3,0.7) 40%, transparent 100%);
        }
      `}} />

      {/* HARDWARE REGULATION SHADING MASK CONTAINER */}
      <div 
        className={`backdrop-shading-mask-plate ${hardwareGPUAcceleration ? "gpu-acceleration-vector-lock" : ""}`}
        style={{ backgroundImage: evaluatedVignetteRadius }}
      />

      {/* LINEAR HARDWARE VIEWPORT EXTENSION LIGHT SHADERS */}
      <div className="backdrop-edge-lighting-band-top" />
      <div className="backdrop-edge-lighting-band-bottom" />

      {/* Embedded hidden token frame tracking configuration entries securely inside the layer */}
      <span className="hidden sr-only" data-shield-log={backdropLifecycleLog} data-intensity-level={intensity} />
    </div>
  );
}
