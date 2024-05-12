import { useRouter } from 'next/router';

import { skipToken } from '@reduxjs/toolkit/query';

import {
  useGetTaskBoardQuery,
  useGetTaskListQuery,
  useGetTaskCardQuery,
} from '@/store/api';
import { useRoute } from '@/utils/hooks';

/** The key of the query parameter that specifies. */
const QUERY_KEY = 'details' as const;

/** "Board" | "List" | "Card" */
type QueryType = 'b' | 'l' | 'c';

/**
 * Handle task details visibility.
 */
export const useTaskDetails = () => {
  const router = useRouter();

  /**
   * Show the details of the specified task data by setting a query parameter.
   */
  const showTaskDetails = (type: QueryType, id: string): void => {
    router.replace(
      {
        query: {
          ...router.query,
          [QUERY_KEY]: `${type}:${id}`,
        },
      },
      undefined,
      // cf. https://nextjs.org/docs/pages/building-your-application/routing/linking-and-navigating#shallow-routing
      { shallow: true }
    );
  };

  /**
   * Hide the details of tasks by removing the query parameter.
   */
  const hideTaskDetails = (): void => {
    const { [QUERY_KEY]: _, ...restQueryParams } = router.query;

    router.replace(
      {
        pathname: router.pathname,
        query: restQueryParams,
      },
      undefined,
      { shallow: true }
    );
  };

  /**
   * Determine the board(`b`), list(`l`), or card`c` details is displayed.
   */
  const isTaskSelected = (type: QueryType, id: string): boolean => {
    return router.query[QUERY_KEY] === `${type}:${id}`;
  };

  return {
    showTaskDetails,
    hideTaskDetails,
    isTaskSelected,
  };
};

/**
 * Get the details and the API state of tasks using the query parameter.
 */
export const useGetTaskDetailsQuery = () => {
  const { queryParams } = useRoute();

  const params = queryParams?.[QUERY_KEY]?.toString().split(':');
  const type = params?.[0] as QueryType | undefined;
  const id = params?.[1] ?? '';

  const boardQuery = useGetTaskBoardQuery(type === 'b' ? { id } : skipToken);
  const listQuery = useGetTaskListQuery(type === 'l' ? { id } : skipToken);
  const cardQuery = useGetTaskCardQuery(type === 'c' ? { id } : skipToken);

  switch (type) {
    case 'b':
      return { type, id, ...boardQuery };
    case 'l':
      return { type, id, ...listQuery };
    case 'c':
      return { type, id, ...cardQuery };
    default:
      return undefined;
  }
};
