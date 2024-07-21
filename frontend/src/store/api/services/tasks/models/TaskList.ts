import type { Model } from '.';

type TaskList = Model<{
  boardId: string;
  title: string;
  description: string | null;
  sequence: number;
}>;

export default TaskList;
