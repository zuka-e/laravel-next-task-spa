import type { DndEntityType } from '@/lib/dnd/types';

/**
 * Dnd item type.
 */
export type DndItem<T extends DndEntityType = DndEntityType> = {
  type: T;
  id: string;
  index: number;
  parentId?: string;
};
