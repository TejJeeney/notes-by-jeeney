import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  once?: boolean;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    delay = 0,
    once = true
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
              if (once) {
                observer.unobserve(element);
              }
            }, delay);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, delay, once]);

  return { ref, isVisible };
}

export function useStaggeredReveal(count: number, baseDelay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger the reveal of items
            for (let i = 0; i < count; i++) {
              setTimeout(() => {
                setVisibleItems(prev => new Set([...prev, i]));
              }, i * baseDelay);
            }
            observer.unobserve(container);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(container);

    return () => {
      observer.unobserve(container);
    };
  }, [count, baseDelay]);

  return { containerRef, visibleItems };
}