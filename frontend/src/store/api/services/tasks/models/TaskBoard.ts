import type { Model, TaskCard, TaskList } from '.';

type TaskBoard = Model<{
  userId: string;
  title: string;
  description: string | null;
  listIds?: TaskList['id'][];
  cardIds?: TaskCard['id'][];
}>;

export default TaskBoard;
