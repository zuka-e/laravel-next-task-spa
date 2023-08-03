import type { AppProps } from 'next/app';
import { Route } from '@/routes';
import { ErrorHandler } from '@/components/errors';

const PageHandler = (props: Pick<AppProps, 'Component' | 'pageProps'>) => {
  return (
    <ErrorHandler>
      <Route {...props} />
    </ErrorHandler>
  );
};

export default PageHandler;
