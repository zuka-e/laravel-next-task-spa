import { memo } from 'react';
import Head from 'next/head';

import { HttpErrorLayout } from '@/layouts';

const TooManyRequests = memo(function TooManyRequests(): JSX.Element {
  const title = '429 Too Many Requests';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <HttpErrorLayout
        title={title}
        description="規定アクセス回数を超過しました。"
        hint="時間を置いてもう一度お試しください。"
      />
    </>
  );
});

export default TooManyRequests;
