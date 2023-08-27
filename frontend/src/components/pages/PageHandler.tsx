import { memo } from 'react';
import type { AppProps } from 'next/app';

import { Route } from '@/routes';
import { ErrorHandler } from '@/components/errors';

const PageHandler = memo(function PageHandler(
  props: Pick<AppProps, 'Component' | 'pageProps'>
): JSX.Element {
  return (
    <ErrorHandler>
      <Route {...props} />
    </ErrorHandler>
  );
});

export default PageHandler;
