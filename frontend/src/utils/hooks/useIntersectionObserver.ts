import { type MutableRefObject, useEffect, useRef } from 'react';

/**
 * Execute the specified callback if the returned `ref` appears on viewport.
 *
 * @param onIntersect - Callback function to be executed on intersecting.
 * @returns Mutable ref object that can be assigned to the target element.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
const useIntersectionObserver = <T extends HTMLElement>(
  onIntersect: (entry: IntersectionObserverEntry) => void
): MutableRefObject<T | null> => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onIntersect(entry);
        }
      });
    });

    observer.observe(ref.current);

    return function cleanup() {
      observer.disconnect();
    };
  }, [onIntersect]);

  return ref;
};

export default useIntersectionObserver;
