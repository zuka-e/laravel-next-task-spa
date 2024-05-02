import { HttpResponse, http } from 'msw';

import type {
  CreateTaskCardRequest,
  CreateTaskCardResponse,
  UpdateTaskCardRequest,
  UpdateTaskCardResponse,
  DestroyTaskCardRequest,
  DestroyTaskCardResponse,
  FetchTaskCardsRequest,
  FetchTaskCardsResponse,
} from '@/store/api';
import { API_ROUTE } from '@/config/api';
import { makePath } from '@/utils/api';
import { taskCardController } from '@test/api/controllers';
import { notFoundErrorResponse } from '@test/api/handlers/utils/responses';
import { withMiddleware } from '@test/api/handlers/middleware/utils/withMiddleware';

type TaskCardParams = {
  listId: string;
  cardId: string;
};

export const handlers = [
  http.get(
    API_ROUTE + makePath(['task-lists', ':listId'], ['task-cards']),
    withMiddleware<
      Pick<TaskCardParams, 'listId'>,
      FetchTaskCardsRequest,
      FetchTaskCardsResponse
    >()(async ({ params, request }) => {
      const paginated = taskCardController.index(params.listId, request);

      return HttpResponse.json({
        severity: 'info',
        message: 'タスクカード一覧を取得しました。',
        ...paginated,
      });
    })
  ),

  http.post(
    API_ROUTE + makePath(['task-lists', ':listId'], ['task-cards']),
    withMiddleware<
      TaskCardParams,
      CreateTaskCardRequest,
      CreateTaskCardResponse
    >()(async ({ params, request }) => {
      const data = await request.json();
      const response = taskCardController.store(params.listId, data);

      return HttpResponse.json(
        {
          severity: 'success',
          message: 'タスクカードを作成しました。',
          data: response,
        },
        { status: 201 }
      );
    })
  ),

  http.patch(
    API_ROUTE + makePath(['task-cards', ':cardId']),
    withMiddleware<
      Pick<TaskCardParams, 'cardId'>,
      UpdateTaskCardRequest,
      UpdateTaskCardResponse
    >()(async ({ params, request }) => {
      const data = await request.json();
      const updated = taskCardController.update(params.cardId, data);

      if (!updated) {
        return notFoundErrorResponse();
      }

      return HttpResponse.json({
        severity: 'info',
        message: 'タスクカードを更新しました。',
        data: updated,
      });
    })
  ),

  http.delete(
    API_ROUTE + makePath(['task-cards', ':cardId']),
    withMiddleware<
      Pick<TaskCardParams, 'cardId'>,
      DestroyTaskCardRequest,
      DestroyTaskCardResponse
    >()(({ params }) => {
      const deleted = taskCardController.destroy(params.cardId);

      if (!deleted) {
        return notFoundErrorResponse();
      }

      return HttpResponse.json({
        severity: 'warning',
        message: 'タスクカードを削除しました。',
        data: deleted,
      });
    })
  ),
];
