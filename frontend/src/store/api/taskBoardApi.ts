import type { TaskBoard, User } from '@/models';
import { makePath, type PaginationResponse } from '@/utils/api';
import api from './baseApi';

const taskBoardApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTaskBoards: build.query<
      PaginationResponse<TaskBoard>,
      {
        userId: User['id'];
        page?: string;
      }
    >({
      providesTags: ['TaskBoard'],
      query: ({ userId, page }) => ({
        url: makePath(['users', userId], ['task-boards']),
        params: { page: page || undefined },
      }),
    }),
  }),
});

export default taskBoardApi;
export const { useGetTaskBoardsQuery } = taskBoardApi;
