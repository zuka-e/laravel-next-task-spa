import type { Model } from '.';

type TaskBoard = Model<{
  userId: string;
  title: string;
  description: string | null;
}>;

export default TaskBoard;
