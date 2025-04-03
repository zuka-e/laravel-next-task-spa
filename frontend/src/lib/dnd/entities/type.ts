import type { ValueOf } from '@/types/utils';

/**
 * DnD entity type.
 */
export const DND_ENTITY_TYPE = {
  ITEM: 'item',
  COLUMN: 'column',
} as const;

/**
 * DnD entity type.
 */
export type DndEntityType = ValueOf<typeof DND_ENTITY_TYPE>;
