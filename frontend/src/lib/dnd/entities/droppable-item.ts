import type { DndEntityType } from '@/lib/dnd/entities/type';
import { isPlainObject } from '@/utils/types';

/**
 * Droppable item type.
 */
export type DroppableItem<T extends DndEntityType = DndEntityType> = {
  isDroppable: true;
  type: T;
  id: string;
  index: number;
};

/**
 * Check if the value is a droppable item.
 */
export const isDroppableItem = <T extends DndEntityType>(
  value: unknown,
): value is DroppableItem<T> => {
  return isPlainObject(value) && value['isDroppable'] === true;
};
