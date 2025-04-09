import { useEffect, useRef, useState, type Ref } from 'react';

/**
 * Execute the specified callback if the returned `ref` appears on viewport.
 *
 * @param onIntersect - Callback function to be executed on intersecting.
 * @returns `ref` for the element to observe.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
const useIntersectionObserver = <T extends HTMLElement>(
  onIntersect: (entry: IntersectionObserverEntry) => void,
): Ref<T | null> => {
  // cf. https://usehooks-ts.com/react-hook/use-intersection-observer
  // cf. https://github.com/thebuilder/react-intersection-observer

  const [ref, setRef] = useState<T | null>(null);
  // Prevent rerendering by being added to `useEffect` dependencies.
  const onIntersectRef = useRef(onIntersect);
  // Reflect the updated value (when rerendered).
  onIntersectRef.current = onIntersect;

  useEffect(() => {
    if (!ref) {
      return;
    }

    // `entries` will have only one element as long as `setRef` is used for `ref` attr,
    // as there is just one observed `ref` object.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onIntersectRef.current(entry);
      }
    });

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return setRef;
};

export default useIntersectionObserver;
