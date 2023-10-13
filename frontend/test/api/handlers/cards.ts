import { rest, type DefaultBodyType } from 'msw';

import type {
  CreateTaskCardRequest,
  CreateTaskCardResponse,
  UpdateTaskCardRequest,
  UpdateTaskCardResponse,
  DestroyTaskCardResponse,
} from '@/store/thunks/cards';
import type { ErrorResponse } from './types';
import { API_ROUTE } from '@/config/api';
import { makePath } from '@/utils/api';
import { db } from '@test/api/database';
import { taskCardController } from '@test/api/controllers';
import { statefulResponse } from './responses';
import { resolveMiddleware } from './utils';

type TaskCardParams = {
  listId: string;
  cardId: string;
};

export const handlers = [
  rest.post<
    CreateTaskCardRequest,
    TaskCardParams,
    CreateTaskCardResponse & ErrorResponse
  >(
    API_ROUTE + makePath(['task-lists', ':listId'], ['task-cards']),
    (req, _res, ctx) => {
      const list = db.where('taskLists', 'id', req.params.listId)[0];

      const { transformers, isError } = resolveMiddleware(req, [
        'authenticate',
        `authorize:${list?.userId}`,
        'verified',
      ]);

      if (isError) {
        return statefulResponse(...transformers);
      }

      const response = taskCardController.store(req);

      return statefulResponse(ctx.status(201), ctx.json({ data: response }));
    }
  ),

  rest.patch<
    UpdateTaskCardRequest,
    TaskCardParams,
    UpdateTaskCardResponse & ErrorResponse
  >(
    API_ROUTE + makePath(['task-lists', ':listId'], ['task-cards', ':cardId']),
    (req, _res, ctx) => {
      const list = db.where('taskLists', 'id', req.params.listId)[0];
      const card = db.where('taskCards', 'id', req.params.cardId)[0];

      const { transformers, isError } = resolveMiddleware(req, [
        'authenticate',
        `authorize:${list?.userId},${card?.userId}`,
        'verified',
      ]);

      if (isError) {
        return statefulResponse(...transformers);
      }

      const updated = taskCardController.update(req);

      if (!updated) return statefulResponse(ctx.status(404));

      return statefulResponse(ctx.status(200), ctx.json({ data: updated }));
    }
  ),

  rest.delete<
    DefaultBodyType,
    TaskCardParams,
    DestroyTaskCardResponse & ErrorResponse
  >(
    API_ROUTE + makePath(['task-lists', ':listId'], ['task-cards', ':cardId']),
    (req, _res, ctx) => {
      const list = db.where('taskLists', 'id', req.params.listId)[0];
      const card = db.where('taskCards', 'id', req.params.cardId)[0];

      const { transformers, isError } = resolveMiddleware(req, [
        'authenticate',
        `authorize:${list?.userId},${card?.userId}`,
        'verified',
      ]);

      if (isError) {
        return statefulResponse(...transformers);
      }

      const deleted = taskCardController.destroy(req);

      if (!deleted) return statefulResponse(ctx.status(404));

      return statefulResponse(ctx.status(200), ctx.json({ data: deleted }));
    }
  ),
];
