import type { DND_ENTITY_TYPE } from '@/lib/dnd/config';
import type { ValueOf } from '@/types/utils';

/**
 * DnD entity type
 */
export type DndEntityType = ValueOf<typeof DND_ENTITY_TYPE>;

/**
 * Draggable axis
 */
export type Axis = 'vertical' | 'horizontal';
