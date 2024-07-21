import { type DefaultBodyType, type StrictRequest } from 'msw';

import type { PaginationResponse } from '@/store/api';
import { paginate } from '@test/api/http/responses/paginate';
import { TaskBoard } from '@test/api/database/models';
import db from '@test/api/database/manager';
import { getUser } from '@test/api/auth';

export const index = (
  userId: TaskBoard['userId'],
  request: StrictRequest<DefaultBodyType>
): PaginationResponse<TaskBoard> => {
  const boards = db.taskBoard.findMany({
    where: { userId: { equals: userId } },
  });

  return paginate({ request, filtered: boards });
};

export const store = (
  params: Partial<Omit<TaskBoard, 'id' | 'userId'>>
): TaskBoard => {
  return db.taskBoard.create({ userId: getUser()!.id, ...params });
};

export const show = (id: TaskBoard['id']): TaskBoard | null => {
  return db.taskBoard.findFirst({ where: { id: { equals: id } } });
};

export const update = (
  id: TaskBoard['id'],
  params: Partial<Omit<TaskBoard, 'id' | 'userId'>>
): TaskBoard | null => {
  return db.taskBoard.update({ where: { id: { equals: id } }, data: params });
};

export const destroy = (id: TaskBoard['id']): TaskBoard | null => {
  return db.taskBoard.delete({ where: { id: { equals: id } } });
};
