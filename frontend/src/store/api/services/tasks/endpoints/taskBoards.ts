import type { TaskBoard, User } from '@/models';
import { makePath, type PaginationResponse } from '@/utils/api';
import { type Endpoints } from '../baseApi';

const endpoints = ((builder) => ({
  getTaskBoards: builder.query<
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
})) satisfies Endpoints;

export default endpoints;
