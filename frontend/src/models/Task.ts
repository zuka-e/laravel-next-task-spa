import type { DocumentBase } from '@/models';

export type TaskBoard = {
  userId: string;
  title: string;
  description: string | null;
} & DocumentBase;

export type TaskList = {
  boardId: string;
  title: string;
  description: string | null;
  sequence: number;
} & DocumentBase;

export type TaskCard = {
  listId: string;
  title: string;
  content: string | null;
  deadline: string | null;
  done: boolean;
  sequence: number;
} & DocumentBase;
