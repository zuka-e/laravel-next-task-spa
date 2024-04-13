import { type DefaultBodyType, type StrictRequest } from 'msw';

import type { TaskBoard, TaskList, TaskCard } from '@/models';
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

export const show = (boardId: TaskBoard['id']) => {
  const board = db.where('taskBoards', 'id', boardId)[0] as TaskBoard;

  if (!board) return;

  const limit = 1;

  board.lists = db
    .where('taskLists', 'boardId', boardId)
    .slice(0, limit) as unknown as TaskList[];

  board.lists.forEach((list) => {
    const cards = db.where('taskCards', 'listId', list.id).slice(0, limit);
    list.cards = cards.map((card) => ({
      ...(card as unknown as TaskCard),
      boardId,
    }));
  });

  return board as TaskBoard;
};

export const update = (
  boardId: TaskBoard['id'],
  params: Partial<TaskBoard>
) => {
  const board = db.where('taskBoards', 'id', boardId)[0];
  const updated = db.update('taskBoards', { ...board, ...params });

  return updated as TaskBoard;
};

export const destroy = (boardId: TaskBoard['id']) => {
  return db.remove('taskBoards', boardId) as TaskBoard;
};
