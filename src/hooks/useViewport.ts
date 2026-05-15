import { useState, useEffect } from 'react';
import { measureViewportCapacity } from '@/utils/measureText';

export function useViewport() {
  const [capacity, setCapacity] = useState(200);
  useEffect(() => {
    const calc = () => setCapacity(measureViewportCapacity(window.innerWidth - 64, window.innerHeight - 120));
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return capacity;
}
