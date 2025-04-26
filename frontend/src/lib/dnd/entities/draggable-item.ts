import type { DndItem } from '@/lib/dnd/entities/dnd-item';
import type { DndEntityType } from '@/lib/dnd/types';
import { isPlainObject } from '@/utils/types';

/**
 * Draggable item type.
 */
export type DraggableItem<T extends DndEntityType = DndEntityType> =
  DndItem<T> & {
    isDraggable: true;
  };

/**
 * Check if the value is a draggable item.
 */
export const isDraggableItem = <T extends DndEntityType>(
  value: unknown,
): value is DraggableItem<T> => {
  return isPlainObject(value) && value['isDraggable'] === true;
};
