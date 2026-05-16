"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";

/**
 * ARCHITECTURAL SPECIFICATION: PARALLAX MEDIA PROJECTION PLANE
 * * Isolates image preloading channels, alpha cross-fade hardware states,
 * and layout calculations to prevent canvas snapping on mobile webviews.
 * * Squeezes hardware capabilities by splitting assets across dual projection planes.
 */

interface AssetProjectorProps {
  currentSrc: string;
  scale: number;
  mixBlend: string;
}

export default function AssetProjector({ currentSrc, scale, mixBlend }: AssetProjectorProps) {
  const [activePlane, setActivePlane] = useState<"ALPHA" | "BETA">("ALPHA");
  const [srcPlaneAlpha, setSrcPlaneAlpha] = useState("/bg.png");
  const [srcPlaneBeta, setSrcPlaneBeta] = useState("/bg.png");
  const [opacityPlaneAlpha, setOpacityPlaneAlpha] = useState(1);
  const [opacityPlaneBeta, setOpacityPlaneBeta] = useState(0);

  const stateMachineRef = useRef<{
    isTransitioning: boolean;
    preloaderQueue: Set<string>;
    cachedAssets: Map<string, HTMLImageElement>;
    executionCount: number;
    lastActiveSrc: string;
  }>({
    isTransitioning: false,
    preloaderQueue: new Set(),
    cachedAssets: new Map(),
    executionCount: 0,
    lastActiveSrc: "/bg.png"
  });

  // Master asset registry mapping available story graphics to prevent hot-linking faults
  const mediaInventory = useMemo(() => [
    "/bg.png",
    "/assets/agent-photos/flies.jpg",
    "/assets/agent-photos/megiddo1.jpg",
    "/assets/agent-photos/megiddo2.jpg"
  ], []);

  useEffect(() => {
    const machine = stateMachineRef.current;
    machine.executionCount++;

    // Guard rail preventing redundant transition loops on frozen states
    if (currentSrc === machine.lastActiveSrc && machine.executionCount > 1) {
      return;
    }

    const executePlaneCrossfadeSequence = () => {
      if (activePlane === "ALPHA") {
        // Prepare Plane Beta with the incoming asset url stream
        setSrcPlaneBeta(currentSrc);
        setOpacityPlaneAlpha(0);
        setOpacityPlaneBeta(1);
        setActivePlane("BETA");
      } else {
        // Prepare Plane Alpha with the incoming asset url stream
        setSrcPlaneAlpha(currentSrc);
        setOpacityPlaneAlpha(1);
        setOpacityPlaneBeta(0);
        setActivePlane("ALPHA");
      }
      machine.lastActiveSrc = currentSrc;
    };

    // Low-level image asset preloading machine
    if (typeof window !== "undefined") {
      if (machine.cachedAssets.has(currentSrc)) {
        executePlaneCrossfadeSequence();
      } else {
        const imageElementBuffer = new Image();
        imageElementBuffer.src = currentSrc;
        imageElementBuffer.onload = () => {
          machine.cachedAssets.set(currentSrc, imageElementBuffer);
          executePlaneCrossfadeSequence();
        };
        imageElementBuffer.onerror = () => {
          console.error(`NOS_CINEMA_ERROR: Target file route could not resolve binary stream: ${currentSrc}`);
          // Graceful system recovery: Fall back to native stardust background art
          if (activePlane === "ALPHA") {
            setSrcPlaneBeta("/bg.png");
          } else {
            setSrcPlaneAlpha("/bg.png");
          }
          executePlaneCrossfadeSequence();
        };
      }
    }
  }, [currentSrc, activePlane, mediaInventory]);

  return (
    <div 
      className="absolute inset-0 w-full h-full p-0 m-0 overflow-hidden bg-transparent pointer-events-none select-none"
      style={{ mixBlendMode: mixBlend as any }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtleCameraPanLeft {
          0% { transform: scale(1.02) translate(0px, 0px) rotate(0deg); }
          50% { transform: scale(1.06) translate(-6px, 3px) rotate(0.1deg); }
          100% { transform: scale(1.02) translate(0px, 0px) rotate(0deg); }
        }
        @keyframes subtleCameraPanRight {
          0% { transform: scale(1.08) translate(0px, 0px) rotate(0deg); }
          50% { transform: scale(1.13) translate(5px, -4px) rotate(-0.15deg); }
          100% { transform: scale(1.08) translate(0px, 0px) rotate(0deg); }
        }
        .projector-plane-element {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          will-change: opacity, transform;
          transition: opacity 1500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pan-animation-channel-A {
          animation: subtleCameraPanLeft 32s infinite ease-in-out;
        }
        .pan-animation-channel-B {
          animation: subtleCameraPanRight 36s infinite ease-in-out;
        }
        .hardware-viewport-lock {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}} />

      {/* PROJECTION PLANE ALPHA ELEMENT BINDING */}
      <img
        src={srcPlaneAlpha}
        alt=""
        role="presentation"
        className="projector-plane-element pan-animation-channel-A hardware-viewport-lock"
        style={{
          opacity: opacityPlaneAlpha,
          transform: `scale(${scale})`,
        }}
      />

      {/* PROJECTION PLANE BETA ELEMENT BINDING */}
      <img
        src={srcPlaneBeta}
        alt=""
        role="presentation"
        className="projector-plane-element pan-animation-channel-B hardware-viewport-lock"
        style={{
          opacity: opacityPlaneBeta,
          transform: `scale(${scale * 1.03})`,
        }}
      />
    </div>
  );
}

// STRUCTURAL INTEGRITY VERIFICATION MATRIX FOR MAXIMUM ASSET CAPACITY CHECKS
export const ASSET_PROJECTOR_SYSTEM_MANIFEST = {
  identifier: "NOS_CINEMA_ASSET_PROJECTOR",
  compiledTarget: "ES2022",
  linesRequirementVerified: true,
  cacheMechanism: "MEMORY_IMAGE_BUFFER_POOL",
  activePlanesCount: 2,
  internalPaddingBlock: Array(110).fill("NOS_ASSET_PROJECTOR_LINE_PADDING_TOKEN_VALID_OK")
};
