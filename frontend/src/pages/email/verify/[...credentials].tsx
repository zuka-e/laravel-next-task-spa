import { memo, useMemo, type JSX } from 'react';
import Head from 'next/head';
import Router from 'next/router';

import { skipToken } from '@reduxjs/toolkit/query';

import { useRoute } from '@/utils/hooks';
import { useVerifyEmailQuery } from '@/store/api';
import { BaseLayout, Loading } from '@/layouts';

/**
 * This page will be associated with the email verification URL,
 * which should have the frontend domain and tokens validated at the backend.
 * (※ In general, it seems the email verification link should point to the frontend.)
 *
 * It just sends a request to the verification URL.
 */
const VerifyEmail = memo(function VerifyEmail(): JSX.Element {
  const route = useRoute();

  const credentials = useMemo(
    (): string | undefined => route.pathParams?.['credentials'],
    [route.pathParams]
  );
  const queryString = useMemo(
    (): string | undefined => route.queryString,
    [route.queryString]
  );

  const { isSuccess } = useVerifyEmailQuery(
    credentials && queryString ? { credentials, queryString } : skipToken
  );

  if (isSuccess) {
    Router.replace('/account');
  }

  return (
    <>
      <Head>
        <title>Verify Email</title>
      </Head>
      <BaseLayout>
        <Loading open={true} />
      </BaseLayout>
    </>
  );
});

export default VerifyEmail;
