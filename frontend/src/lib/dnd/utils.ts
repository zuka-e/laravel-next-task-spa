import { type Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

import type { Axis } from '@/lib/dnd/types';

/**
 * Get the corners allowed by the axis.
 */
export const getAllowedEdgesByAxis = (axis: Axis): Edge[] => {
  switch (axis) {
    case 'horizontal':
      return ['left', 'right'];
    case 'vertical':
      return ['top', 'bottom'];
  }
};
