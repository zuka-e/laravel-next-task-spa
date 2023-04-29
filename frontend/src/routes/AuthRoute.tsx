// cf. https://dev.to/ivandotv/protecting-static-pages-in-next-js-application-1e50
// cf. https://github.com/ivandotv/nextjs-client-signin-logic

import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAppDispatch, useAppSelector, useAuth } from '@/utils/hooks';
import { setFlash } from '@/store/slices';
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
const AuthRoute = ({ children }: AuthRouteProps) => {
  const router = useRouter();
  const httpStatus = useAppSelector((state) => state.app.httpStatus);
  const { auth, guest } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (guest) {
      if (httpStatus && [401, 419].includes(httpStatus)) {
        sessionStorage.setItem('previousUrl', router.asPath);
        dispatch(
          setFlash({ type: 'error', message: 'ログインしてください。' })
        );
      }

      router.replace('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guest]);

  // Until initialized or the redirect completed.
  if (!auth) {
    return <Loading open={true} />;
  }

  return <>{children}</>;
};

export default AuthRoute;
