import { type Recipe } from '@reduxjs/toolkit/dist/query/core/buildThunks';

import type { TaskCard } from '@/models';
import { useAppDispatch } from '@/utils/hooks';
import { makePath } from '@/utils/api';
import baseApi from './baseApi';
import type {
  CreateTaskCardRequest,
  CreateTaskCardResponse,
  DestroyTaskCardRequest,
  DestroyTaskCardResponse,
  FetchTaskCardRequest,
  FetchTaskCardResponse,
  FetchTaskCardsRequest,
  FetchTaskCardsResponse,
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
    /** Gets task cards belonging to the specified list */
    getTaskCards: builder.query<FetchTaskCardsResponse, FetchTaskCardsRequest>({
      query: ({ listId, page, limit }) => ({
        url: makePath(['task-lists', listId], ['task-cards']),
        params: { page, limit },
      }),
      // cf. https://redux-toolkit.js.org/rtk-query/api/createApi#merge
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { listId } = queryArgs;
        // Sole cache key per board  (cf. usual cache key format)
        // It allow data to be added to the sole cache across all pages
        return `${endpointName}(${JSON.stringify({ listId })})`;
      },
      // cf. https://redux-toolkit.js.org/rtk-query/api/createApi#merge
      merge: (current, incoming) => {
        // While task data are merged, the rest are replaced.
        return {
          ...incoming,
          data: [...current.data, ...incoming.data],
        };
      },
      // cf. https://redux-toolkit.js.org/rtk-query/api/createApi#merge
      // cf. https://redux-toolkit.js.org/rtk-query/api/createApi#forcerefetch
      forceRefetch({ currentArg, previousArg }) {
        // Prevents from fetching duplicate data.
        if ((currentArg?.page ?? 0) <= (previousArg?.page ?? 0)) {
          return false;
        }

        return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
      },
    }),
    createTaskCard: builder.mutation<
      CreateTaskCardResponse,
      CreateTaskCardRequest
    >({
      query: ({ listId, ...data }) => ({
        url: makePath(['task-lists', listId], ['task-cards']),
        method: 'POST',
        data,
      }),
      // cf. https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#pessimistic-updates
      onQueryStarted: async ({ listId }, { dispatch, queryFulfilled }) => {
        const {
          data: { data: newTaskCard },
        } = await queryFulfilled;

        // Adds new data to the per-board cache instead of invalidating the `LIST` cache.
        dispatch(
          updateTaskCards(listId, (draft) => {
            draft.data.push(newTaskCard);
          })
        );
      },
    }),
    getTaskCard: builder.query<FetchTaskCardResponse, FetchTaskCardRequest>({
      query: ({ id }) => ({
        url: makePath(['task-cards', id]),
      }),
      providesTags: (res, _err, _req) => {
        return [{ type: 'TaskCard', id: res?.data.id }];
      },
    }),
    updateTaskCard: builder.mutation<
      UpdateTaskCardResponse,
      UpdateTaskCardRequest
    >({
      query: ({ id, ...data }) => ({
        url: makePath(['task-cards', id]),
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (_req, { dispatch, queryFulfilled }) => {
        const {
          data: { data: updatedTaskCard },
        } = await queryFulfilled;
        const { listId } = updatedTaskCard;

        // Replace cache instead of invalidating the cache.
        dispatch(
          updateTaskCards(listId, (draft) => {
            const current = draft.data.find(
              (card) => card.id === updatedTaskCard.id
            );

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Object.assign(current!, updatedTaskCard);
          })
        );
      },
      invalidatesTags: (res) => {
        return res ? [{ type: 'TaskCard', id: res.data.id }] : [];
      },
    }),
    destroyTaskCard: builder.mutation<
      DestroyTaskCardResponse,
      DestroyTaskCardRequest
    >({
      query: ({ id }) => ({
        url: makePath(['task-cards', id]),
        method: 'DELETE',
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        const {
          data: { data: deletedTaskCard },
        } = await queryFulfilled;
        const { listId } = deletedTaskCard;

        // Replace cache instead of invalidating the cache.
        dispatch(
          updateTaskCards(listId, (draft) => {
            const i = draft.data.findIndex((card) => card.id === id);
            draft.data.splice(i, 1);
          })
        );

        // Don't invalidate tag to avoid unintended refetching resulting in 404.
        dispatch(
          api.util.updateQueryData('getTaskCard', { id }, (draft) => {
            draft.data.isDeleted = true;
          })
        );
      },
    }),
  }),
});

/**
 * Create an action to update task cards
 *
 * @param listId Parent list ID
 * @param recipe Callback to update task cards
 * @returns Action
 */
const updateTaskCards = (
  listId: FetchTaskCardsRequest['listId'],
  recipe: Recipe<FetchTaskCardsResponse>
) => {
  return api.util.updateQueryData('getTaskCards', { listId }, recipe);
};

export const {
  useGetTaskCardsQuery,
  useCreateTaskCardMutation,
  useGetTaskCardQuery,
  useUpdateTaskCardMutation,
  useDestroyTaskCardMutation,
} = api;

export const useMoveCard = () => {
  const dispatch = useAppDispatch();

  const moveCard = (
    data: TaskCard,
    srcListId: TaskCard['listId'],
    destListId: TaskCard['listId'],
    srcIndex: number,
    destIndex: number
  ) => {
    if (srcListId === destListId) {
      if (srcIndex === destIndex) {
        return;
      }

      const move = updateTaskCards(destListId, (draft) => {
        draft.data.splice(srcIndex, 1);
        draft.data.splice(destIndex, 0, { ...data });
      });

      dispatch(move);
    } else {
      const remove = updateTaskCards(srcListId, (draft) => {
        draft.data.splice(srcIndex, 1);
      });

      const add = updateTaskCards(destListId, (draft) => {
        draft.data.splice(destIndex, 0, { ...data });
      });

      dispatch(remove);
      dispatch(add);
    }
  };

  return { moveCard };
};
