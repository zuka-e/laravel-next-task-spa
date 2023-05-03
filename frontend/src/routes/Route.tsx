import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { AuthRoute, GuestRoute } from '@/routes';

const Route = (
  props: Pick<AppProps<Record<string, unknown>>, 'Component' | 'pageProps'>
) => {
  const { Component, pageProps } = props;
  const router = useRouter();

  useEffect(() => {
    return function cleanup() {
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
