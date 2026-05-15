import { useState, useEffect } from 'react';
import { measureViewportCapacity } from '@/utils/measureText';

/**
 * [cite_start]VIEWPORT INTELLIGENCE ENGINE: Real-time scaling[span_3](end_span)
 */
export function useViewport() {
  const [capacity, setCapacity] = useState(200);

  useEffect(() => {
    const calculate = () => {
      [span_4](start_span)// Adjusted for padding and container constraints [cite: 103-104]
      const cap = measureViewportCapacity(window.innerWidth - 64, window.innerHeight - 120);
      setCapacity(cap);
    };

    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);

  return capacity;
}
