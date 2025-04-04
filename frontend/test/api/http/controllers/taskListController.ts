import { type DefaultBodyType, type StrictRequest } from 'msw';

import type { CursorPaginationResponse } from '@/store/api';
import type { TaskBoard, TaskList } from '@test/api/database/models';
import db from '@test/api/database/manager';
import { cursorPaginate } from '@test/api/http/responses/paginate';

export const index = (
  boardId: TaskBoard['id'],
  request: StrictRequest<DefaultBodyType>,
): CursorPaginationResponse<TaskList> => {
  const lists = db.taskList.findMany({
    where: { boardId: { equals: boardId } },
  });

  return cursorPaginate({ request, filtered: lists });
};

export const store = (
  boardId: TaskBoard['id'],
  params: Partial<Omit<TaskList, 'id' | 'boardId'>>,
): TaskList => {
  return db.taskList.create({ boardId, ...params });
};

export const show = (id: TaskList['id']): TaskList | null => {
  return db.taskList.findFirst({ where: { id: { equals: id } } });
};

export const update = (
  id: TaskList['id'],
  params: Partial<Omit<TaskList, 'id' | 'boardId'>>,
): TaskList | null => {
  return db.taskList.update({ where: { id: { equals: id } }, data: params });
};

export const destroy = (id: TaskList['id']): TaskList | null => {
  return db.taskList.delete({ where: { id: { equals: id } } });
};
