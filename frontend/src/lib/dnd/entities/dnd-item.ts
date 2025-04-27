import type { DndEntityType } from '@/lib/dnd/types';
import type { Sort } from '@/utils/sort';

/**
 * Dnd item type.
 */
export type DndItem<T extends DndEntityType = DndEntityType> = {
  type: T;
  id: string;
  index: number;
  parentId?: string;
  sort?: Sort;
};
