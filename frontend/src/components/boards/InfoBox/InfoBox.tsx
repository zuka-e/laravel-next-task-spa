import { useEffect, useRef } from 'react';

import theme from '@/theme';
import { TaskBoard, TaskList, TaskCard } from '@/models';
import { removeInfoBox } from '@/store/slices/taskBoardSlice';
import { useAppDispatch, useDeepEqualSelector } from '@/utils/hooks';
import { TaskBoardDetails, TaskListDetails, TaskCardDetails } from '.';

const InfoBox = (props: JSX.IntrinsicElements['div']) => {
  const { className, ...divProps } = props;
  const dispatch = useAppDispatch();
  const currentState = useDeepEqualSelector((state) => state.boards.infoBox);
  const timeoutRef = useRef(0);

  useEffect(() => {
    if (currentState.open) {
      return;
    }

    /** `close`後`transition`動作を待機してから`remove` */
    timeoutRef.current = window.setTimeout(() => {
      dispatch(removeInfoBox());
    }, theme.transitions.duration.standard);
  }, [dispatch, currentState.open]);

  useEffect(() => {
    return function cleanup() {
      window.clearTimeout(timeoutRef.current);
      dispatch(removeInfoBox());
    };
  }, [dispatch]);

  const renderInfoBox = () => {
    switch (currentState.model) {
      case 'board':
        return <TaskBoardDetails board={currentState.data as TaskBoard} />;
      case 'list':
        return <TaskListDetails list={currentState.data as TaskList} />;
      case 'card':
        return <TaskCardDetails card={currentState.data as TaskCard} />;
    }
  };

  return (
    <div
      className={
        'relative w-full min-w-0 overflow-hidden shadow transition-all' +
        (className ? ` ${className} ` : ' ') +
        (currentState.open ? 'max-w-full' : 'max-w-0')
      }
      {...divProps}
    >
      {currentState.model ? (
        <div className="absolute h-full w-full [&>*]:overflow-y-auto">
          {renderInfoBox()}
        </div>
      ) : (
        <h2 className="text-center">There is no content</h2>
      )}
    </div>
  );
};

export default InfoBox;
