import { memo, useCallback, useEffect, useMemo, useRef, type JSX } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import {
  monitorForElements,
  type ElementDragPayload,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/types';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Container, Divider, Grid, IconButton, Skeleton } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import { Virtualizer } from 'virtua';

import { AddTaskButton, EditableTitle, SearchField } from '@/components/boards';
import { InfoBox } from '@/components/boards/InfoBox';
import { BoardMenu } from '@/components/boards/TaskBoard';
import { TaskList } from '@/components/boards/TaskList';
import { BaseLayout } from '@/layouts';
import { getDestIndex, getDropTarget } from '@/lib/dnd';
import { isDraggableItem } from '@/lib/dnd/entities';
import { useScrollable } from '@/lib/dnd/hooks';
import type { AuthPage } from '@/routes';
import {
  useCreateTaskListMutation,
  useGetKanbanBoardQuery,
  useMoveTaskCardMutation,
  useMoveTaskListMutation,
  useUpdateTaskBoardMutation,
} from '@/store/api';
import { isNotFoundError } from '@/store/api/utils/errors';
import { PopoverControl } from '@/templates';
import { useDeepEqualSelector, useRoute } from '@/utils/hooks';
import { getOrderedArray } from '@/utils/sort';

type TaskBoardProps = AuthPage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<TaskBoardProps> = async () => {
  return {
    props: {
      auth: true,
    },
    revalidate: 10,
  };
};

const TaskBoard = memo(function TaskBoard(): JSX.Element {
  const router = useRouter();
  const { pathParams } = useRoute();

  const boardId = useMemo(() => {
    return pathParams?.['boardId'] ?? '';
  }, [pathParams]);

  const searchState = useDeepEqualSelector(
    (state) => state.taskBoard.data[boardId]?.search,
  );

  const scrollableRef = useRef<HTMLDivElement>(null);
  const [
    createTaskList,
    { isLoading: isLoadingToCreate, error: creationError },
  ] = useCreateTaskListMutation();
  const [
    updateTaskBoard,
    { isLoading: isLoadingToUpdate, error: updateError },
  ] = useUpdateTaskBoardMutation();
  const [moveTaskList] = useMoveTaskListMutation();
  const [moveTaskCard] = useMoveTaskCardMutation();

  const { data: { data: { kanbanBoard = undefined } = {} } = {}, error } =
    useGetKanbanBoardQuery(pathParams ? { id: boardId } : skipToken);

  if (isNotFoundError(error)) {
    router.replace('/boards');
  }

  const orderedLists = useMemo(() => {
    if (!kanbanBoard) return [];

    const key = searchState?.sort?.key;
    const direction = searchState?.sort?.direction;

    return !key
      ? getOrderedArray(kanbanBoard.lists, { ids: kanbanBoard.listIds })
      : getOrderedArray(kanbanBoard.lists, { key: key as never, direction });
  }, [kanbanBoard, searchState?.sort?.direction, searchState?.sort?.key]);

  const handleDrop = useCallback(
    async ({
      source,
      location,
    }: {
      source: ElementDragPayload;
      location: DragLocationHistory;
    }) => {
      if (!isDraggableItem(source.data)) return;

      const dest = location.current;

      // Non-droppable area
      if (dest.dropTargets.length === 0) {
        return;
      }

      // If draggable and droppable is the same
      if (dest.dropTargets[0]?.data['id'] === source.data.id) {
        return;
      }

      /** Destination card if dropped on it */
      const destCard = getDropTarget(dest.dropTargets, 'item');
      const destList = getDropTarget(dest.dropTargets, 'column')!;
      const srcIndex = source.data.index;

      /** Dropped area of the destination element */
      // ※ Added by `attachClosestEdge()`
      const closestEdge = destCard
        ? extractClosestEdge(destCard.data)
        : extractClosestEdge(destList.data);

      if (source.data['type'] === 'column') {
        const destIndex = getDestIndex({
          srcIndex,
          targetIndex: destList.data.index,
          closestEdge,
          axis: 'horizontal',
        });

        if (srcIndex === destIndex) {
          return;
        }

        moveTaskList({
          boardId,
          srcIndex,
          destIndex,
          listId: source.data.id,
          sort: searchState?.sort,
        });

        return;
      }

      const src = location.initial;
      const srcList = getDropTarget(src.dropTargets, 'column')!;

      const destIndex = getDestIndex({
        srcIndex: srcList.data.id === destList.data.id ? srcIndex : null,
        targetIndex: destCard?.data.index ?? null,
        closestEdge,
        axis: 'vertical',
      });

      if (srcList.data.id === destList.data.id && srcIndex === destIndex) {
        return;
      }

      moveTaskCard({
        boardId,
        src: {
          listId: srcList.data.id,
          index: srcIndex,
          sort: srcList.data.sort as never,
        },
        dest: {
          listId: destList.data.id,
          index: destIndex,
          sort: destList.data.sort as never,
        },
        cardId: source.data.id,
      });
    },
    [boardId, moveTaskCard, moveTaskList, searchState],
  );

  useScrollable({ scrollableRef, speed: 'fast' });

  useEffect(() => {
    return monitorForElements({
      onDrop: handleDrop,
    });
  }, [handleDrop]);

  return (
    <>
      <Head>
        <title>{kanbanBoard?.title ?? 'Loading...'}</title>
      </Head>
      <BaseLayout>
        <Container
          component="main"
          maxWidth={false}
          className="flex flex-auto flex-col py-4 pr-0"
        >
          <Grid
            container
            wrap="nowrap"
            justifyContent="space-between"
            alignItems="center"
            className="overflow-x-auto"
          >
            {kanbanBoard ? (
              <>
                <Grid item className="mx-4 my-2 flex-auto">
                  <EditableTitle
                    defaultValue={kanbanBoard.title}
                    disabled={isLoadingToUpdate}
                    error={updateError}
                    onSubmit={(data) =>
                      updateTaskBoard({ id: kanbanBoard.id, ...data })
                    }
                  />
                </Grid>
                <Grid item>
                  <SearchField />
                </Grid>
                <Grid item>
                  <PopoverControl
                    trigger={
                      <IconButton title="Menu" size="large">
                        <MoreVertIcon />
                      </IconButton>
                    }
                  >
                    <BoardMenu board={kanbanBoard} />
                  </PopoverControl>
                </Grid>
              </>
            ) : (
              <Grid item className="mx-4 my-2 flex-auto">
                <Skeleton variant="rounded" className="text-3xl" />
              </Grid>
            )}
          </Grid>
          <Divider />
          <Grid
            container
            className="relative flex-auto flex-nowrap justify-between"
          >
            <Grid
              ref={scrollableRef}
              container
              wrap="nowrap"
              className="absolute inset-0 overflow-x-auto"
            >
              <Virtualizer horizontal>
                {orderedLists.map((list, i) => (
                  <Grid
                    item
                    key={list.id}
                    id={list.id}
                    className="w-80 shrink-0 p-2"
                  >
                    <TaskList key={list.id} list={list} index={i} />
                  </Grid>
                ))}
              </Virtualizer>
              {kanbanBoard && (
                <Grid item className="w-80 shrink-0 p-2">
                  <AddTaskButton
                    disabled={isLoadingToCreate}
                    error={creationError}
                    onSubmit={(data) =>
                      createTaskList({ boardId: kanbanBoard.id, ...data })
                    }
                  />
                </Grid>
              )}
            </Grid>
            <InfoBox />
          </Grid>
        </Container>
      </BaseLayout>
    </>
  );
});

export default TaskBoard;
