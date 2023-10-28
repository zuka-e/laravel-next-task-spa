import { memo, useEffect } from 'react';
import type { AppProps } from 'next/app';
import Router, { useRouter } from 'next/router';

import { useAppDispatch, useAppSelector, useRoute } from '@/utils/hooks';
import { AuthRoute, GuestRoute } from '@/routes';
import { pushFlash } from '@/store/slices';

const Route = memo(function Route(
  props: Pick<AppProps<Record<string, unknown>>, 'Component' | 'pageProps'>
): JSX.Element {
  const { Component, pageProps } = props;
  const router = useRouter();
  const route = useRoute();
  const httpStatus = useAppSelector((state) => state.app.httpStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (httpStatus && [401, 419].includes(httpStatus)) {
      dispatch(
        pushFlash({ severity: 'error', message: 'ログインしてください。' })
      );

      Router.replace('/login');
    }
  }, [dispatch, httpStatus]);

  // > Resist adding unrelated logic to your Effect only because this logic needs to run at the same time as an Effect you already wrote.
  // > ...
  // > On the other hand, if you split up a cohesive piece of logic into separate Effects, the code may look “cleaner” but will be more difficult to maintain.
  // >> https://react.dev/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process
  // cf. https://react.dev/learn/you-might-not-need-an-effect#chains-of-computations
  useEffect((): void => {
    (async (): Promise<void> => {
      if (route.queryParams?.['verified']?.toString()) {
        await Router.replace('/email-verification');
        return;
      }
    })();
  }, [dispatch, route.queryParams]);

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
});

export default Route;
