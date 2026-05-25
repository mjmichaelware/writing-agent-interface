import { useState, useEffect, RefObject } from 'react';

export function useScrollFocus(containerRef: RefObject<HTMLElement>) {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const children = Array.from(containerRef.current.children);
      const viewportCenter = window.innerHeight / 2;

      let closestId = null;
      let minDistance = Infinity;

      children.forEach((child) => {
        const rect = child.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestId = child.id;
        }
      });

      if (closestId !== focusedId) {
        setFocusedId(closestId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef, focusedId]);

  return focusedId;
}