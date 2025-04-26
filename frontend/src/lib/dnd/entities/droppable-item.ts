import type { DndItem } from '@/lib/dnd/entities/dnd-item';
import type { DndEntityType } from '@/lib/dnd/types';
import { isPlainObject } from '@/utils/types';

/**
 * Droppable item type.
 */
export type DroppableItem<T extends DndEntityType = DndEntityType> =
  DndItem<T> & {
    isDroppable: true;
  };

/**
 * Check if the value is a droppable item.
 */
export const isDroppableItem = <T extends DndEntityType>(
  value: unknown,
): value is DroppableItem<T> => {
  return isPlainObject(value) && value['isDroppable'] === true;
};
