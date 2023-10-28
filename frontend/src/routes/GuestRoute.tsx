// cf. file://./AuthRoute.tsx

import { memo, useEffect } from 'react';
import Router from 'next/router';

import { useGetSessionQuery } from '@/store/api';
import { Loading } from '@/layouts';

export type GuestPage = {
  guest: true;
};

type GuestRouteProps = {
  children: React.ReactNode;
};

/**
 * Redirect if authenticated.
 */
const GuestRoute = memo(function GuestRoute({
  children,
}: GuestRouteProps): JSX.Element {
  const { auth, isUninitialized } = useGetSessionQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      auth: !!result.data?.user?.id,
    }),
  });

  useEffect(() => {
    if (auth) {
      const intendedUrl = sessionStorage.getItem('intendedUrl');

      if (intendedUrl) {
        sessionStorage.removeItem('intendedUrl');
      }

      const redirectUrl = intendedUrl || '/';

      Router.replace(redirectUrl);
    }
  }, [auth]);

  // Until initialized or the redirect completed.
  if (isUninitialized || auth) {
    return <Loading open={true} />;
  }

  return <>{children}</>;
});

export default GuestRoute;
