import { type RefObject, useRef } from 'react';
import useMutationObserver from './useMutationObserver';

type ScrollState = {
  width: number;
  height: number;
  top: number;
};

type UseScrollPositionOption = {
  /** Determine if it should be run. */
  on?: boolean;
  /** Size that determines how much length is considered a difference. */
  threshold?: number;
};

/**
 * When `ref` scroll size is increased, move the scroll position by its difference.
 */
const useScrollPosition = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseScrollPositionOption
) => {
  const { on, threshold = 0 } = options;

  const prevState = useRef<Partial<ScrollState>>({
    width: undefined,
    height: undefined,
    top: undefined,
  });

  useMutationObserver(ref, () => {
    if (!ref.current || !on) {
      return;
    }

    const widthDiff = prevState.current.width
      ? ref.current.scrollWidth - prevState.current.width
      : 0;

    const heightDiff = prevState.current.height
      ? ref.current.scrollHeight - prevState.current.height
      : 0;

    if (widthDiff > threshold) {
      ref.current.scrollLeft = (prevState.current.top ?? 0) + widthDiff;
    }

    if (heightDiff > threshold) {
      ref.current.scrollTop = (prevState.current.top ?? 0) + heightDiff;
    }

    prevState.current = {
      width: ref.current.scrollWidth,
      height: ref.current.scrollHeight,
      top: ref.current.scrollTop,
    };
  });
};

export default useScrollPosition;
