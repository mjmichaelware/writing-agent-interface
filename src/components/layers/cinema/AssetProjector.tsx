"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";

interface AssetProjectorProps {
  currentSrc: string;
  scale: number;
  mixBlend: string;
}

export default function AssetProjector({ currentSrc, scale, mixBlend }: AssetProjectorProps) {
  const [activePlane, setActivePlane] = useState<"ALPHA" | "BETA">("ALPHA");
  const [srcPlaneAlpha, setSrcPlaneAlpha] = useState("/assets/bg.png");
  const [srcPlaneBeta, setSrcPlaneBeta] = useState("/assets/bg.png");
  const [opacityPlaneAlpha, setOpacityPlaneAlpha] = useState(1);
  const [opacityPlaneBeta, setOpacityPlaneBeta] = useState(0);

  const stateMachineRef = useRef<{
    isTransitioning: boolean;
    cachedAssets: Map<string, HTMLImageElement>;
    executionCount: number;
    lastActiveSrc: string;
  }>({
    isTransitioning: false,
    cachedAssets: new Map(),
    executionCount: 0,
    lastActiveSrc: "/assets/bg.png"
  });

  const mediaInventory = useMemo(() => [
    "/assets/bg.png",
    "/assets/flies.jpg",
    "/assets/megiddo1.jpg",
    "/assets/megiddo2.jpg"
  ], []);

  useEffect(() => {
    const machine = stateMachineRef.current;
    machine.executionCount++;

    if (currentSrc === machine.lastActiveSrc && machine.executionCount > 1) {
      return;
    }

    const executePlaneCrossfadeSequence = () => {
      if (activePlane === "ALPHA") {
        setSrcPlaneBeta(currentSrc);
        setOpacityPlaneAlpha(0);
        setOpacityPlaneBeta(1);
        setActivePlane("BETA");
      } else {
        setSrcPlaneAlpha(currentSrc);
        setOpacityPlaneAlpha(1);
        setOpacityPlaneBeta(0);
        setActivePlane("ALPHA");
      }
      machine.lastActiveSrc = currentSrc;
    };

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
          if (activePlane === "ALPHA") {
            setSrcPlaneBeta("/assets/bg.png");
          } else {
            setSrcPlaneAlpha("/assets/bg.png");
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
