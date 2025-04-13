import { API_ENDPOINTS } from '@/config/api';
import { getTagsForList } from '@/store/api/utils/caching';
import { buildPath } from '@/utils/api/url';
import baseApi from './baseApi';
import type {
  CreateTaskCardRequest,
  CreateTaskCardResponse,
  DestroyTaskCardRequest,
  DestroyTaskCardResponse,
  FetchTaskCardRequest,
  FetchTaskCardResponse,
  SearchTasksByBoardRequest,
  SearchTasksByBoardResponse,
  UpdateTaskCardRequest,
  UpdateTaskCardResponse,
} from './types';

/**
 * @see https://redux-toolkit.js.org/rtk-query/api/created-api/code-splitting
 */
const api = baseApi.injectEndpoints({
  // cf. https://redux-toolkit.js.org/rtk-query/usage/code-splitting
  overrideExisting: false,
  endpoints: (builder) => ({
    createTaskCard: builder.mutation<
      CreateTaskCardResponse,
      CreateTaskCardRequest
    >({
      query: ({ listId, ...data }) => ({
        url: buildPath(API_ENDPOINTS.TASKS.LISTS.CARDS.CREATE, {
          listId,
        }),
        method: 'POST',
        data,
      }),
      invalidatesTags: () => getTagsForList(undefined, 'TaskCard'),
    }),
    getTaskCard: builder.query<FetchTaskCardResponse, FetchTaskCardRequest>({
      query: ({ id }) => ({
        url: buildPath(API_ENDPOINTS.TASKS.CARDS.SHOW, {
          cardId: id,
        }),
      }),
      providesTags: (res) => [{ type: 'TaskCard', id: res?.data.id }],
    }),
    updateTaskCard: builder.mutation<
      UpdateTaskCardResponse,
      UpdateTaskCardRequest
    >({
      query: ({ id, ...data }) => ({
        url: buildPath(API_ENDPOINTS.TASKS.CARDS.UPDATE, {
          cardId: id,
        }),
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (res) => [{ type: 'TaskCard', id: res?.data.id }],
    }),
    destroyTaskCard: builder.mutation<
      DestroyTaskCardResponse,
      DestroyTaskCardRequest
    >({
      query: ({ id }) => ({
        url: buildPath(API_ENDPOINTS.TASKS.CARDS.DESTROY, {
          cardId: id,
        }),
        method: 'DELETE',
      }),
      invalidatesTags: (res) => [{ type: 'TaskCard', id: res?.data.id }],
    }),
    SearchTaskCardsByBoard: builder.query<
      SearchTasksByBoardResponse,
      SearchTasksByBoardRequest
    >({
      query: ({ boardId, q }) => ({
        url: buildPath(API_ENDPOINTS.TASKS.BOARDS.CARDS.SEARCH, {
          boardId,
        }),
        params: { q },
      }),
    }),
  }),
});

export const {
  useCreateTaskCardMutation,
  useGetTaskCardQuery,
  useUpdateTaskCardMutation,
  useDestroyTaskCardMutation,
  useSearchTaskCardsByBoardQuery,
} = api;
