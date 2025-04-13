import { API_ENDPOINTS } from '@/config/api';
import {
  getTagsForList,
  getTagsForPartialList,
} from '@/store/api/utils/caching';
import { buildPath } from '@/utils/api/url';
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
  UpdateTaskBoardRequest,
  UpdateTaskBoardResponse,
} from './types';

const getOrderedCards = <T extends { id: string }>(
  cards: Record<string, T>,
  cardIds: string[],
) => {
  return cardIds.reduce<T[]>((acc, cardId) => {
    const card = cards[cardId];

    if (card) {
      acc.push(card);
    }

    return acc;
  }, []);
};

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

        const allCards = res.data.cards.reduce<
          FetchKanbanBoardTransformedResponse['data']['allCards']
        >((acc, card) => {
          acc[card.id] = card;
          return acc;
        }, {});

        res.data.lists.forEach((list) => {
          kanbanBoard.lists[list.id] = {
            ...list,
            cards: getOrderedCards(allCards, list.cardIds ?? []),
          };
        });

        return {
          ...res,
          data: { ...res.data, kanbanBoard, allCards },
        };
      },
    }),
    moveTaskCard: builder.mutation<MoveTaskCardResponse, MoveTaskCardRequest>({
      query: ({
        boardId,
        srcListId,
        destListId,
        srcIndex,
        destIndex,
        cardId,
      }) => ({
        url: buildPath(API_ENDPOINTS.TASKS.BOARDS.MOVE_CARD, {
          boardId,
        }),
        method: 'POST',
        data: {
          cardId,
          srcListId,
          srcIndex,
          destListId,
          destIndex,
        },
      }),
      onQueryStarted: async (
        { boardId, srcListId, destListId, srcIndex, destIndex, cardId },
        { dispatch, queryFulfilled },
      ) => {
        // cf. https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#optimistic-updates
        const patchResult = dispatch(
          api.util.updateQueryData(
            'getKanbanBoard',
            { id: boardId },
            (draft) => {
              const srcList = draft.data.kanbanBoard.lists[srcListId];

              const destList =
                srcListId === destListId
                  ? srcList
                  : draft.data.kanbanBoard.lists[destListId];

              if (!srcList || !destList) {
                throw new Error('srcList or destList is undefined');
              }

              if (srcListId === destListId) {
                if (srcIndex === destIndex) {
                  return;
                }

                const list = draft.data.kanbanBoard.lists[destListId];

                if (!list) {
                  return;
                }

                const destCardIds = [...(destList.cardIds ?? [])];
                const [removedCardId] = destCardIds.splice(srcIndex, 1);
                destCardIds.splice(destIndex, 0, removedCardId ?? '');

                list.cardIds = destCardIds;
                list.cards = getOrderedCards(draft.data.allCards, destCardIds);
              } else {
                const srcList = draft.data.kanbanBoard.lists[srcListId];
                const destList = draft.data.kanbanBoard.lists[destListId];
                const card = draft.data.allCards[cardId];

                if (!(srcList && destList && card)) {
                  return;
                }

                const srcCardIds = [...(srcList.cardIds ?? [])];
                const [removedCardId] = srcCardIds.splice(srcIndex, 1);

                const destCardIds = [...(destList.cardIds ?? [])];
                destCardIds.splice(destIndex, 0, removedCardId ?? '');

                card.listId = destListId;

                srcList.cardIds = srcCardIds;
                srcList.cards = getOrderedCards(
                  draft.data.allCards,
                  srcCardIds,
                );

                destList.cardIds = destCardIds;
                destList.cards = getOrderedCards(
                  draft.data.allCards,
                  destCardIds,
                );
              }
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
  }),
});

export const {
  useGetTaskBoardsQuery,
  useCreateTaskBoardMutation,
  useGetTaskBoardQuery,
  useGetKanbanBoardQuery,
  useUpdateTaskBoardMutation,
  useDestroyTaskBoardMutation,
  useMoveTaskCardMutation,
} = api;
