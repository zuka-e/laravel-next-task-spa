import { HttpResponse, http } from 'msw';

import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import type {
  CreateTaskListRequest,
  CreateTaskListResponse,
  DestroyTaskListRequest,
  DestroyTaskListResponse,
  FetchTaskListRequest,
  FetchTaskListResponse,
  FetchTaskListsRequest,
  FetchTaskListsResponse,
  UpdateTaskListRequest,
  UpdateTaskListResponse,
} from '@/store/api';
import { taskListController } from '@test/api/http/controllers';
import { notFoundErrorResponse } from '@test/api/http/responses/errors';
import { withMiddleware } from '@test/api/http/utils';

type TaskListParams = {
  boardId: string;
  listId: string;
};

export const handlers = [
  http.get(
    API_BASE_URL + API_ENDPOINTS.TASKS.BOARDS.LISTS.INDEX,
    withMiddleware<
      Pick<TaskListParams, 'boardId'>,
      FetchTaskListsRequest,
      FetchTaskListsResponse
    >()(async ({ params, request }) => {
      const paginated = taskListController.index(params.boardId, request);

      return HttpResponse.json({
        severity: 'info',
        message: 'タスクリスト一覧を取得しました。',
        ...paginated,
      });
    }),
  ),

  http.post(
    API_BASE_URL + API_ENDPOINTS.TASKS.BOARDS.LISTS.CREATE,
    withMiddleware<
      Pick<TaskListParams, 'boardId'>,
      CreateTaskListRequest,
      CreateTaskListResponse
    >()(async ({ params, request }) => {
      const data = await request.json();
      const taskList = taskListController.store(params['boardId'], data);

      return HttpResponse.json(
        {
          severity: 'success',
          message: 'タスクリストを作成しました。',
          data: taskList,
        },
        { status: 201 },
      );
    }),
  ),

  http.get(
    API_BASE_URL + API_ENDPOINTS.TASKS.LISTS.SHOW,
    withMiddleware<
      TaskListParams,
      FetchTaskListRequest,
      FetchTaskListResponse
    >()(async ({ params }) => {
      const taskList = taskListController.show(params['listId']);

      if (!taskList) {
        return notFoundErrorResponse();
      }

      return HttpResponse.json({
        severity: 'info',
        message: 'タスクリストを取得しました。',
        data: taskList,
      });
    }),
  ),

  http.patch(
    API_BASE_URL + API_ENDPOINTS.TASKS.LISTS.UPDATE,
    withMiddleware<
      Pick<TaskListParams, 'listId'>,
      UpdateTaskListRequest,
      UpdateTaskListResponse
    >()(async ({ params, request }) => {
      const data = await request.json();
      const updated = taskListController.update(params['listId'], data);

      if (!updated) {
        return notFoundErrorResponse();
      }

      return HttpResponse.json({
        severity: 'info',
        message: 'タスクリストを更新しました。',
        data: updated,
      });
    }),
  ),

  http.delete(
    API_BASE_URL + API_ENDPOINTS.TASKS.LISTS.DESTROY,
    withMiddleware<
      Pick<TaskListParams, 'listId'>,
      DestroyTaskListRequest,
      DestroyTaskListResponse
    >()(({ params }) => {
      const deleted = taskListController.destroy(params.listId);

      if (!deleted) {
        return notFoundErrorResponse();
      }

      return HttpResponse.json({
        severity: 'warning',
        message: 'タスクリストを削除しました。',
        data: deleted,
      });
    }),
  ),
];
