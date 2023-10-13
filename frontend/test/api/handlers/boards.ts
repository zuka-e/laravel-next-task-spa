import { rest } from 'msw';

import type {
  CreateTaskBoardRequest,
  CreateTaskBoardResponse,
  DestroyTaskBoardRequest,
  DestroyTaskBoardResponse,
  FetchTaskBoardRequest,
  FetchTaskBoardResponse,
  FetchTaskBoardsRequest,
  FetchTaskBoardsResponse,
  UpdateTaskBoardRequest,
  UpdateTaskBoardResponse,
} from '@/store/thunks/boards';
import { API_ROUTE } from '@/config/api';
import { makePath } from '@/utils/api';
import { db } from '@test/api/database';
import { taskBoardController } from '@test/api/controllers';
import type { ErrorResponse } from './types';
import { statefulResponse } from './responses';
import { resolveMiddleware } from './utils';

type TaskBoardParams = {
  userId: string;
  boardId: string;
};

export const handlers = [
  rest.get<
    FetchTaskBoardsRequest,
    TaskBoardParams,
    FetchTaskBoardsResponse & ErrorResponse
  >(
    API_ROUTE + makePath(['users', ':userId'], ['task-boards']),
    (req, _res, ctx) => {
      const { transformers, isError } = resolveMiddleware(req, [
        'authenticate',
        `authorize:${req.params.userId}`,
        'verified',
      ]);

      if (isError) {
        return statefulResponse(...transformers);
      }

      const response = taskBoardController.index(req);

      return statefulResponse(
        ctx.status(200),
        ctx.json(response),
        ...transformers
      );
    }
  ),

  rest.post<
    CreateTaskBoardRequest,
    TaskBoardParams,
    CreateTaskBoardResponse & ErrorResponse
  >(
    API_ROUTE + makePath(['users', ':userId'], ['task-boards']),
    (req, _res, ctx) => {
      const { transformers, isError } = resolveMiddleware(req, [
        'authenticate',
        `authorize:${req.params.userId}`,
        'verified',
      ]);

      if (isError) {
        return statefulResponse(...transformers);
      }

      const response = taskBoardController.store(req);

      return statefulResponse(
        ctx.status(201),
        ctx.json({ data: response }),
        ...transformers
      );
    }
  ),

  rest.get<
    FetchTaskBoardRequest,
    TaskBoardParams,
    FetchTaskBoardResponse & ErrorResponse
  >(
    API_ROUTE + makePath(['users', ':userId'], ['task-boards', ':boardId']),
    (req, _res, ctx) => {
      const board = taskBoardController.show(req);

      const { transformers, isError } = resolveMiddleware(req, [
        'authenticate',
        `authorize:${req.params.userId},${board?.userId}`,
        'verified',
      ]);

      if (isError) {
        return statefulResponse(...transformers);
      }

      if (!board) return statefulResponse(ctx.status(404));

      return statefulResponse(
        ctx.status(200),
        ctx.json({ data: board }),
        ...transformers
      );
    }
  ),

  rest.patch<
    UpdateTaskBoardRequest,
    TaskBoardParams,
    UpdateTaskBoardResponse & ErrorResponse
  >(
    API_ROUTE + makePath(['users', ':userId'], ['task-boards', ':boardId']),
    (req, _res, ctx) => {
      const board = db.where('taskBoards', 'id', req.params.boardId)[0];

      const { transformers, isError } = resolveMiddleware(req, [
        'authenticate',
        `authorize:${req.params.userId},${board?.userId}`,
        'verified',
      ]);

      if (isError) {
        return statefulResponse(...transformers);
      }

      const newState = taskBoardController.update(req);

      if (!newState) return statefulResponse(ctx.status(404));

      return statefulResponse(
        ctx.status(201),
        ctx.json({ data: newState }),
        ...transformers
      );
    }
  ),

  rest.delete<
    DestroyTaskBoardRequest,
    TaskBoardParams,
    DestroyTaskBoardResponse & ErrorResponse
  >(
    API_ROUTE + makePath(['users', ':userId'], ['task-boards', ':boardId']),
    (req, _res, ctx) => {
      const board = db.where('taskBoards', 'id', req.params.boardId)[0];

      const { transformers, isError } = resolveMiddleware(req, [
        'authenticate',
        `authorize:${req.params.userId},${board?.userId}`,
        'verified',
      ]);

      if (isError) {
        return statefulResponse(...transformers);
      }

      const deleted = taskBoardController.destroy(req);

      if (!deleted) return statefulResponse(ctx.status(404));

      return statefulResponse(
        ctx.status(200),
        ctx.json({ data: deleted }),
        ...transformers
      );
    }
  ),
];
