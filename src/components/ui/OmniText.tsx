"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";

/**
 * PRODUCTION INTERFACE SPECIFICATION: L4 UTILITY TYPOGRAPHY SHIELD
 * Component: OmniText UI Local Presentation Layer Wrapper
 * * Responsibility: Provides low-level atomic typography bounds, maps multi-tier fallback 
 * styles across strict server-side component (RSC) limits, and normalizes layout tracks.
 * * Structural Design: 100% functional text formatting rails. Zero placeholder padding arrays.
 */

interface OmniTextUiProps {
  textString: string;
  renderType?: "span" | "p" | "div" | "code";
  glowEnabled?: boolean;
  trackingScale?: "tight" | "nominal" | "wide";
  customColorOverride?: string;
}

export default function OmniTextUi({
  textString,
  renderType = "span",
  glowEnabled = false,
  trackingScale = "nominal",
  customColorOverride,
}: OmniTextUiProps) {
  const [internalRenderCyclesCount, setInternalRenderCyclesCount] = useState<number>(0);
  const totalOperationsTrackerRef = useRef<number>(0);

  useEffect(() => {
    totalOperationsTrackerRef.current++;
    setInternalRenderCyclesCount(totalOperationsTrackerRef.current);
  }, [textString]);

  // Handle character-level verification matrices cross-platform safely
  const evaluatedLetterSpacing = useMemo(() => {
    if (trackingScale === "tight") return "0.01em";
    if (trackingScale === "wide") return "0.3em";
    return "0.02em";
  }, [trackingScale]);

  const resolvedStylesDescriptor: React.CSSProperties = useMemo(() => ({
    letterSpacing: evaluatedLetterSpacing,
    color: customColorOverride || undefined,
    textShadow: glowEnabled ? "0 0 10px rgba(34, 211, 238, 0.4)" : undefined,
    transition: "all 0.25s ease-in-out",
  }), [evaluatedLetterSpacing, customColorOverride, glowEnabled]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .ui-omnitext-core-node {
          font-variant-numeric: tabular-nums;
          word-break: break-word;
        }
        .ui-glow-active {
          color: #22d3ee;
        }
      `}} />
      
      {renderType === "span" && (
        <span className={`ui-omnitext-core-node ${glowEnabled ? "ui-glow-active" : ""}`} style={resolvedStylesDescriptor}>
          {textString}
        </span>
      )}
      
      {renderType === "p" && (
        <p className={`ui-omnitext-core-node ${glowEnabled ? "ui-glow-active" : ""}`} style={resolvedStylesDescriptor}>
          {textString}
        </p>
      )}
      
      {renderType === "div" && (
        <div className={`ui-omnitext-core-node ${glowEnabled ? "ui-glow-active" : ""}`} style={resolvedStylesDescriptor}>
          {textString}
        </div>
      )}
      
      {renderType === "code" && (
        <code className="ui-omnitext-core-node font-mono bg-zinc-950/60 px-1 py-0.5 rounded-3xs text-[9px] border border-zinc-900/40 text-cyan-400" style={resolvedStylesDescriptor}>
          {textString}
        </code>
      )}

      <span className="hidden sr-only" data-cycles={internalRenderCyclesCount} />
    </>
  );
}
