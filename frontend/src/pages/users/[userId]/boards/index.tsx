import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';

import { Container, Grid, Card, Divider, Typography } from '@mui/material';
import { Pagination } from '@mui/material';

import { fetchTaskBoards } from 'store/thunks/boards';
import {
  useAppDispatch,
  useAppSelector,
  useDeepEqualSelector,
  useRoute,
} from 'utils/hooks';
import { BaseLayout, StandbyScreen } from 'layouts';
import { Link } from 'templates';
import { ButtonToAddTask } from 'components/boards';
import { BoardCardHeader } from 'components/boards/TaskBoard';
import type { AuthPage } from 'routes';

type TaskBoardIndexProps = AuthPage;

/**
 * @see https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
 * @see https://nextjs.org/docs/api-reference/data-fetching/get-static-paths
 */
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

/**
 * @see https://nextjs.org/docs/basic-features/data-fetching/get-static-props
 * @see https://nextjs.org/docs/api-reference/data-fetching/get-static-props
 */
export const getStaticProps: GetStaticProps<TaskBoardIndexProps> = async () => {
  return {
    props: {
      auth: true,
    },
    revalidate: 10,
  };
};

const TaskBoardIndex = () => {
  const router = useRouter();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const boards = useDeepEqualSelector((state) => state.boards.data);
  const count = useAppSelector((state) => state.boards.meta.last_page);
  const currentPage = useAppSelector((state) => state.boards.meta.current_page);

  useEffect(() => {
    dispatch(
      fetchTaskBoards({
        userId: route.pathParams.userId?.toString(),
        page: route.queryParams.page?.toString(),
      })
    );
  }, [dispatch, route.pathParams.userId, route.queryParams.page]);

  const handleChange = (_e: React.ChangeEvent<unknown>, page: number) => {
    router.push({
      pathname: route.pathname,
      query: { ...route.queryParams, page },
    });
  };

  if (!boards || userId !== route.pathParams.userId?.toString())
    return <StandbyScreen />;

  return (
    <>
      <Head>
        <title>Boards</title>
      </Head>
      <BaseLayout>
        <Container component="main" className="my-8">
          <Grid container spacing={2}>
            {boards.map((board) => (
              <Grid item md={4} sm={6} xs={12} key={board.id}>
                <Card elevation={7}>
                  <Link
                    href={`/users/${route.pathParams.userId.toString()}/boards/${
                      board.id
                    }`}
                    className="text-inherit"
                  >
                    <div className="h-40 overflow-y-auto break-words p-4">
                      <Typography>{board.description}</Typography>
                    </div>
                  </Link>
                  <Divider />
                  <BoardCardHeader board={board} />
                </Card>
              </Grid>
            ))}
            <Grid item md={4} sm={6} xs={12}>
              <ButtonToAddTask method="POST" model="board" />
            </Grid>
          </Grid>
        </Container>

        {boards.length > 0 && count && currentPage && (
          <Pagination
            count={count}
            page={currentPage}
            siblingCount={2}
            color="primary"
            size="large"
            onChange={handleChange}
            className="my-8"
            classes={{ ul: 'justify-center' }}
          />
        )}
      </BaseLayout>
    </>
  );
};

export default TaskBoardIndex;
