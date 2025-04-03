import type { Model, TaskCard } from '.';

type TaskList = Model<{
  boardId: string;
  title: string;
  description: string | null;
  sequence: number;
  cardIds?: TaskCard['id'][];
}>;

export default TaskList;
