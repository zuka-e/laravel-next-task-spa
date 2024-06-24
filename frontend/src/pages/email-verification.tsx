import { memo, useCallback } from 'react';
import Head from 'next/head';
import type { GetStaticProps } from 'next';

import { Container, Card, Grid, Typography, Button } from '@mui/material';

import { sendEmailVerificationLink } from '@/store/thunks/auth';
import { useGetSessionQuery } from '@/store/api';
import { useAppDispatch } from '@/utils/hooks';
import { BaseLayout } from '@/layouts';
import { AlertMessage, LinkButton } from '@/templates';
import type { AuthPage } from '@/routes';
import { isVerified } from '@/lib/auth';

type EmailVerificationProps = AuthPage;

export const getStaticProps: GetStaticProps<
  EmailVerificationProps
> = async () => {
  return {
    props: {
      auth: true,
    },
    revalidate: 10,
  };
};

const EmailVerification = memo(function EmailVerification(): JSX.Element {
  const dispatch = useAppDispatch();
  const { data: { user } = {} } = useGetSessionQuery();

  const handleClick = useCallback((): void => {
    dispatch(sendEmailVerificationLink());
  }, [dispatch]);

  if (!user) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Email Verification</title>
      </Head>
      <BaseLayout>
        <Container
          component="main"
          maxWidth="sm"
          className="my-4 flex flex-col gap-4 sm:my-16"
        >
          <AlertMessage
            severity={isVerified(user) ? 'success' : 'warning'}
            elevation={2}
            className="font-bold"
          >
            {isVerified(user)
              ? '認証済みです。'
              : '登録から24時間以内に認証を完了させなかった場合、一定時間経過後に登録が抹消されます。'}
          </AlertMessage>
          {isVerified(user) ? (
            <div>
              <LinkButton to={'/'} variant="contained" className="w-fit">
                トップページへ
              </LinkButton>
            </div>
          ) : (
            <Card elevation={2} className="p-8">
              <Grid container direction="column" alignItems="center">
                <Typography variant="h4" component="h1" gutterBottom>
                  {`認証用メールを送信しました。`}
                </Typography>
                <Typography paragraph>
                  {`届いたメールに記載されたURLをクリックして登録を完了させてください。メールが受信できない場合は迷惑メールに振り分けられていないかご確認ください。`}
                </Typography>
                <Typography paragraph>
                  {`1時間以内に手続きを行わなかった場合、メールのリンクは無効になります。`}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClick}
                >
                  {`メールを再送信する`}
                </Button>
              </Grid>
            </Card>
          )}
        </Container>
      </BaseLayout>
    </>
  );
});

export default EmailVerification;
