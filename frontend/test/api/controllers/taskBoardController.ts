import { type DefaultBodyType, type StrictRequest } from 'msw';

import type { TaskBoard } from '@/models';
import { db } from '@test/api/database';
import { paginate } from '@test/utils/paginate';
import { getUser } from '../auth';

export const index = (request: StrictRequest<DefaultBodyType>) => {
  const userId = getUser()?.id;
  const boards = db.where('taskBoards', 'userId', userId) as TaskBoard[];
  const response = paginate({ request, allData: boards });

  return response;
};

export const store = (params: Partial<Omit<TaskBoard, 'id' | 'userId'>>) => {
  const taskBoard = db.create('taskBoards', {
    userId: getUser()!.id,
    ...params,
  }) as TaskBoard;

  return taskBoard;
};

export const show = (id: TaskBoard['id']) => {
  const board = db.where('taskBoards', 'id', id)[0] as TaskBoard;

  if (!board) return;

  return board as TaskBoard;
};

export const update = (
  id: TaskBoard['id'],
  params: Partial<Omit<TaskBoard, 'id' | 'userId'>>
) => {
  const board = db.where('taskBoards', 'id', id)[0];
  const updated = db.update('taskBoards', { ...board, ...params });

  return updated as TaskBoard;
};

export const destroy = (id: TaskBoard['id']) => {
  return db.remove('taskBoards', id) as TaskBoard;
};
