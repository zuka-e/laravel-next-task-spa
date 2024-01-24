import { memo } from 'react';
import Router from 'next/router';

import { skipToken } from '@reduxjs/toolkit/dist/query';
import { CardContent, IconButton, Skeleton, Stack } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import type { TaskBoard } from '@/models';
import { useGetTaskBoardQuery } from '@/store/api';
import { useRoute } from '@/utils/hooks';
import { TaskBoardDetails } from '.';

/** The key of the query parameter that specifies.  */
const QUERY_KEY = 'details' as const;

/** "Board" | "List" | "Card" */
type QueryType = 'b' | 'l' | 'c';

/**
 * Set a query parameter to show the details of the specified task data.
 */
const setTaskDetailsQuery = (type: QueryType, id: string): void => {
  Router.replace(
    {
      query: {
        ...Router.query,
        [QUERY_KEY]: `${type}:${id}`,
      },
    },
    undefined,
    // cf. https://nextjs.org/docs/pages/building-your-application/routing/linking-and-navigating#shallow-routing
    { shallow: true }
  );
};

/**
 * Show the details of the specified task data by setting a query parameter.
 */
export const showTaskBoardDetails = (id: TaskBoard['id']): void => {
  setTaskDetailsQuery('b', id);
};

/**
 * Hide the details of tasks by removing the query parameter.
 */
const hideTaskDetails = (): void => {
  const { [QUERY_KEY]: _, ...restQueryParams } = Router.query;

  Router.replace(
    {
      pathname: Router.pathname,
      query: restQueryParams,
    },
    undefined,
    { shallow: true }
  );
};

/**
 * Get the details and the API state of tasks using the query parameter.
 */
const useGetTaskDetailsQuery = () => {
  const { queryParams } = useRoute();

  const params = queryParams?.[QUERY_KEY]?.toString().split(':');
  const type = params?.[0] as QueryType | undefined;
  const id = params?.[1] ?? '';

  const boardQuery = useGetTaskBoardQuery(type === 'b' ? { id } : skipToken);

  switch (type) {
    case 'b':
      return { type, id, ...boardQuery };
    default:
      return undefined;
  }
};

const InfoBox = memo(function InfoBox(props: JSX.IntrinsicElements['div']) {
  const { className, ...divProps } = props;
  const taskDetailsQuery = useGetTaskDetailsQuery();

  if (!taskDetailsQuery) {
    return <></>;
  }

  const { type, data, isUninitialized, isLoading } = taskDetailsQuery;

  const renderInfoBox = (): JSX.Element => {
    if (isLoading || isUninitialized) {
      return <></>;
    }

    if (type === 'b' && data) {
      return <TaskBoardDetails board={data.data} />;
    }

    throw new Error('Unexpected Error.');
  };

  return (
    <div
      className={
        'relative w-full min-w-0 overflow-hidden shadow transition-all' +
        (className ? ` ${className} ` : ' ') +
        (isLoading || !isUninitialized ? 'max-w-full' : 'max-w-0')
      }
      {...divProps}
    >
      <CardContent className="absolute h-full w-full [&>*]:overflow-y-auto">
        <IconButton
          aria-label="close"
          onClick={hideTaskDetails}
          className="absolute right-3 top-3 z-20"
        >
          <CloseIcon />
        </IconButton>
        {isLoading ? (
          <Stack spacing={2} className="ml-4 mr-10">
            {Array.from({ length: 10 }, (_, i) => i).map((i) => (
              <Skeleton key={i} variant="text" className="text-2xl" />
            ))}
          </Stack>
        ) : (
          renderInfoBox()
        )}
      </CardContent>
    </div>
  );
});

export default InfoBox;
