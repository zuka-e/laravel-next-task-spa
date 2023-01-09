import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetStaticProps } from 'next';

import { Container, Card, Grid, Typography, Button } from '@mui/material';

import { removeEmailVerificationPage } from '@/store/slices/authSlice';
import { sendEmailVerificationLink } from '@/store/thunks/auth';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { isAfterRegistration, isVerified } from '@/utils/auth';
import { BaseLayout } from '@/layouts';
import { AlertMessage } from '@/templates';
import type { AuthPage } from '@/routes';

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

const EmailVerification = () => {
  const dispatch = useAppDispatch();
  const afterRegistration = useAppSelector(
    (state) => state.auth.afterRegistration
  );
  const router = useRouter();

  // 一時的に表示させるページ
  // `afterRegistration`: `SignUp`直後に`true` (`replace`しない -> 表示させる)
  useEffect(() => {
    if (!isAfterRegistration() || isVerified()) router.replace('/');
  }, [router, afterRegistration]);

  // DOMアンマウント時に実行 (cleanup function)
  useEffect(() => {
    return () => {
      dispatch(removeEmailVerificationPage());
    };
  }, [dispatch]);

  const handleClick = () => {
    dispatch(sendEmailVerificationLink());
  };

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
          <AlertMessage severity="warning" elevation={2} className="font-bold">
            {`登録から24時間以内に認証を完了させなかった場合、一定時間経過後に登録が抹消されます。`}
          </AlertMessage>
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
        </Container>
      </BaseLayout>
    </>
  );
};

export default EmailVerification;
