// cf. https://dev.to/ivandotv/protecting-static-pages-in-next-js-application-1e50
// cf. https://github.com/ivandotv/nextjs-client-signin-logic

import { memo, useEffect, type JSX } from 'react';
import Router from 'next/router';

import { useGetSessionQuery } from '@/store/api';
import { useRedirect } from '@/lib/hooks';
import { Loading } from '@/layouts';

export type AuthPage = {
  auth: true;
};

type AuthRouteProps = {
  children: React.ReactNode;
};

/**
 * Redirect to the login form unless authenticated.
 */
const AuthRoute = memo(function AuthRoute({
  children,
}: AuthRouteProps): JSX.Element {
  const { redirectIfIntended } = useRedirect();

  const { auth, isLoading, isUninitialized } = useGetSessionQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      auth: !!result.data?.user?.id,
    }),
  });

  const unresolved = isLoading || isUninitialized;
  const guest = unresolved ? undefined : !auth;

  useEffect(() => {
    if (guest) {
      Router.replace('/login');
      return;
    }

    redirectIfIntended();
  }, [guest, redirectIfIntended]);

  // Until initialized or the redirect completed.
  if (unresolved || guest) {
    return <Loading open={true} />;
  }

  return <>{children}</>;
});

export default AuthRoute;
