import { HttpResponse, http } from 'msw';

import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import type {
  CreateTaskCardRequest,
  CreateTaskCardResponse,
  DestroyTaskCardRequest,
  DestroyTaskCardResponse,
  FetchTaskCardRequest,
  FetchTaskCardResponse,
  FetchTaskCardsRequest,
  FetchTaskCardsResponse,
  SearchTasksByBoardRequest,
  SearchTasksByBoardResponse,
  UpdateTaskCardRequest,
  UpdateTaskCardResponse,
} from '@/store/api';
import { taskCardController } from '@test/api/http/controllers';
import { notFoundErrorResponse } from '@test/api/http/responses/errors';
import { withMiddleware } from '@test/api/http/utils';

type TaskCardParams = {
  boardId: string;
  listId: string;
  cardId: string;
};

export const handlers = [
  http.get(
    API_BASE_URL + API_ENDPOINTS.TASKS.LISTS.CARDS.INDEX,
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
    }),
  ),

  http.post(
    API_BASE_URL + API_ENDPOINTS.TASKS.LISTS.CARDS.CREATE,
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
        { status: 201 },
      );
    }),
  ),

  http.get(
    API_BASE_URL + API_ENDPOINTS.TASKS.CARDS.SHOW,
    withMiddleware<
      TaskCardParams,
      FetchTaskCardRequest,
      FetchTaskCardResponse
    >()(async ({ params }) => {
      const taskCard = taskCardController.show(params['cardId']);

      if (!taskCard) {
        return notFoundErrorResponse();
      }

      return HttpResponse.json({
        severity: 'info',
        message: 'タスクカードを取得しました。',
        data: taskCard,
      });
    }),
  ),

  http.patch(
    API_BASE_URL + API_ENDPOINTS.TASKS.CARDS.UPDATE,
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
    }),
  ),

  http.delete(
    API_BASE_URL + API_ENDPOINTS.TASKS.CARDS.DESTROY,
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
    }),
  ),

  http.get(
    API_BASE_URL + API_ENDPOINTS.TASKS.BOARDS.CARDS.SEARCH,
    withMiddleware<
      Pick<TaskCardParams, 'boardId'>,
      SearchTasksByBoardRequest,
      SearchTasksByBoardResponse
    >()(async ({ params, request }) => {
      const url = new URL(request.url);
      const q = url.searchParams.get('q');
      const searched = taskCardController.search(params['boardId'], q ?? '');

      return HttpResponse.json({
        severity: 'info',
        message: 'タスクカードを検索しました。',
        data: searched,
      });
    }),
  ),
];
