import type { Model } from '.';

type TaskCard = Model<{
  listId: string;
  title: string;
  content: string | null;
  deadline: string | null;
  done: boolean;
  sequence: number;
}>;

export default TaskCard;
