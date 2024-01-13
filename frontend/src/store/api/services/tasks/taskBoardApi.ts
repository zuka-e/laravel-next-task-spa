import { makePath } from '@/utils/api';
import { makeDocsWithIndex } from '@/utils/dnd';
import { providesList } from '@/store/api/utils';
import baseApi from './baseApi';
import type {
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
      query: ({ userId, page }) => ({
        url: makePath(['users', userId], ['task-boards']),
        params: { page: page || undefined },
      }),
      // cf. https://redux-toolkit.js.org/rtk-query/usage/mutations#revalidation-example
      providesTags: (res) => providesList(res?.data, 'TaskBoard'),
    }),
    getTaskBoard: builder.query<FetchTaskBoardResponse, FetchTaskBoardRequest>({
      query: ({ userId, boardId }) => ({
        url: makePath(['users', userId], ['task-boards', boardId]),
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
      providesTags: (_res, _err, req) => [
        { type: 'TaskBoard', id: req.boardId },
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
      invalidatesTags: (_res, _err, req) => [{ type: 'TaskBoard', id: req.id }],
    }),
  }),
});

export const {
  useGetTaskBoardsQuery,
  useGetTaskBoardQuery,
  useUpdateTaskBoardMutation,
} = api;
