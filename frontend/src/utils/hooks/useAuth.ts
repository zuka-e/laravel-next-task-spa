import { useEffect } from 'react';

import { fetchAuthUser } from '@/store/thunks/auth';
import { isReady } from '@/utils/auth';
import useAppDispatch from './useAppDispatch';
import useAppSelector from './useAppSelector';

/**
 * Attempts to fetch authenticated user if not yet to be determined.
 */
const useAuth = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      if (!isReady()) {
        await dispatch(fetchAuthUser());
      }
    })();
  }, [dispatch]);

  return {
    /** Determine if the current user is authenticated. */
    auth: !!user,
    /** Determine if the current user is **NOT** authenticated. */
    guest: user === null,
    /** The current user */
    user,
  };
};

export default useAuth;
