import { HttpResponse, http } from 'msw';

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
} from '@/store/api';
import { API_ROUTE } from '@/config/api';
import { makePath } from '@/utils/api';
import { withMiddleware } from '@test/api/http/utils';
import { getUser } from '@test/api/auth';
import { notFoundErrorResponse } from '@test/api/http/responses/errors';
import { taskBoardController } from '@test/api/http/controllers';

type TaskBoardParams = {
  userId: string;
  boardId: string;
};

export const handlers = [
  http.get(
    API_ROUTE + makePath(['task-boards']),
    withMiddleware<
      TaskBoardParams,
      FetchTaskBoardsRequest,
      FetchTaskBoardsResponse
    >()(({ request }) => {
      const paginated = taskBoardController.index(getUser()!.id, request);

      return HttpResponse.json({
        severity: 'info',
        message: 'タスクボード一覧を取得しました。',
        ...paginated,
      });
    })
  ),

  http.post(
    API_ROUTE + makePath(['task-boards']),
    withMiddleware<
      TaskBoardParams,
      CreateTaskBoardRequest,
      CreateTaskBoardResponse
    >()(async ({ request }) => {
      const data = await request.json();
      const taskBoard = taskBoardController.store(data);

      return HttpResponse.json(
        {
          severity: 'success',
          message: 'タスクボードを作成しました。',
          data: taskBoard,
        },
        { status: 201 }
      );
    })
  ),

  http.get(
    API_ROUTE + makePath(['task-boards', ':boardId']),
    withMiddleware<
      TaskBoardParams,
      FetchTaskBoardRequest | FetchKanbanBoardRequest,
      FetchTaskBoardResponse | FetchKanbanBoardResponse
    >()(async ({ params, request }) => {
      const taskBoard = taskBoardController.show(params['boardId'], request);

      if (!taskBoard) {
        return notFoundErrorResponse();
      }

      // ※ workaround for narrowing type
      return 'id' in taskBoard
        ? HttpResponse.json({
            severity: 'info',
            message: 'タスクボードを取得しました。',
            data: taskBoard,
          })
        : HttpResponse.json({
            severity: 'info',
            message: 'タスクボードを取得しました。',
            data: taskBoard,
          });
    })
  ),

  http.patch(
    API_ROUTE + makePath(['task-boards', ':boardId']),
    withMiddleware<
      TaskBoardParams,
      UpdateTaskBoardRequest,
      UpdateTaskBoardResponse
    >()(async ({ params, request }) => {
      const data = await request.json();
      const updated = taskBoardController.update(params['boardId'], data);

      if (!updated) {
        return notFoundErrorResponse();
      }

      return HttpResponse.json({
        severity: 'info',
        message: 'タスクボードを更新しました。',
        data: updated,
      });
    })
  ),

  http.delete(
    API_ROUTE + makePath(['task-boards', ':boardId']),
    withMiddleware<
      TaskBoardParams,
      DestroyTaskBoardRequest,
      DestroyTaskBoardResponse
    >()(async ({ params }) => {
      const deleted = taskBoardController.destroy(params['boardId']);

      if (!deleted) {
        return notFoundErrorResponse();
      }

      return HttpResponse.json({
        severity: 'warning',
        message: 'タスクボードを削除しました。',
        data: deleted,
      });
    })
  ),

  http.post(
    API_ROUTE + ',/boards/:boardId/move-card',
    withMiddleware<
      Pick<TaskBoardParams, 'boardId'>,
      Omit<MoveTaskCardRequest, 'boardId'>,
      MoveTaskCardResponse
    >()(async ({ request }) => {
      const data = await request.json();

      const updated = taskBoardController.moveCard(data);

      if (!updated) {
        return notFoundErrorResponse();
      }

      return HttpResponse.json({
        severity: 'info',
        message: 'タスクカードを移動しました。',
        data: updated,
      });
    })
  ),
];
