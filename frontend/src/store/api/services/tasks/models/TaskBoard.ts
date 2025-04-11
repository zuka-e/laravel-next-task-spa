import type { Model, TaskCard, TaskList } from '.';

export type TaskBoard = Model<{
  userId: string;
  title: string;
  description: string | null;
  listIds?: TaskList['id'][];
  cardIds?: TaskCard['id'][];
}>;
