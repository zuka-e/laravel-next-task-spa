import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

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
const VerifyEmail: React.FC = () => {
  const router = useRouter();
  const route = useRoute();
  const dispatch = useAppDispatch();

  const credentials = route.pathParams?.['credentials'];
  const queryString = route.queryString;

  useEffect((): void => {
    if (!(credentials && queryString)) {
      return;
    }

    (async (): Promise<void> => {
      const response = await dispatch(
        verifyEmail({ credentials, queryString })
      );

      if (verifyEmail.fulfilled.match(response)) {
        await router.replace('/account');
        return;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials, queryString]);

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
};

export default VerifyEmail;
