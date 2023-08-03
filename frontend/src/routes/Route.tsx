import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { useAppDispatch, useAppSelector, useRoute } from '@/utils/hooks';
import { AuthRoute, GuestRoute } from '@/routes';
import { clearIntendedUrl, pushFlash } from '@/store/slices';
import { Loading } from '@/layouts';

const Route = (
  props: Pick<AppProps<Record<string, unknown>>, 'Component' | 'pageProps'>
) => {
  const { Component, pageProps } = props;
  const router = useRouter();
  const route = useRoute();
  const httpStatus = useAppSelector((state) => state.app.httpStatus);
  const intendedUrl = useAppSelector((state) => state.app.intendedUrl);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (httpStatus && [401, 419].includes(httpStatus)) {
      dispatch(
        pushFlash({ severity: 'error', message: 'ログインしてください。' })
      );

      router.replace('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [httpStatus]);

  useEffect((): void => {
    (async (): Promise<void> => {
      if (intendedUrl) {
        await router.push(intendedUrl);
        return;
      }

      if (route.queryParams?.['verified']?.toString()) {
        await router.replace('/email-verification');
        return;
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.queryParams]);

  useEffect((): (() => void) => {
    return function cleanup(): void {
      dispatch(clearIntendedUrl());
      sessionStorage.setItem('previousUrl', router.asPath);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  if (intendedUrl) {
    return <Loading open={true} />;
  }

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
