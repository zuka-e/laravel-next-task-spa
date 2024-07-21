import { memo } from 'react';

import { Card, CardContent, IconButton, Skeleton, Stack } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { repeatMap } from '@/utils';
import { useGetTaskDetailsQuery, useTaskDetails } from '@/lib/hooks';
import { TaskBoardDetails, TaskCardDetails, TaskListDetails } from '.';

const InfoBox = memo(function InfoBox() {
  const taskDetailsQuery = useGetTaskDetailsQuery();
  const { hideTaskDetails } = useTaskDetails();

  if (!taskDetailsQuery) {
    return <Card className="w-0" />;
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
    <Card elevation={7} className="ml-auto w-full transition-all md:w-6/12">
      <CardContent className="sticky top-16 z-10 h-full max-h-screen bg-white">
        <div className="absolute right-2 top-2 z-20 w-fit rounded p-1">
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
    </Card>
  );
});

export default InfoBox;
