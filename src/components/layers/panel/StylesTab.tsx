"use client";

import React, { useEffect, useState } from "react";

export default function StylesTab() {
  const [settings, setSettings] = useState({
    fontScale: 1.0,
    lineHeight: 1.7,
    warmth: 40,
    contrast: 1.0,
    kineticIntensity: 1.0
  });

  useEffect(() => {
    const saved = localStorage.getItem("nos_reader_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        applySettings(parsed);
      } catch (e) {}
    }
  }, []);

  const applySettings = (s: typeof settings) => {
    const root = document.documentElement;
    root.style.setProperty("--font-size-prose", `calc(${s.fontScale} * clamp(1.125rem, 2.5vw, 1.5rem))`);
    root.style.setProperty("--reader-line-height", s.lineHeight.toString());
    root.style.setProperty("--reader-warmth", `${s.warmth}%`);
    root.style.setProperty("--reader-contrast", s.contrast.toString());
    root.style.setProperty("--kinetic-multiplier", s.kineticIntensity.toString());
  };

  const update = (key: keyof typeof settings, val: number) => {
    const next = { ...settings, [key]: val };
    setSettings(next);
    applySettings(next);
    localStorage.setItem("nos_reader_settings", JSON.stringify(next));
  };

  return (
    <div className="flex flex-col gap-10">
      <h2 className="font-serif italic text-[#8a857c] text-center mb-4">Reader Physics</h2>

      <div className="flex flex-col gap-8">
        {/* Font Scale */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-baseline">
            <span className="font-serif italic text-[#c9a96e] text-xs">Font Scale</span>
            <span className="font-serif italic text-[#8a857c] text-sm">{settings.fontScale}x</span>
          </div>
          <input 
            type="range" min="0.8" max="1.5" step="0.05"
            value={settings.fontScale}
            onChange={(e) => update("fontScale", parseFloat(e.target.value))}
            className="w-full accent-[#c9a96e]"
          />
        </div>

        {/* Line Height */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-baseline">
            <span className="font-serif italic text-[#c9a96e] text-xs">Line Height</span>
            <span className="font-serif italic text-[#8a857c] text-sm">{settings.lineHeight}</span>
          </div>
          <input 
            type="range" min="1.2" max="2.4" step="0.1"
            value={settings.lineHeight}
            onChange={(e) => update("lineHeight", parseFloat(e.target.value))}
            className="w-full accent-[#c9a96e]"
          />
        </div>

        {/* Page Warmth */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-baseline">
            <span className="font-serif italic text-[#c9a96e] text-xs">Page Warmth</span>
            <span className="font-serif italic text-[#8a857c] text-sm">{settings.warmth}%</span>
          </div>
          <input 
            type="range" min="0" max="100" step="1"
            value={settings.warmth}
            onChange={(e) => update("warmth", parseInt(e.target.value))}
            className="w-full accent-[#c9a96e]"
          />
        </div>

        {/* Kinetic Intensity */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-baseline">
            <span className="font-serif italic text-[#c9a96e] text-xs">Kinetic Intensity</span>
            <span className="font-serif italic text-[#8a857c] text-sm">{settings.kineticIntensity}x</span>
          </div>
          <input 
            type="range" min="0" max="2" step="0.1"
            value={settings.kineticIntensity}
            onChange={(e) => update("kineticIntensity", parseFloat(e.target.value))}
            className="w-full accent-[#c9a96e]"
          />
        </div>
      </div>

      <div className="mt-12 p-6 border border-[#c9a96e]/10 rounded-sm bg-[#c9a96e]/5">
        <p className="font-serif italic text-[#8a857c] text-sm leading-relaxed text-center">
          "The weight of the word should be felt in the hand of the reader."
        </p>
      </div>
    </div>
  );
}