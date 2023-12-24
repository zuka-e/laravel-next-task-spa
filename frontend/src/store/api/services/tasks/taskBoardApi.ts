import { makePath } from '@/utils/api';
import { makeDocsWithIndex } from '@/utils/dnd';
import baseApi from './baseApi';
import type {
  FetchTaskBoardRequest,
  FetchTaskBoardResponse,
  FetchTaskBoardsRequest,
  FetchTaskBoardsResponse,
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
      providesTags: ['TaskBoard'],
      query: ({ userId, page }) => ({
        url: makePath(['users', userId], ['task-boards']),
        params: { page: page || undefined },
      }),
    }),
    getTaskBoard: builder.query<FetchTaskBoardResponse, FetchTaskBoardRequest>({
      providesTags: ['TaskBoard'],
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
    }),
  }),
});

export const { useGetTaskBoardsQuery, useGetTaskBoardQuery } = api;
