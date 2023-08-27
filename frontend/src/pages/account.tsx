import { memo } from 'react';
import Head from 'next/head';
import type { GetStaticProps } from 'next';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
} from '@mui/material';

import { isGuest } from '@/utils/auth';
import { BaseLayout } from '@/layouts';
import {
  UserProfile,
  Password,
  UserStatus,
  DeleteAccountDialog,
} from '@/components/account';
import type { AuthPage } from '@/routes';

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
                        disabled={isGuest()}
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
