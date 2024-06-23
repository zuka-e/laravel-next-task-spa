import type { CollectionBase, DocumentBase } from '@/models';

export type TaskBoard = {
  userId: string;
  title: string;
  description: string;
} & DocumentBase;

export type TaskBoardsCollection = CollectionBase<TaskBoard>;

export type TaskList = {
  boardId: string;
  title: string;
  description: string;
  sequence: number;
} & DocumentBase;

export type TaskListsCollection = CollectionBase<TaskList>;

export type TaskCard = {
  listId: string;
  title: string;
  content: string;
  deadline: string;
  done: boolean;
  sequence: number;
} & DocumentBase;
