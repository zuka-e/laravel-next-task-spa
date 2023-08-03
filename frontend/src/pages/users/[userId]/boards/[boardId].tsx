import { useEffect } from 'react';
import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';

import { Container, Grid, Divider, IconButton } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

import { makeIndexMap } from '@/utils/dnd';
import { useAppDispatch, useDeepEqualSelector, useRoute } from '@/utils/hooks';
import {
  FetchTaskBoardRequest,
  fetchTaskBoard,
  updateTaskBoard,
} from '@/store/thunks/boards';
import { BaseLayout, StandbyScreen } from '@/layouts';
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

const TaskBoard = () => {
  const { pathParams } = useRoute();

  const dispatch = useAppDispatch();
  const board = useDeepEqualSelector(
    (state) => state.boards.docs[pathParams?.boardId || '']
  );

  useEffect(() => {
    if (!pathParams) {
      return;
    }

    const request: FetchTaskBoardRequest = {
      userId: pathParams.userId,
      boardId: pathParams.boardId,
    };
    dispatch(fetchTaskBoard(request));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathParams]);

  const handleDrop = () => {
    const listIndexMap = makeIndexMap(board.lists);
    const cardIndexMap = board.lists.reduce((acc, list) => {
      return { ...acc, ...makeIndexMap(list.cards) };
    }, {});

    dispatch(updateTaskBoard({ id: board.id, listIndexMap, cardIndexMap }));
  };

  if (!board) return <StandbyScreen />;

  return (
    <>
      <Head>
        <title>{board.title}</title>
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
            <Grid item className="mx-4 my-2 flex-auto">
              <EditableTitle
                method="PATCH"
                model="board"
                data={board}
                disableMargin
                inputStyle="text-2xl"
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
                <BoardMenu board={board} />
              </PopoverControl>
            </Grid>
          </Grid>
          <Divider />
          <Grid container className="flex-auto flex-nowrap justify-between">
            <Grid
              container
              onDrop={handleDrop}
              wrap="nowrap"
              className="overflow-x-auto [&>div]:w-80 [&>div]:flex-shrink-0 [&>div]:p-2"
            >
              {board.lists?.map((list, i) => (
                <Grid item key={list.id} id={list.id}>
                  <TaskList list={list} listIndex={i} />
                </Grid>
              ))}
              <Grid item>
                <AddTaskButton method="POST" model="list" parent={board} />
              </Grid>
            </Grid>
            <InfoBox className="max-md:flex-shrink-0" />
          </Grid>
        </Container>
      </BaseLayout>
    </>
  );
};

export default TaskBoard;
