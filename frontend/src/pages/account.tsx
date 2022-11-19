import Head from 'next/head';
import type { GetStaticProps } from 'next';

import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
} from '@mui/material';

import { isGuest } from 'utils/auth';
import { BaseLayout } from 'layouts';
import { AlertButton } from 'templates';
import {
  UserProfile,
  Password,
  UserStatus,
  DeleteAccountDialog,
} from 'components/account';
import type { AuthPage } from 'routes';

type AccountProps = AuthPage;

export const getStaticProps: GetStaticProps<AccountProps> = async () => {
  return {
    props: {
      auth: true,
    },
    revalidate: 10,
  };
};

const Account = () => {
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
                      <AlertButton disabled={isGuest()} color="danger">
                        アカウントを削除
                      </AlertButton>
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
};

export default Account;
