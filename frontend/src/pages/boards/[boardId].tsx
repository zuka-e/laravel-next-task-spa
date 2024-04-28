import { memo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';

import { skipToken } from '@reduxjs/toolkit/query';
import {
  Container,
  Grid,
  Divider,
  IconButton,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

import { repeatMap } from '@/utils';
import { makeIndexMap } from '@/utils/dnd';
import { useIntersectionObserver, useRoute } from '@/utils/hooks';
import {
  useGetTaskBoardQuery,
  useGetTaskListsQuery,
  useUpdateTaskBoardMutation,
} from '@/store/api';
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
  const [updateTaskBoard] = useUpdateTaskBoardMutation();
  const [page, setPage] = useState(1);

  const { data: { data: board } = {} } = useGetTaskBoardQuery(
    pathParams ? { id: pathParams['boardId'] ?? '' } : skipToken
  );

  const { data: paginatedList, isLoading: isLoadingLists } =
    useGetTaskListsQuery(
      pathParams
        ? { boardId: pathParams['boardId'], page, limit: 10 }
        : skipToken
    );

  if (board?.isDeleted) {
    router.replace('/boards');
  }

  const nextListRef = useIntersectionObserver((): void => {
    setPage((paginatedList?.meta.current_page || 0) + 1);
  });

  const handleDrop = () => {
    if (!board) {
      return;
    }

    const listIndexMap = makeIndexMap(board.lists);
    const cardIndexMap = board.lists.reduce((acc, list) => {
      return { ...acc, ...makeIndexMap(list.cards) };
    }, {});

    updateTaskBoard({ id: board.id, listIndexMap, cardIndexMap });
  };

  return (
    <>
      <Head>
        <title>{board?.title ?? 'Loading...'}</title>
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
            {board ? (
              <>
                <Grid item className="mx-4 my-2 flex-auto">
                  <EditableTitle method="PATCH" model="board" data={board} />
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
                    <BoardMenu board={board} />
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
          <Grid container className="flex-auto flex-nowrap justify-between">
            <Grid
              container
              onDrop={handleDrop}
              wrap="nowrap"
              className="overflow-x-auto [&>div]:w-80 [&>div]:flex-shrink-0 [&>div]:p-2"
            >
              {isLoadingLists
                ? repeatMap(5, (i) => (
                    <div key={i}>
                      <Skeleton variant="rounded" className="h-full w-full" />
                    </div>
                  ))
                : paginatedList?.data.map((list, i) => (
                    <Grid item key={list.id} id={list.id}>
                      <TaskList list={list} listIndex={i} />
                    </Grid>
                  ))}
              {paginatedList?.links.next && (
                <Grid item>
                  <CircularProgress ref={nextListRef} />
                </Grid>
              )}
              {board && (
                <Grid item>
                  <AddTaskButton method="POST" model="list" parent={board} />
                </Grid>
              )}
            </Grid>
            <InfoBox className="max-md:flex-shrink-0" />
          </Grid>
        </Container>
      </BaseLayout>
    </>
  );
});

export default TaskBoard;
