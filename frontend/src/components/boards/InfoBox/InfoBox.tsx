import { useEffect } from 'react';

import { ClickAwayListener } from '@mui/material';
import type { ClickAwayListenerProps } from '@mui/material';

import theme from 'theme';
import { TaskBoard, TaskList, TaskCard } from 'models';
import { closeInfoBox, removeInfoBox } from 'store/slices/taskBoardSlice';
import { useAppDispatch, useDeepEqualSelector, usePrevious } from 'utils/hooks';
import {
  deactivateEventAttr,
  isIgnoredTarget,
  isItself,
  hasChanged,
} from 'utils/infoBox';
import { TaskBoardDetails, TaskListDetails, TaskCardDetails } from '.';

const InfoBox = (props: JSX.IntrinsicElements['div']) => {
  const { className, ...divProps } = props;
  const dispatch = useAppDispatch();
  const currentState = useDeepEqualSelector((state) => state.boards.infoBox);
  const previousState = usePrevious(
    currentState.model ? currentState : undefined
  );

  useEffect(() => {
    if (!previousState) return; // `open`を実行していない(`prev`が存在していない)場合
    if (currentState.open) return; // `close`されていない場合
    if (!currentState.model) return; // 既に`remove`されている場合

    /** `close`後`transition`動作を待機してから`remove` */
    const timeoutId = setTimeout(() => {
      dispatch(removeInfoBox());
    }, theme.transitions.duration.standard);

    /** Prevent memory leaks */
    return function cleanup() {
      clearTimeout(timeoutId);
    };
  }, [dispatch, previousState, currentState.open, currentState.model]);

  useEffect(() => {
    return function cleanup() {
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
          <Wrapper>{renderInfoBox()}</Wrapper>
        </div>
      ) : (
        <h2 className="text-center">There is no content</h2>
      )}
    </div>
  );
};

/**
 * 要素外のクリックで`open`状態を解除する機能を付与するためのラッパー。
 */
const Wrapper = (props: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const currentState = useDeepEqualSelector(
    (state) => state.boards.infoBox.data
  );
  const state = {
    current: currentState,
    prev: usePrevious(currentState) || currentState,
  };

  /**
   *  以下の場合`open`を解除しない
   *
   * - 自身のデータを表示する操作
   * - 別のデータを表示する操作
   * - 事前に指定された要素のクリック
   */
  const handleClickAway: ClickAwayListenerProps['onClickAway'] = (event) => {
    if (isItself()) {
      deactivateEventAttr('shown');
      return;
    }
    if (hasChanged(state.current, state.prev)) {
      state.prev = state.current;
      return;
    }
    if (isIgnoredTarget(event.target as HTMLElement)) return;

    dispatch(closeInfoBox());
  };

  return (
    <ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleClickAway}>
      <div className="infoWrapper">{props.children}</div>
    </ClickAwayListener>
  );
};

export default InfoBox;
