import type { DndEntityType } from '@/lib/dnd/entities/type';
import { isPlainObject } from '@/utils/types';

/**
 * Draggable item type.
 */
export type DraggableItem<T extends DndEntityType = DndEntityType> = {
  isDraggable: true;
  type: T;
  id: string;
  index: number;
  parentId?: string;
};

/**
 * Check if the value is a draggable item.
 */
export const isDraggableItem = <T extends DndEntityType>(
  value: unknown,
): value is DraggableItem<T> => {
  return isPlainObject(value) && value['isDraggable'] === true;
};
