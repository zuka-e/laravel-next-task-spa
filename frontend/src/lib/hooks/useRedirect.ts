import { useRouter } from 'next/router';

import { pullIntendedUrl } from '@/lib/routes';

/**
 * Handle redirect functions.
 */
const useRedirect = () => {
  const router = useRouter();

  /**
   * Redirect to the intended URL if it exists or to the fallback URL.
   */
  const redirectToIntended = (fallback = '/'): void => {
    const redirectUrl = pullIntendedUrl() || fallback;

    if (redirectUrl === router.asPath) {
      return;
    }

    router.replace(redirectUrl);
  };

  /**
   * Redirect to the intended URL if it exists.
   */
  const redirectIfIntended = (): void => {
    const intendedUrl = pullIntendedUrl();

    if (intendedUrl) {
      router.replace(intendedUrl);
    }
  };

  return {
    redirectToIntended,
    redirectIfIntended,
  };
};

export default useRedirect;
