import { useGetSessionQuery } from '@/store/api/authApi';

/**
 * Attempts to fetch authenticated user if not yet to be determined.
 */
const useAuth = () => {
  const { data } = useGetSessionQuery();
  const user = data?.user;

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
