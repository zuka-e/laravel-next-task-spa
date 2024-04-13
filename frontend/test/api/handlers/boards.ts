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
import { withMiddleware } from '@test/api/handlers/middleware/utils/withMiddleware';
import { taskBoardController } from '@test/api/controllers';

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
      const response = taskBoardController.index(request);

      return HttpResponse.json({
        ...response,
        severity: 'info',
        message: 'タスクボード一覧を取得しました。',
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
          data: taskBoard,
          severity: 'success',
          message: 'タスクボードを作成しました。',
        },
        { status: 201 }
      );
    })
  ),

  http.get(
    API_ROUTE + makePath(['task-boards', ':boardId']),
    withMiddleware<
      TaskBoardParams,
      FetchTaskBoardRequest,
      FetchTaskBoardResponse | null
    >()(async ({ params }) => {
      const board = taskBoardController.show(params['boardId']);

      if (!board) {
        return HttpResponse.json(null, { status: 404 });
      }
      return HttpResponse.json({
        data: board,
        severity: 'info',
        message: 'タスクボードを取得しました。',
      });
    })
  ),

  http.patch(
    API_ROUTE + makePath(['task-boards', ':boardId']),
    withMiddleware<
      TaskBoardParams,
      UpdateTaskBoardRequest,
      UpdateTaskBoardResponse | null
    >()(async ({ request, params }) => {
      const data = await request.json();
      const newState = taskBoardController.update(params['boardId'], data);

      if (!newState) {
        return HttpResponse.json(null, { status: 404 });
      }

      return HttpResponse.json({
        data: newState,
        severity: 'info',
        message: 'タスクボードを更新しました。',
      });
    })
  ),

  http.delete(
    API_ROUTE + makePath(['task-boards', ':boardId']),
    withMiddleware<
      TaskBoardParams,
      DestroyTaskBoardRequest,
      DestroyTaskBoardResponse | null
    >()(async ({ params }) => {
      const deleted = taskBoardController.destroy(params['boardId']);

      if (!deleted) {
        return HttpResponse.json(null, { status: 404 });
      }

      return HttpResponse.json({
        data: deleted,
        severity: 'warning',
        message: 'タスクボードを削除しました。',
      });
    })
  ),
];
