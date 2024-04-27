import { makePath } from '@/utils/api';
import baseApi from './baseApi';
import type {
  CreateTaskListRequest,
  CreateTaskListResponse,
  FetchTaskListsRequest,
  FetchTaskListsResponse,
} from './types';

/**
 * @see https://redux-toolkit.js.org/rtk-query/api/created-api/code-splitting
 */
const api = baseApi.injectEndpoints({
  // cf. https://redux-toolkit.js.org/rtk-query/usage/code-splitting
  overrideExisting: false,
  endpoints: (builder) => ({
    /** Gets task lists belonging to the specified board */
    getTaskLists: builder.query<FetchTaskListsResponse, FetchTaskListsRequest>({
      query: ({ boardId, page, limit }) => ({
        url: makePath(['task-boards', boardId], ['task-lists']),
        params: { page, limit },
      }),
      // cf. https://redux-toolkit.js.org/rtk-query/api/createApi#merge
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { boardId } = queryArgs;
        // Sole cache key per board  (cf. usual cache key format)
        // It allow data to be added to the sole cache across all pages
        return `${endpointName}(${JSON.stringify({ boardId })})`;
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

        return currentArg !== previousArg;
      },
    }),
    createTaskList: builder.mutation<
      CreateTaskListResponse,
      CreateTaskListRequest
    >({
      query: ({ boardId, ...data }) => ({
        url: makePath(['task-boards', boardId], ['task-lists']),
        method: 'POST',
        data,
      }),
      // cf. https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#pessimistic-updates
      onQueryStarted: async ({ boardId }, { dispatch, queryFulfilled }) => {
        try {
          const {
            data: { data: newTaskList },
          } = await queryFulfilled;

          // Adds new data to the per-board cache instead of invalidating the `LIST` cache.
          dispatch(
            api.util.updateQueryData('getTaskLists', { boardId }, (draft) => {
              draft.data.push(newTaskList);
            })
          );
        } catch (e) {
          //
        }
      },
    }),
  }),
});

export const { useGetTaskListsQuery, useCreateTaskListMutation } = api;
