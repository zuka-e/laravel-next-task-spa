import type { Model, TaskCard } from '.';

export type TaskList = Model<{
  boardId: string;
  title: string;
  description: string | null;
  sequence: number;
  cardIds?: TaskCard['id'][];
}>;
