import { useState, useRef, useEffect } from 'react';

export const useVirtualScroll = <T>(items: T[], itemHeight: number, containerHeight: number) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 5);
  const endIndex = Math.min(items.length, startIndex + Math.ceil(containerHeight / itemHeight) + 10);
  const visibleItems = items.slice(startIndex, endIndex);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => setScrollTop(container.scrollTop);
    container.addEventListener('scroll', onScroll);

    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  return { visibleItems, containerRef, totalHeight, offsetY };
};
