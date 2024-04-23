import { HttpResponse, http } from 'msw';

import type {
  CreateTaskListRequest,
  CreateTaskListResponse,
  UpdateTaskListRequest,
  UpdateTaskListResponse,
  DestroyTaskListResponse,
  DestroyTaskListRequest,
} from '@/store/api';
import { API_ROUTE } from '@/config/api';
import { makePath } from '@/utils/api';
import { taskListController } from '@test/api/controllers';
import { notFoundErrorResponse } from '@test/api/handlers/utils/responses';
import { withMiddleware } from '@test/api/handlers/middleware/utils/withMiddleware';

type TaskListParams = {
  boardId: string;
  listId: string;
};

export const handlers = [
  http.post(
    API_ROUTE + makePath(['task-boards', ':boardId'], ['task-lists']),
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
        { status: 201 }
      );
    })
  ),

  http.patch(
    API_ROUTE + makePath(['task-lists', ':listId']),
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
    })
  ),

  http.delete(
    API_ROUTE + makePath(['task-lists', ':listId']),
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
    })
  ),
];
