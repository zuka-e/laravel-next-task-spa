import { API_ENDPOINTS } from '@/config/api';
import { getTagsForList } from '@/store/api/utils/caching';
import { buildPath } from '@/utils/api/url';
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
        url: buildPath(API_ENDPOINTS.TASKS.BOARDS.LISTS.CREATE, {
          boardId,
        }),
        method: 'POST',
        data,
      }),
      invalidatesTags: () => getTagsForList(undefined, 'TaskList'),
    }),
    getTaskList: builder.query<FetchTaskListResponse, FetchTaskListRequest>({
      query: ({ id }) => ({
        url: buildPath(API_ENDPOINTS.TASKS.LISTS.SHOW, {
          listId: id,
        }),
      }),
      providesTags: (res) => [{ type: 'TaskList', id: res?.data.id }],
    }),
    updateTaskList: builder.mutation<
      UpdateTaskListResponse,
      UpdateTaskListRequest
    >({
      query: ({ id, ...data }) => ({
        url: buildPath(API_ENDPOINTS.TASKS.LISTS.UPDATE, {
          listId: id,
        }),
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
        url: buildPath(API_ENDPOINTS.TASKS.LISTS.DESTROY, {
          listId: id,
        }),
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
