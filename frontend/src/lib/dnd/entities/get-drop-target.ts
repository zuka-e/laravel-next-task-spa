import type { DropTargetRecord } from '@atlaskit/pragmatic-drag-and-drop/types';

import { type DroppableItem, isDroppableItem } from '@/lib/dnd/entities';

/**
 * Get the drop target by type.
 */
const getDropTarget = <T extends DroppableItem['type']>(
  dropTargets: DropTargetRecord[],
  type: T,
): (DropTargetRecord & { data: DroppableItem<T> }) | undefined => {
  const target = dropTargets.find((target) => target.data.type === type);

  if (!target) return undefined;

  if (isDroppableItem<T>(target.data)) {
    return { ...target, data: target.data };
  }

  throw new Error('Invalid drop target is given.');
};

export default getDropTarget;
