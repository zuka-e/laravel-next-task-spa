import { memo } from 'react';
import Head from 'next/head';

import { HttpErrorLayout } from '@/layouts';

const BadRequest = memo(function BadRequest(): JSX.Element {
  const title = '400 Bad Request';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <HttpErrorLayout title={title} description="不正なリクエストです。" />
    </>
  );
});

export default BadRequest;
