import { RestRequest } from 'msw';

import { TaskList } from '@/models';
import {
  CreateTaskListRequest,
  UpdateTaskListRequest,
} from '@/store/thunks/lists';
import { TaskListDocument } from '@test/api/models';
import { db } from '@test/api/database';

export const store = (req: RestRequest<CreateTaskListRequest>) => {
  const newList = db.create('taskLists', {
    ...({} as TaskListDocument),
    boardId: req.params.boardId,
    ...req.body,
  });

  const response: TaskList = { ...newList, cards: [] };

  return response;
};

export const update = (req: RestRequest<UpdateTaskListRequest>) => {
  const list = db.where('taskLists', 'id', req.params.listId)[0];

  if (!list) return;

  const updated = db.update('taskLists', { ...list, ...req.body });
  const response: TaskList = { ...updated, cards: [] };

  return response;
};

export const destroy = (req: RestRequest) => {
  const deleted = db.remove('taskLists', req.params.listId);

  if (!deleted) return;

  const response: TaskList = { ...deleted, cards: [] };

  return response;
};
