import { makePath } from '@/utils/api';
import baseApi from './baseApi';
import { FetchTaskBoardsRequest, FetchTaskBoardsResponse } from './types';

/**
 * @see https://redux-toolkit.js.org/rtk-query/api/created-api/code-splitting
 */
const api = baseApi.injectEndpoints({
  // > If you inject an endpoint that already exists
  // > and don't explicitly specify `overrideExisting: true`,
  // > `the endpoint will not be overridden.
  // > https://redux-toolkit.js.org/rtk-query/usage/code-splitting
  overrideExisting: false,
  endpoints: (builder) => ({
    getTaskBoards: builder.query<
      FetchTaskBoardsResponse,
      FetchTaskBoardsRequest
    >({
      providesTags: ['TaskBoard'],
      query: ({ userId, page }) => ({
        url: makePath(['users', userId], ['task-boards']),
        params: { page: page || undefined },
      }),
    }),
  }),
});

export const { useGetTaskBoardsQuery } = api;
