import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { fetchAuthUser } from 'store/thunks/auth';
import { useAppDispatch } from 'utils/hooks';
import { HttpErrorLayout } from 'layouts';

/**
 * To test this, delete the cookie, `XSRF-TOKEN`
 */
const PageExpired = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const title = '419 Page Expired';

  useEffect(() => {
    sessionStorage.setItem('previousUrl', router.asPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return function cleanup() {
      dispatch({ type: fetchAuthUser.rejected.type });
    };
  }, [dispatch]);

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
