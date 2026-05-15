import { useState, useEffect } from 'react';
import { measureViewportCapacity } from '@/utils/measureText';

export function useViewport() {
  const [capacity, setCapacity] = useState(200);
  useEffect(() => {
    const calculate = () => {
      const cap = measureViewportCapacity(window.innerWidth - 64, window.innerHeight - 120);
      setCapacity(cap);
    };
    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);
  return capacity;
}
