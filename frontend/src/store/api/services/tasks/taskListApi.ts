import { getTagsForList } from '@/store/api/utils/caching';
import { makePath } from '@/utils/api';
import baseApi from './baseApi';
import type {
  CreateTaskListRequest,
  CreateTaskListResponse,
  DestroyTaskListRequest,
  DestroyTaskListResponse,
  FetchTaskListRequest,
  FetchTaskListResponse,
  UpdateTaskListRequest,
  UpdateTaskListResponse,
} from './types';

/**
 * @see https://redux-toolkit.js.org/rtk-query/api/created-api/code-splitting
 */
const api = baseApi.injectEndpoints({
  // cf. https://redux-toolkit.js.org/rtk-query/usage/code-splitting
  overrideExisting: false,
  endpoints: (builder) => ({
    createTaskList: builder.mutation<
      CreateTaskListResponse,
      CreateTaskListRequest
    >({
      query: ({ boardId, ...data }) => ({
        url: makePath(['task-boards', boardId], ['task-lists']),
        method: 'POST',
        data,
      }),
      invalidatesTags: () => getTagsForList(undefined, 'TaskList'),
    }),
    getTaskList: builder.query<FetchTaskListResponse, FetchTaskListRequest>({
      query: ({ id }) => ({
        url: makePath(['task-lists', id]),
      }),
      providesTags: (res) => [{ type: 'TaskList', id: res?.data.id }],
    }),
    updateTaskList: builder.mutation<
      UpdateTaskListResponse,
      UpdateTaskListRequest
    >({
      query: ({ id, ...data }) => ({
        url: makePath(['task-lists', id]),
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (res) => [{ type: 'TaskList', id: res?.data.id }],
    }),
    destroyTaskList: builder.mutation<
      DestroyTaskListResponse,
      DestroyTaskListRequest
    >({
      query: ({ id }) => ({
        url: makePath(['task-lists', id]),
        method: 'DELETE',
      }),
      invalidatesTags: (res) => [{ type: 'TaskList', id: res?.data.id }],
    }),
  }),
});

export const {
  useCreateTaskListMutation,
  useGetTaskListQuery,
  useUpdateTaskListMutation,
  useDestroyTaskListMutation,
} = api;
