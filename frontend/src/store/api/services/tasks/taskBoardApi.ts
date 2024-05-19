import { makePath } from '@/utils/api';
import { makeDocsWithIndex } from '@/utils/dnd';
import { getTagsForPartialList } from '@/store/api/utils/caching';
import baseApi from './baseApi';
import type {
  CreateTaskBoardRequest,
  CreateTaskBoardResponse,
  DestroyTaskBoardRequest,
  DestroyTaskBoardResponse,
  FetchTaskBoardRequest,
  FetchTaskBoardResponse,
  FetchTaskBoardsRequest,
  FetchTaskBoardsResponse,
  UpdateTaskBoardRequest,
  UpdateTaskBoardResponse,
} from './types';

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
      query: ({ page }) => ({
        url: makePath(['task-boards']),
        params: { page },
      }),
      // cf. https://redux-toolkit.js.org/rtk-query/usage/mutations#revalidation-example
      providesTags: (res) => getTagsForPartialList(res?.data, 'TaskBoard'),
    }),
    createTaskBoard: builder.mutation<
      CreateTaskBoardResponse,
      CreateTaskBoardRequest
    >({
      query: (data) => ({
        url: makePath(['task-boards']),
        method: 'POST',
        data,
      }),
      invalidatesTags: () => getTagsForPartialList(undefined, 'TaskBoard'),
    }),
    getTaskBoard: builder.query<FetchTaskBoardResponse, FetchTaskBoardRequest>({
      query: (arg) => ({
        url: makePath(['task-boards', arg.id]),
      }),
      // cf. https://redux-toolkit.js.org/rtk-query/api/createApi#transformresponse
      transformResponse: (response: FetchTaskBoardResponse) => {
        const board = response.data;

        /** `TaskList` (プロパティが存在しない場合は`[]`を設定) */
        board.lists = board.lists ? board.lists : [];

        /** `TaskCard` (`boardId`及び`index`プロパティを設定)*/
        board.lists.forEach((list) => {
          if (!list.cards) {
            list.cards = [];
            return;
          }

          const cardsWithIndex = makeDocsWithIndex(
            list.cards,
            board.cardIndexMap
          );
          const cards = cardsWithIndex.map((card) => ({
            ...card,
            boardId: board.id,
          }));

          /** `index`プロパティに従って並び替え */
          list.cards = cards.slice().sort((a, b) => a.index - b.index);
        });

        return {
          data: board,
        };
      },
      // cf. https://redux-toolkit.js.org/rtk-query/usage/mutations#revalidation-example
      providesTags: (res, _err, _req) => [
        { type: 'TaskBoard', id: res?.data.id },
      ],
    }),
    updateTaskBoard: builder.mutation<
      UpdateTaskBoardResponse,
      UpdateTaskBoardRequest
    >({
      query: ({ id, ...data }) => ({
        url: makePath(['task-boards', id]),
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (res) => {
        return res ? [{ type: 'TaskBoard', id: res.data.id }] : [];
      },
    }),
    destroyTaskBoard: builder.mutation<
      DestroyTaskBoardResponse,
      DestroyTaskBoardRequest
    >({
      query: ({ id }) => ({
        url: makePath(['task-boards', id]),
        method: 'DELETE',
      }),
      // Invalidates only listed data.
      invalidatesTags: () => getTagsForPartialList(undefined, 'TaskBoard'),
      // cf. https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#pessimistic-updates
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        await queryFulfilled;

        // Don't invalidate tag to avoid unintended refetching resulting in 404.
        dispatch(
          api.util.updateQueryData('getTaskBoard', { id }, (draft) => {
            draft.data.isDeleted = true;
          })
        );
      },
    }),
  }),
});

export const {
  useGetTaskBoardsQuery,
  useCreateTaskBoardMutation,
  useGetTaskBoardQuery,
  useUpdateTaskBoardMutation,
  useDestroyTaskBoardMutation,
} = api;
