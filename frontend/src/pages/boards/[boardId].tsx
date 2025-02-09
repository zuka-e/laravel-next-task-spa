import { memo, type JSX, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';

import type { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/types';
import {
  monitorForElements,
  type ElementDragPayload,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { skipToken } from '@reduxjs/toolkit/query';
import { Container, Grid, Divider, IconButton, Skeleton } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

import { useRoute } from '@/utils/hooks';
import { getDropTarget, isDraggableItem } from '@/lib/dnd/entities';
import {
  useCreateTaskListMutation,
  useGetKanbanBoardQuery,
  useUpdateTaskBoardMutation,
  useMoveTaskCardMutation,
} from '@/store/api';
import { isNotFoundError } from '@/store/api/utils/errors';
import { BaseLayout } from '@/layouts';
import { PopoverControl } from '@/templates';
import { AddTaskButton, EditableTitle, SearchField } from '@/components/boards';
import { BoardMenu } from '@/components/boards/TaskBoard';
import { TaskList } from '@/components/boards/TaskList';
import { InfoBox } from '@/components/boards/InfoBox';
import type { AuthPage } from '@/routes';

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
  const [
    createTaskList,
    { isLoading: isLoadingToCreate, error: creationError },
  ] = useCreateTaskListMutation();
  const [
    updateTaskBoard,
    { isLoading: isLoadingToUpdate, error: updateError },
  ] = useUpdateTaskBoardMutation();
  const [moveTaskCard] = useMoveTaskCardMutation();

  const { data: { data: { kanbanBoard = undefined } = {} } = {}, error } =
    useGetKanbanBoardQuery(
      pathParams ? { id: pathParams['boardId'] ?? '' } : skipToken
    );

  if (isNotFoundError(error)) {
    router.replace('/boards');
  }

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

      /** Destination card if dropped on it */
      const destCard = getDropTarget(dest.dropTargets, 'item');
      const destList = getDropTarget(dest.dropTargets, 'column');

      if (!destList) {
        throw new Error('Destination column is not found.');
      }

      /** Dropped area of the destination element */
      // ※ Added by `attachClosestEdge()`
      const closestEdge = destCard ? null : extractClosestEdge(destList.data);

      const destIndex = destCard
        ? destCard.data.index
        : closestEdge === 'top'
        ? 0
        : kanbanBoard?.lists?.[destList.data.id]?.cards.length ?? 0;

      moveTaskCard({
        boardId: pathParams?.['boardId'] ?? '',
        srcListId: source.data.parentId!,
        destListId: destList.data.id,
        srcIndex: source.data.index,
        destIndex,
        cardId: source.data.id,
      });
    },
    [kanbanBoard, moveTaskCard, pathParams]
  );

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
              container
              wrap="nowrap"
              className="absolute inset-0 overflow-x-auto [&>div]:w-80 [&>div]:flex-shrink-0 [&>div]:p-2"
            >
              {Object.values(kanbanBoard?.lists ?? {}).map((list, i) => (
                <Grid item key={list.id} id={list.id}>
                  <TaskList list={list} index={i} />
                </Grid>
              ))}
              {kanbanBoard && (
                <Grid item>
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
