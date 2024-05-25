import type { TaskCard } from '@/models';

export const draggableItem = {
  card: 'card',
};

/** @see https://react-dnd.github.io/react-dnd/docs/api/use-drag#specification-object-members */
export type DragItem = TaskCard & {
  index: number;
  listIndex: number;
};
