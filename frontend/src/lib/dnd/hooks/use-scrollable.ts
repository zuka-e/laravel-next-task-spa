import { useEffect, type RefObject } from 'react';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

/**
 * Improve the scroll experience during a drag.
 *
 * @see https://atlassian.design/components/pragmatic-drag-and-drop/optional-packages/auto-scroll/about
 */
const useScrollable = (args: {
  scrollableRef: RefObject<HTMLElement | null>;
  speed?: 'fast' | 'standard';
}) => {
  const { scrollableRef, speed = 'standard' } = args;

  useEffect(() => {
    if (!scrollableRef.current) {
      return;
    }

    return autoScrollForElements({
      element: scrollableRef?.current,
      getConfiguration: () => ({ maxScrollSpeed: speed }),
    });
  }, [scrollableRef, speed]);
};

export default useScrollable;
