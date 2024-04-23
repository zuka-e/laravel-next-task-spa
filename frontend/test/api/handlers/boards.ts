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
      const paginated = taskBoardController.index(request);

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
      FetchTaskBoardRequest,
      FetchTaskBoardResponse | null
    >()(async ({ params }) => {
      const taskBoard = taskBoardController.show(params['boardId']);

      if (!board) {
        return HttpResponse.json(null, { status: 404 });
      }
      return HttpResponse.json({
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
      UpdateTaskBoardResponse | null
    >()(async ({ request, params }) => {
      const data = await request.json();
      const updated = taskBoardController.update(params['boardId'], data);

      if (!newState) {
        return HttpResponse.json(null, { status: 404 });
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
      DestroyTaskBoardResponse | null
    >()(async ({ params }) => {
      const deleted = taskBoardController.destroy(params['boardId']);

      if (!deleted) {
        return HttpResponse.json(null, { status: 404 });
      }

      return HttpResponse.json({
        severity: 'warning',
        message: 'タスクボードを削除しました。',
        data: deleted,
      });
    })
  ),
];
