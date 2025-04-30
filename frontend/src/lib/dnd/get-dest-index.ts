import { type Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

/**
 * Get the index of the destination to be dropped.
 *
 * @see https://atlassian.design/components/pragmatic-drag-and-drop/optional-packages/hitbox/about#getreorderdestinationindex
 */
const getDestIndex = (arg: {
  /** Drag item index within destination category (`null` unless belonging to the destination) */
  srcIndex: number | null;
  /** Dropped item index (`null` if dropped onto "droppable" rather than "draggable") */
  targetIndex: number | null;
  /** Which corner of the droppable item is being dragged over (`null` unless attached) */
  closestEdge: Edge | null;
  axis: 'vertical' | 'horizontal';
}): number => {
  const { srcIndex, targetIndex, closestEdge, axis } = arg;

  /**
   * @see https://atlassian.design/components/pragmatic-drag-and-drop/examples#board
   *
   * // For ordering in the same column
   * const destinationIndex = getReorderDestinationIndex({
   *   startIndex: itemIndex,
   *   indexOfTarget,
   *   closestEdgeOfTarget,
   *   axis: 'vertical',
   * });
   *
   * // For moving into a new column relative to a card
   * const destinationIndex =
   *   closestEdgeOfTarget === 'bottom' ? indexOfTarget + 1 : indexOfTarget;
   */

  // whether "src" is to be placed after "dest"
  const isGoingAfter =
    (axis === 'vertical' && closestEdge === 'bottom') ||
    (axis === 'horizontal' && closestEdge === 'right');

  if (targetIndex === null) {
    return isGoingAfter ? -1 : 0;
  }

  if (srcIndex === targetIndex) {
    return targetIndex;
  }

  const isMovingForward = srcIndex === null ? false : srcIndex < targetIndex;

  if (isMovingForward) {
    return isGoingAfter ? targetIndex : targetIndex - 1;
  }

  return isGoingAfter ? targetIndex + 1 : targetIndex;
};

export default getDestIndex;
