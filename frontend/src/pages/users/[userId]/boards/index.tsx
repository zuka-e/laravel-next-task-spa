import { memo, useCallback } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';

import { Container, Grid, Card, Divider, Typography } from '@mui/material';
import { Pagination } from '@mui/material';

import { useGetSessionQuery, useGetTaskBoardsQuery } from '@/store/api';
import { useRoute } from '@/utils/hooks';
import { BaseLayout, StandbyScreen } from '@/layouts';
import { Link } from '@/templates';
import { AddTaskButton } from '@/components/boards';
import { BoardCardHeader } from '@/components/boards/TaskBoard';
import type { AuthPage } from '@/routes';

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

const TaskBoardIndex = memo(function TaskBoardIndex(): JSX.Element {
  const { pathname, pathParams, queryParams } = useRoute();
  const { user } = useGetSessionQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      user: result.data?.user,
    }),
  });

  const { data: paginator } = useGetTaskBoardsQuery(
    {
      userId: pathParams?.userId ?? '',
      page: queryParams?.page?.toString(),
    },
    { skip: !pathParams || !queryParams }
  );

  const handleChange = useCallback(
    (_e: React.ChangeEvent<unknown>, page: number): void => {
      Router.push({
        pathname: pathname,
        query: { ...queryParams, page },
      });
    },
    [pathname, queryParams]
  );

  if (!pathParams || !paginator || user?.id !== pathParams.userId)
    return <StandbyScreen />;

  return (
    <>
      <Head>
        <title>Boards</title>
      </Head>
      <BaseLayout>
        <Container component="main" className="my-8">
          <Grid container spacing={2}>
            {paginator.data.map((board) => (
              <Grid item md={4} sm={6} xs={12} key={board.id}>
                <Card elevation={7}>
                  <Link
                    href={`/users/${pathParams.userId}/boards/${board.id}`}
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
              <AddTaskButton method="POST" model="board" />
            </Grid>
          </Grid>
        </Container>

        {paginator.data.length > 0 && (
          <Pagination
            count={paginator.meta.last_page}
            page={paginator.meta.current_page}
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
});

export default TaskBoardIndex;
