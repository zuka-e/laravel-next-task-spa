import { memo } from 'react';

import { CardContent, IconButton, Skeleton, Stack } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { clsx } from 'clsx';

import { repeatMap } from '@/utils';
import { useGetTaskDetailsQuery, useTaskDetails } from '@/lib/hooks';
import { TaskBoardDetails, TaskCardDetails, TaskListDetails } from '.';

const InfoBox = memo(function InfoBox(props: JSX.IntrinsicElements['div']) {
  const { className, ...divProps } = props;
  const taskDetailsQuery = useGetTaskDetailsQuery();
  const { hideTaskDetails } = useTaskDetails();

  if (!taskDetailsQuery) {
    return <div className="w-0" />;
  }

  const { type, data, isFetching } = taskDetailsQuery;

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
        {isFetching ? (
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
