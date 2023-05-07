import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { verifyEmail } from '@/store/thunks/auth';
import { useAppDispatch, useRoute } from '@/utils/hooks';
import { AuthRoute, GuestRoute } from '@/routes';

const Route = (
  props: Pick<AppProps<Record<string, unknown>>, 'Component' | 'pageProps'>
) => {
  const { Component, pageProps } = props;
  const router = useRouter();
  const route = useRoute();
  const dispatch = useAppDispatch();

  useEffect((): void => {
    (async (): Promise<void> => {
      if (route.queryParams['verified']?.toString()) {
        await router.replace('/email-verification');
        return;
      }

      const redirectUri = sessionStorage.getItem('redirectUri');

      if (redirectUri) {
        sessionStorage.removeItem('redirectUri');
        dispatch(verifyEmail({ url: redirectUri }));
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.queryParams]);

  useEffect((): (() => void) => {
    return function cleanup(): void {
      sessionStorage.setItem('previousUrl', router.asPath);
    };
  }, [router.asPath]);

  return (
    <>
      {/* cf. https://alexsidorenko.com/blog/next-js-protected-routes/#move-user-logic-to-_appjs */}
      {pageProps.auth ? (
        <AuthRoute>
          <Component {...pageProps} />
        </AuthRoute>
      ) : pageProps.guest ? (
        <GuestRoute>
          <Component {...pageProps} />
        </GuestRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
};

export default Route;
