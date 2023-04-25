import { useEffect } from 'react';
import type { AppProps } from 'next/app';

import { clearHttpStatus } from '@/store/slices';
import { useAppDispatch } from '@/utils/hooks';
import { Route } from '@/routes';
import { ErrorHandler } from '@/components/errors';
import { useRouter } from 'next/router';

const PageHandler = (props: Pick<AppProps, 'Component' | 'pageProps'>) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    return function cleanup() {
      dispatch(clearHttpStatus());
    };
  }, [dispatch, router.asPath]);

  return (
    <ErrorHandler>
      <Route {...props} />
    </ErrorHandler>
  );
};

export default PageHandler;
