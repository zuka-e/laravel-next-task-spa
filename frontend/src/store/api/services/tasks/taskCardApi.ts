import { makePath } from '@/utils/api';
import baseApi from './baseApi';
import type { FetchTaskCardsRequest, FetchTaskCardsResponse } from './types';

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

        return currentArg !== previousArg;
      },
    }),
  }),
});

export const { useGetTaskCardsQuery } = api;
