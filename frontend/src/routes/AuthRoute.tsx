// cf. https://dev.to/ivandotv/protecting-static-pages-in-next-js-application-1e50
// cf. https://github.com/ivandotv/nextjs-client-signin-logic

import { memo, useEffect } from 'react';
import Router from 'next/router';

import { useGetSessionQuery } from '@/store/api';
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
  const { auth, isUninitialized } = useGetSessionQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      auth: !!result.data?.user?.id,
    }),
  });

  const guest = !isUninitialized && !auth;

  useEffect(() => {
    if (guest) {
      Router.replace('/login');
    }
  }, [guest]);

  // Until initialized or the redirect completed.
  if (isUninitialized || guest) {
    return <Loading open={true} />;
  }

  return <>{children}</>;
});

export default AuthRoute;
