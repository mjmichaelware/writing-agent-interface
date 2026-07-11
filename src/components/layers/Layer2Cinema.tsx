"use client";

import React, { useEffect, useRef, useState } from "react";
import { bus } from "@/core/runtimeEngine";
import AssetProjector from "@/components/layers/cinema/AssetProjector";
import { resolveAssetByMeaning, resolveAssetByKeyword } from "@/data/cinema";

// Extract Drive file ID from any Drive URL format
function extractDriveId(url: string): string | null {
  const m = url.match(/(?:\/d\/|id=|open\?id=)([a-zA-Z0-9_-]{10,})/);
  return m ? m[1] : null;
}

function driveProxyUrl(raw: string): string {
  if (!raw) return raw;
  // Already a proxy or local asset — pass through
  if (raw.startsWith("/") || raw.startsWith("/api/")) return raw;
  // Google Drive URL → proxy
  const id = extractDriveId(raw);
  if (id) return `/api/assets/drive-proxy?id=${id}`;
  // Any other URL — use as-is (https://...)
  return raw;
}

export default function Layer2Cinema({ chapterSlug = "7" }: { chapterSlug?: string }) {
  const [intensity, setIntensity] = useState(0.88);
  const [currentAsset, setCurrentAsset] = useState("/assets/bg.png");
  // Per-chapter bg overrides: { chapterNumber: resolvedUrl }
  const chapterBgRef = useRef<Record<number, string>>({});
  const gyroX = useRef(0);
  const gyroY = useRef(0);
  const bgDivRef = useRef<HTMLDivElement>(null);

  // Load chapter bg assignments on mount
  useEffect(() => {
    fetch("/api/assets/chapter-bg")
      .then(r => r.json())
      .then(d => {
        const map: Record<number, string> = {};
        for (const [ch, url] of Object.entries(d.assignments || {})) {
          map[Number(ch)] = driveProxyUrl(url as string);
        }
        chapterBgRef.current = map;
        // Apply immediately if we already know the chapter
        const ch = parseInt(chapterSlug, 10);
        if (map[ch]) setCurrentAsset(map[ch]);
      })
      .catch(() => {});
  }, []);

  // Listen for live asset updates from the Author Gateway
  useEffect(() => {
    const unsub = bus.on("cinema:set-bg", (d: any) => {
      const url = driveProxyUrl(d.url || "");
      const ch = Number(d.chapterNumber);
      if (url) {
        chapterBgRef.current[ch] = url;
        if (parseInt(chapterSlug, 10) === ch) setCurrentAsset(url);
      }
    });
    return unsub;
  }, [chapterSlug]);

  // Gyroscope parallax
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
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        try {
          const perm = await (DeviceOrientationEvent as any).requestPermission();
          if (perm === "granted") window.addEventListener("deviceorientation", handleOrientation);
        } catch { /* iOS denied */ }
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    };
    requestGyro();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  useEffect(() => {
    const unsub = bus.on("scroll:focus", (data: any) => {
      const sectionId = data.sectionId;
      const content = data.content || "";
      const currentChapter = parseInt(data.chapterSlug || chapterSlug, 10);
      const hasWeights = data.weights && Object.keys(data.weights).length > 0;

      if (sectionId === "title-page" || content === "title-page") {
        setIntensity(0.85);
        // Use chapter override if set, otherwise default bg
        setCurrentAsset(chapterBgRef.current[0] || "/assets/bg.png");
        return;
      }

      setIntensity(0.4);

      // Chapter-level override takes priority over resolver
      if (chapterBgRef.current[currentChapter]) {
        setCurrentAsset(chapterBgRef.current[currentChapter]);
        return;
      }

      let asset: string;
      if (hasWeights) {
        asset = resolveAssetByMeaning(
          data.weights,
          data.dualisms || {},
          data.partNumber || "I",
          content
        );
      } else {
        asset = resolveAssetByKeyword(
          parseInt(data.paraIndex) || 0,
          String(currentChapter)
        );
      }

      setCurrentAsset(asset);
    });

    return () => { unsub(); };
  }, [chapterSlug]);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden bg-[var(--bg-void)]">
      <div
        ref={bgDivRef}
        className="absolute inset-0 transition-opacity duration-[2000ms] ease-out"
        style={{ opacity: intensity }}
      >
        <AssetProjector currentSrc={currentAsset} scale={1.1} mixBlend="normal" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />
    </div>
  );
}
