import { memo, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Router from 'next/router';

import { useAppDispatch, useRoute } from '@/utils/hooks';
import { verifyEmail } from '@/store/thunks/auth';
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
  const dispatch = useAppDispatch();

  const credentials = useMemo(
    (): string | undefined => route.pathParams?.['credentials'],
    [route.pathParams]
  );
  const queryString = useMemo(
    (): string | undefined => route.queryString,
    [route.queryString]
  );

  useEffect((): void => {
    if (!(credentials && queryString)) {
      return;
    }

    (async (): Promise<void> => {
      const response = await dispatch(
        verifyEmail({ credentials, queryString })
      );

      if (verifyEmail.fulfilled.match(response)) {
        await Router.replace('/account');
        return;
      }
    })();
  }, [credentials, dispatch, queryString]);

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
