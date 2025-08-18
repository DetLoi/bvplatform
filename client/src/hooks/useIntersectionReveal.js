import { useCallback, useEffect, useRef } from 'react';

// Simple IntersectionObserver hook to add 'is-visible' to elements on scroll
export default function useIntersectionReveal({
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  once = true,
} = {}) {
  const observerRef = useRef(null);
  const elementsRef = useRef(new Set());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          const target = entry.target;
          if (entry.isIntersecting) {
            target.classList.add('is-visible');
            if (once) observer.unobserve(target);
          } else if (!once) {
            target.classList.remove('is-visible');
          }
        });
      },
      { root, rootMargin, threshold }
    );

    const currentObserver = observerRef.current;
    elementsRef.current.forEach((el) => currentObserver.observe(el));

    // Ensure elements already in the viewport are revealed immediately
    const revealIfInView = () => {
      elementsRef.current.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const isVerticallyInView = rect.top < viewportHeight && rect.bottom > 0;
        const isHorizontallyInView = rect.left < viewportWidth && rect.right > 0;
        if (isVerticallyInView && isHorizontallyInView) {
          el.classList.add('is-visible');
          if (once) currentObserver.unobserve(el);
        }
      });
    };

    // Run immediately and on next frame to catch layout shifts
    revealIfInView();
    const rafId = requestAnimationFrame(revealIfInView);

    return () => {
      cancelAnimationFrame(rafId);
      currentObserver.disconnect();
      elementsRef.current.clear();
    };
  }, [root, rootMargin, threshold, once]);

  const observe = useCallback((el) => {
    if (!el) return;
    elementsRef.current.add(el);
    // If observer already exists, observe immediately
    if (observerRef.current) {
      observerRef.current.observe(el);
    }
  }, []);

  return observe;
}


