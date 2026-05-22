"use client";

import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  isMobile: boolean;
  dpr: number;
  width: number;
  height: number;
  hasHardwareAcceleration: boolean;
}

export function useDeviceCapability(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    dpr: 1,
    width: 0,
    height: 0,
    hasHardwareAcceleration: true,
  });

  useEffect(() => {
    const update = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      setCapabilities({
        isMobile,
        dpr,
        width,
        height,
        hasHardwareAcceleration: true, // Assuming true for modern devices
      });

      // Update CSS custom properties (Feature 119)
      document.documentElement.style.setProperty('--measured-width', `${width}px`);
      document.documentElement.style.setProperty('--measured-height', `${height}px`);
      document.documentElement.style.setProperty('--measured-dpr', `${dpr}`);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return capabilities;
}