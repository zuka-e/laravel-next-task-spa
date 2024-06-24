import { GUEST_EMAIL } from '@/config/app';
import type { User } from '@/models';

/**
 * Determine if the user is a guest user.
 */
export const isGuest = (user: User): boolean => {
  return user?.email === GUEST_EMAIL;
};

/**
 * Determine if the user is verified.
 */
export const isVerified = (user: User): boolean => {
  return !!user?.emailVerifiedAt;
};
