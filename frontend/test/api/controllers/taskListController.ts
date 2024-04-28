import { type DefaultBodyType, type StrictRequest } from 'msw';

import type { TaskBoard, TaskList } from '@/models';
import type { TaskListDocument } from '@test/api/models';
import { db } from '@test/api/database';
import { paginate } from '@test/utils/paginate';

export const index = (
  boardId: TaskBoard['id'],
  request: StrictRequest<DefaultBodyType>
) => {
  const lists = db.where(
    'taskLists',
    'boardId',
    boardId
  ) as unknown as TaskList[];

  return paginate({ request, allData: lists });
};

export const store = (
  boardId: TaskBoard['id'],
  params: Partial<Omit<TaskList, 'id' | 'boardId'>>
) => {
  const newList = db.create('taskLists', {
    ...({} as TaskListDocument),
    boardId,
    ...params,
  });

  const response: TaskList = { ...newList, cards: [] };

  return response;
};

export const show = (id: TaskList['id']) => {
  const list = db.where('taskLists', 'id', id)[0];

  if (!list) return;

  return list as unknown as TaskList;
};

export const update = (
  id: TaskList['id'],
  params: Partial<Omit<TaskList, 'id' | 'boardId'>>
) => {
  const list = db.where('taskLists', 'id', id)[0];

  if (!list) return;

  const updated = db.update('taskLists', { ...list, ...params });
  const response: TaskList = { ...updated, cards: [] };

  return response;
};

export const destroy = (id: TaskList['id']) => {
  const deleted = db.remove('taskLists', id);

  if (!deleted) return;

  const response: TaskList = { ...deleted, cards: [] };

  return response;
};
