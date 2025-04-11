import { memo, type JSX } from 'react';
import type { AppProps } from 'next/app';

import { ErrorHandler } from '@/components/errors';
import { Route } from '@/routes';

const PageHandler = memo(function PageHandler(
  props: Pick<AppProps, 'Component' | 'pageProps'>,
): JSX.Element {
  return (
    <ErrorHandler>
      <Route {...props} />
    </ErrorHandler>
  );
});

export default PageHandler;
