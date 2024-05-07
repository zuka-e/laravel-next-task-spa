import { type DefaultBodyType, type StrictRequest } from 'msw';

import type { TaskCard, TaskList } from '@/models';
import type { TaskCardDocument } from '@test/api/models';
import { db } from '@test/api/database';
import { paginate } from '@test/utils/paginate';

export const index = (
  listId: TaskList['id'],
  request: StrictRequest<DefaultBodyType>
) => {
  const cards = db.where(
    'taskCards',
    'listId',
    listId
  ) as unknown as TaskCard[];

  return paginate({ request, allData: cards });
};

export const store = (
  listId: TaskList['id'],
  params: Partial<Omit<TaskCard, 'id' | 'listId'>>
) => {
  const parent = db.where('taskLists', 'id', listId)[0];
  const newCard = db.create('taskCards', {
    ...({} as TaskCardDocument),
    listId,
    ...params,
  });

  const response: TaskCard = { ...newCard, boardId: parent.boardId };

  return response;
};

export const show = (id: TaskCard['id']) => {
  const card = db.where('taskCards', 'id', id)[0];

  if (!card) return;

  return card as unknown as TaskCard;
};

export const update = (
  id: TaskCard['id'],
  params: Partial<Omit<TaskCard, 'id' | 'listId'>>
) => {
  const card = db.where('taskCards', 'id', id)[0];

  if (!card) return;

  const updated = db.update('taskCards', { ...card, ...params });

  const parent = db.whereIn('taskLists', 'id', [
    params.boardId,
    updated.listId,
  ])[0];
  const response: TaskCard = {
    ...updated,
    boardId: parent.boardId,
  };

  return response;
};

export const destroy = (id: TaskCard['id']) => {
  const deleted = db.remove('taskCards', id);

  if (!deleted) return;

  const parent = db.where('taskLists', 'id', deleted.listId)[0];
  const boardId = parent.boardId;
  const response: TaskCard = { ...deleted, boardId };

  return response;
};
