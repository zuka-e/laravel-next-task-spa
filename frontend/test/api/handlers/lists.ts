import { rest, type DefaultBodyType } from 'msw';

import type {
  CreateTaskListRequest,
  CreateTaskListResponse,
  UpdateTaskListRequest,
  UpdateTaskListResponse,
  DestroyTaskListResponse,
} from '@/store/thunks/lists';
import type { ErrorResponse } from './types';
import { API_ROUTE } from '@/config/api';
import { makePath } from '@/utils/api';
import { db } from '@test/api/database';
import { taskListController } from '@test/api/controllers';
import { statefulResponse } from './responses';
import { resolveMiddleware } from './utils';

type TaskListParams = {
  boardId: string;
  listId: string;
};

export const handlers = [
  rest.post<
    CreateTaskListRequest,
    TaskListParams,
    CreateTaskListResponse & ErrorResponse
  >(
    API_ROUTE + makePath(['task-boards', ':boardId'], ['task-lists']),
    (req, _res, ctx) => {
      const board = db.where('taskBoards', 'id', req.params.boardId)[0];

      const { transformers, isError } = resolveMiddleware(req, [
        'authenticate',
        `authorize:${board?.userId}`,
        'verified',
      ]);

      if (isError) {
        return statefulResponse(...transformers);
      }

      const response = taskListController.store(req);

      return statefulResponse(ctx.status(201), ctx.json({ data: response }));
    }
  ),

  rest.patch<
    UpdateTaskListRequest,
    TaskListParams,
    UpdateTaskListResponse & ErrorResponse
  >(
    API_ROUTE +
      makePath(['task-boards', ':boardId'], ['task-lists', ':listId']),
    (req, _res, ctx) => {
      const board = db.where('taskBoards', 'id', req.params.boardId)[0];
      const list = db.where('taskLists', 'id', req.params.listId)[0];

      const { transformers, isError } = resolveMiddleware(req, [
        'authenticate',
        `authorize:${board?.userId},${list?.userId}`,
        'verified',
      ]);

      if (isError) {
        return statefulResponse(...transformers);
      }

      const updated = taskListController.update(req);

      if (!updated) return statefulResponse(ctx.status(404));

      return statefulResponse(ctx.status(200), ctx.json({ data: updated }));
    }
  ),

  rest.delete<
    DefaultBodyType,
    TaskListParams,
    DestroyTaskListResponse & ErrorResponse
  >(
    API_ROUTE +
      makePath(['task-boards', ':boardId'], ['task-lists', ':listId']),
    (req, _res, ctx) => {
      const board = db.where('taskBoards', 'id', req.params.boardId)[0];
      const list = db.where('taskLists', 'id', req.params.listId)[0];

      const { transformers, isError } = resolveMiddleware(req, [
        'authenticate',
        `authorize:${board?.userId},${list?.userId}`,
        'verified',
      ]);

      if (isError) {
        return statefulResponse(...transformers);
      }

      const deleted = taskListController.destroy(req);

      if (!deleted) return statefulResponse(ctx.status(404));

      return statefulResponse(ctx.status(200), ctx.json({ data: deleted }));
    }
  ),
];
