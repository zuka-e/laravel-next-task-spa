import { getTagsForPartialList } from '@/store/api/utils/caching';
import { makePath } from '@/utils/api';
import baseApi from './baseApi';
import type { FetchTaskListsRequest, FetchTaskListsResponse } from './types';

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
      providesTags: (res) => {
        return getTagsForPartialList(res?.data, 'TaskList');
      },
      // cf. https://redux-toolkit.js.org/rtk-query/api/createApi#merge
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
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

export const { useGetTaskListsQuery } = api;
