// cf. file://./AuthRoute.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAuth } from '@/utils/hooks';
import { isAfterRegistration } from '@/utils/auth';
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
const GuestRoute = ({ children }: GuestRouteProps) => {
  const router = useRouter();
  const { auth, guest } = useAuth();

  useEffect(() => {
    if (auth) {
      if (isAfterRegistration()) {
        router.replace('/email-verification');
      } else {
        const previousUrl = sessionStorage.getItem('previousUrl');
        sessionStorage.removeItem('previousUrl');
        router.replace(previousUrl || '/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  // Until initialized or the redirect completed.
  if (!guest) {
    return <Loading open={true} />;
  }

  return <>{children}</>;
};

export default GuestRoute;
