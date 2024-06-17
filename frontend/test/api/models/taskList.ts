import { CollectionBase, DocumentBase } from '@/models';

export type TaskListDocument = {
  userId: string;
  boardId: string;
  title: string;
  description: string;
  sequence: number;
} & DocumentBase;

export type TaskListsCollection = CollectionBase<TaskListDocument>;
