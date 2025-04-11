// cf. file://./AuthRoute.tsx

import { memo, useEffect, type JSX } from 'react';

import { Loading } from '@/layouts';
import { useRedirect } from '@/lib/hooks';
import { useGetSessionQuery } from '@/store/api';

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
  const { redirectToIntended } = useRedirect();

  const { auth, isUninitialized } = useGetSessionQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      auth: !!result.data?.user?.id,
    }),
  });

  useEffect(() => {
    if (!auth) {
      return;
    }

    redirectToIntended();
  }, [auth, redirectToIntended]);

  // Until initialized or the redirect completed.
  if (isUninitialized || auth) {
    return <Loading open={true} />;
  }

  return <>{children}</>;
});

export default GuestRoute;
