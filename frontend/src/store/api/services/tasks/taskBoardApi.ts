import { API_ENDPOINTS } from '@/config/api';
import {
  getTagsForList,
  getTagsForPartialList,
} from '@/store/api/utils/caching';
import { setSortByList } from '@/store/slices';
import { buildPath } from '@/utils/api/url';
import { arrayToObjectById } from '@/utils/array';
import { getOrderedArray, sortFn } from '@/utils/sort';
import baseApi from './baseApi';
import type {
  CreateTaskBoardRequest,
  CreateTaskBoardResponse,
  DestroyTaskBoardRequest,
  DestroyTaskBoardResponse,
  FetchKanbanBoardRequest,
  FetchKanbanBoardResponse,
  FetchKanbanBoardTransformedResponse,
  FetchTaskBoardRequest,
  FetchTaskBoardResponse,
  FetchTaskBoardsRequest,
  FetchTaskBoardsResponse,
  KanbanBoard,
  MoveTaskCardRequest,
  MoveTaskCardResponse,
  MoveTaskListRequest,
  MoveTaskListResponse,
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
        url: API_ENDPOINTS.TASKS.BOARDS.INDEX,
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
        url: API_ENDPOINTS.TASKS.BOARDS.CREATE,
        method: 'POST',
        data,
      }),
      invalidatesTags: () => getTagsForPartialList(undefined, 'TaskBoard'),
    }),
    getTaskBoard: builder.query<FetchTaskBoardResponse, FetchTaskBoardRequest>({
      query: (arg) => ({
        url: buildPath(API_ENDPOINTS.TASKS.BOARDS.SHOW, {
          boardId: arg.id,
        }),
      }),
      // cf. https://redux-toolkit.js.org/rtk-query/usage/mutations#revalidation-example
      providesTags: (res) => [{ type: 'TaskBoard', id: res?.data.id }],
    }),
    updateTaskBoard: builder.mutation<
      UpdateTaskBoardResponse,
      UpdateTaskBoardRequest
    >({
      query: ({ id, ...data }) => ({
        url: buildPath(API_ENDPOINTS.TASKS.BOARDS.UPDATE, {
          boardId: id,
        }),
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (res) => [{ type: 'TaskBoard', id: res?.data.id }],
    }),
    destroyTaskBoard: builder.mutation<
      DestroyTaskBoardResponse,
      DestroyTaskBoardRequest
    >({
      query: ({ id }) => ({
        url: buildPath(API_ENDPOINTS.TASKS.BOARDS.DESTROY, {
          boardId: id,
        }),
        method: 'DELETE',
      }),
      invalidatesTags: (res) => [{ type: 'TaskBoard', id: res?.data.id }],
    }),
    getKanbanBoard: builder.query<
      FetchKanbanBoardTransformedResponse,
      FetchKanbanBoardRequest
    >({
      query: (arg) => ({
        url: buildPath(API_ENDPOINTS.TASKS.BOARDS.AS_KANBAN, {
          boardId: arg.id,
        }),
      }),
      providesTags: (res) => {
        return [
          { type: 'TaskBoard', id: res?.data.board.id },
          ...getTagsForList(res?.data.lists, 'TaskList'),
          ...getTagsForList(res?.data.cards, 'TaskCard'),
        ];
      },
      transformResponse: (
        res: FetchKanbanBoardResponse,
      ): FetchKanbanBoardTransformedResponse => {
        const kanbanBoard: KanbanBoard = {
          ...res.data.board,
          lists: {},
        };

        const allCards = arrayToObjectById(res.data.cards);

        res.data.lists.forEach((list) => {
          kanbanBoard.lists[list.id] = {
            ...list,
            cards: getOrderedArray(allCards, { ids: list.cardIds }),
          };
        });

        return {
          ...res,
          data: { ...res.data, kanbanBoard, allCards },
        };
      },
    }),
    moveTaskList: builder.mutation<MoveTaskListResponse, MoveTaskListRequest>({
      query: ({ boardId, srcIndex, destIndex, listId, sort }) => ({
        url: buildPath(API_ENDPOINTS.TASKS.BOARDS.MOVE_LIST, {
          boardId,
        }),
        method: 'POST',
        data: {
          srcIndex,
          destIndex,
          listId,
          sort,
        },
      }),
      onQueryStarted: async (
        { boardId, srcIndex, destIndex, sort },
        { dispatch, queryFulfilled },
      ) => {
        // cf. https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#optimistic-updates
        const patchResult = dispatch(
          api.util.updateQueryData(
            'getKanbanBoard',
            { id: boardId },
            (draft) => {
              const kanbanBoard = draft.data.kanbanBoard;

              const orderedLists = sort?.key
                ? getOrderedArray(kanbanBoard.lists, {
                    key: sort.key as never,
                    direction: sort.direction,
                  })
                : null;

              const listIds = orderedLists?.map((card) => card.id) ?? [
                ...kanbanBoard.listIds,
              ];

              const [removedListId] = listIds.splice(srcIndex, 1);
              listIds.splice(
                destIndex === -1 ? listIds.length : destIndex,
                0,
                removedListId!,
              );

              kanbanBoard.listIds = listIds;
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    moveTaskCard: builder.mutation<MoveTaskCardResponse, MoveTaskCardRequest>({
      query: ({ boardId, src, dest, cardId }) => ({
        url: buildPath(API_ENDPOINTS.TASKS.BOARDS.MOVE_CARD, {
          boardId,
        }),
        method: 'POST',
        data: {
          src,
          dest,
          cardId,
        },
      }),
      onQueryStarted: async (
        { boardId, src, dest, cardId },
        { dispatch, queryFulfilled },
      ) => {
        // cf. https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#optimistic-updates
        const patchResult = dispatch(
          api.util.updateQueryData(
            'getKanbanBoard',
            { id: boardId },
            (draft) => {
              const srcList = draft.data.kanbanBoard.lists[src.listId];
              const destList = draft.data.kanbanBoard.lists[dest.listId];

              if (!srcList || !destList) {
                throw new Error('srcList or destList is undefined');
              }

              const orderedSrcCards = src.sort?.key
                ? srcList.cards.sort((a, b) =>
                    sortFn(a, b, {
                      key: src.sort!.key as keyof typeof a,
                      direction: src.sort!.direction,
                    }),
                  )
                : null;

              const orderedDestCards = dest.sort?.key
                ? destList.cards.sort((a, b) =>
                    sortFn(a, b, {
                      key: dest.sort!.key as keyof typeof a,
                      direction: dest.sort!.direction,
                    }),
                  )
                : null;

              const srcCardIds = orderedSrcCards
                ? orderedSrcCards.map((card) => card.id)
                : [...srcList.cardIds];

              const destCardIds =
                src.listId === dest.listId
                  ? srcCardIds
                  : orderedDestCards
                    ? orderedDestCards.map((card) => card.id)
                    : [...destList.cardIds];

              const [removedCardId] = srcCardIds.splice(src.index, 1);
              destCardIds.splice(
                dest.index === -1 ? destCardIds.length : dest.index,
                0,
                removedCardId!,
              );

              srcList.cardIds = srcCardIds;
              srcList.cards = getOrderedArray(draft.data.allCards, {
                ids: srcCardIds,
              });

              if (src.listId !== dest.listId) {
                const card = draft.data.allCards[cardId];

                if (!card) {
                  throw new Error('card is undefined');
                }

                draft.data.allCards = {
                  ...draft.data.allCards,
                  [cardId]: { ...card, listId: dest.listId },
                };

                destList.cardIds = destCardIds;
                destList.cards = getOrderedArray(draft.data.allCards, {
                  ids: destCardIds,
                });
              }
            },
          ),
        );

        try {
          await queryFulfilled;
          dispatch(setSortByList({ id: dest.listId, sort: undefined }));
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetTaskBoardsQuery,
  useCreateTaskBoardMutation,
  useGetTaskBoardQuery,
  useGetKanbanBoardQuery,
  useUpdateTaskBoardMutation,
  useDestroyTaskBoardMutation,
  useMoveTaskListMutation,
  useMoveTaskCardMutation,
} = api;
