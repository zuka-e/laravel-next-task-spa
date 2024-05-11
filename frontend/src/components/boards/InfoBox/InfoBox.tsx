import { memo } from 'react';
import Router from 'next/router';

import { skipToken } from '@reduxjs/toolkit/query';
import { CardContent, IconButton, Skeleton, Stack } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { clsx } from 'clsx';

import type { TaskBoard, TaskCard, TaskList } from '@/models';
import {
  useGetTaskBoardQuery,
  useGetTaskListQuery,
  useGetTaskCardQuery,
} from '@/store/api';
import { repeatMap } from '@/utils';
import { useRoute } from '@/utils/hooks';
import { TaskBoardDetails, TaskCardDetails, TaskListDetails } from '.';

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
 * Show the details of the specified task data by setting a query parameter.
 */
export const showTaskListDetails = (id: TaskList['id']): void => {
  setTaskDetailsQuery('l', id);
};

/**
 * Show the details of the specified task data by setting a query parameter.
 */
export const showTaskCardDetails = (id: TaskCard['id']): void => {
  setTaskDetailsQuery('c', id);
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

const InfoBox = memo(function InfoBox(props: JSX.IntrinsicElements['div']) {
  const { className, ...divProps } = props;
  const taskDetailsQuery = useGetTaskDetailsQuery();

  if (!taskDetailsQuery) {
    return <div className="w-0" />;
  }

  const { type, data, isLoading } = taskDetailsQuery;

  const renderInfoBox = (): JSX.Element => {
    if (!data) {
      return <></>;
    }

    const { isDeleted } = data.data;

    if (isDeleted) {
      hideTaskDetails();
    }

    switch (type) {
      case 'b':
        return <TaskBoardDetails board={data.data} />;
      case 'l':
        return <TaskListDetails list={data.data} />;
      case 'c':
        return <TaskCardDetails card={data.data} />;
      default:
        throw new Error('Unexpected Error.');
    }
  };

  return (
    <div
      className={clsx('sticky top-16 w-full shadow transition-all', className)}
      {...divProps}
    >
      <CardContent className="absolute h-full w-full">
        <div className="absolute right-2 top-2 z-20 w-fit rounded bg-white p-1">
          <IconButton aria-label="close" onClick={hideTaskDetails}>
            <CloseIcon />
          </IconButton>
        </div>
        {isLoading ? (
          <Stack spacing={2} className="ml-4 mr-10">
            {repeatMap(15, (i) => (
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
