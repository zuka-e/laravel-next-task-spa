// cf. file://./AuthRoute.tsx

import { memo, useEffect } from 'react';
import Router from 'next/router';

import { useAuth } from '@/utils/hooks';
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
  const { auth, guest } = useAuth();

  useEffect(() => {
    if (auth) {
      const previousUrl = sessionStorage.getItem('previousUrl');
      sessionStorage.removeItem('previousUrl');
      Router.replace(previousUrl || '/');
    }
  }, [auth]);

  // Until initialized or the redirect completed.
  if (!guest) {
    return <Loading open={true} />;
  }

  return <>{children}</>;
});

export default GuestRoute;
