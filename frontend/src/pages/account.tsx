import { memo, type JSX } from 'react';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
} from '@mui/material';

import {
  DeleteAccountDialog,
  Password,
  UserProfile,
  UserStatus,
} from '@/components/account';
import { BaseLayout } from '@/layouts';
import { isGuest } from '@/lib/auth';
import type { AuthPage } from '@/routes';
import { useGetSessionQuery } from '@/store/api';

type AccountProps = AuthPage;

export const getStaticProps: GetStaticProps<AccountProps> = async () => {
  return {
    props: {
      auth: true,
    },
    revalidate: 10,
  };
};

const Account = memo(function Account(): JSX.Element {
  const { data: { user } = {} } = useGetSessionQuery();

  if (!user) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Account</title>
      </Head>
      <BaseLayout>
        <Container component="main" maxWidth="md" className="max-sm:px-0">
          <Card elevation={2} className="max-sm:rounded-none sm:my-8 md:my-16">
            <CardContent>
              <section>
                <CardHeader title="Profile" />
                <Divider />
                <CardContent>
                  <UserProfile />
                </CardContent>
              </section>
              <section>
                <CardHeader title="Password" />
                <Divider />
                <CardContent>
                  <Password />
                </CardContent>
              </section>
              <section>
                <CardHeader title="Status" />
                <Divider />
                <CardContent>
                  <UserStatus />
                </CardContent>
              </section>
              <section>
                <CardHeader title="Delete account" />
                <Divider />
                <CardContent>
                  <DeleteAccountDialog
                    trigger={
                      <Button
                        disabled={isGuest(user)}
                        variant="contained"
                        color="error"
                      >
                        アカウントを削除
                      </Button>
                    }
                  />
                </CardContent>
              </section>
            </CardContent>
          </Card>
        </Container>
      </BaseLayout>
    </>
  );
});

export default Account;
