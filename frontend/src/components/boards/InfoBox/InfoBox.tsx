import { memo } from 'react';

import { skipToken } from '@reduxjs/toolkit/dist/query';
import { CardContent } from '@mui/material';

import { useGetTaskBoardQuery } from '@/store/api';
import { useRoute } from '@/utils/hooks';
import { TaskBoardDetails } from '.';

const InfoBox = memo(function InfoBox(props: JSX.IntrinsicElements['div']) {
  const { className, ...divProps } = props;
  const { queryParams } = useRoute();

  const params = queryParams?.['details']?.toString().split(':');
  const type = params?.[0];
  const id = params?.[1] ?? '';

  const {
    data: taskBoardResponse,
    isLoading,
    isUninitialized,
  } = useGetTaskBoardQuery(type === 'b' ? { id } : skipToken);

  const renderInfoBox = (): JSX.Element => {
    if (isUninitialized) {
      return <></>;
    }

    if (taskBoardResponse) {
      return <TaskBoardDetails board={taskBoardResponse.data} />;
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
        {isLoading ? <></> : renderInfoBox()}
      </CardContent>
    </div>
  );
});

export default InfoBox;
