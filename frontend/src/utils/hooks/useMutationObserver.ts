import { type RefObject, useEffect, useRef } from 'react';

/**
 * Execute the specified callback if `ref` is mutated.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
const useMutationObserver = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  onMutate: MutationCallback,
  options?: MutationObserverInit,
) => {
  // cf. `useResizeObserver` won't be fired by `scrollWidth` changes.
  // cf. https://usehooks-ts.com/react-hook/use-resize-observer

  const onMutateRef = useRef(onMutate);
  onMutateRef.current = onMutate;

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const mutationObserver = new MutationObserver((records, observer) => {
      onMutateRef.current(records, observer);
    });

    mutationObserver.observe(ref.current, {
      attributes: true,
      subtree: true,
      ...options,
    });

    return () => {
      mutationObserver.disconnect();
    };
  }, [options, ref]);
};

export default useMutationObserver;
