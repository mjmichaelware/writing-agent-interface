"use client";

import { useEffect } from "react";
import { initAudioListener } from "@/runtime/listeners/audioListener";
import { initAudioPlaybackListener } from "@/runtime/listeners/audioPlaybackListener";
import { initDistortionListener } from "@/runtime/listeners/distortionListener";
import { initThematicListener } from "@/runtime/listeners/thematicListener";

export default function RuntimeInitializer() {
  useEffect(() => {
    console.log("NOS Runtime initializing...");
    
    const unsubs = [
      initAudioListener(),
      initAudioPlaybackListener(),
      initDistortionListener(),
      initThematicListener(),
    ];

    return () => {
      unsubs.forEach(unsub => {
        if (typeof unsub === 'function') unsub();
      });
    };
  }, []);

  return null;
}
