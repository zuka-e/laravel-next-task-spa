import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { HttpErrorLayout } from '@/layouts';

/**
 * To test this, delete the cookie, `XSRF-TOKEN`
 */
const PageExpired = () => {
  const router = useRouter();

  const title = '419 Page Expired';

  useEffect(() => {
    sessionStorage.setItem('previousUrl', router.asPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <HttpErrorLayout
        title={title}
        description="ページの有効期限が切れました。"
        hint="もう一度お試しください。"
      />
    </>
  );
};

export default PageExpired;
