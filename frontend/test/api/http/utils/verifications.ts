import type { User } from '@test/api/database/models';
import { generateSignedUrl } from '@test/api/http/utils/urls';
import { hash } from '@test/utils/crypto';

/**
 * Generate a verification URL for a given user.
 *
 * @see https://laravel.com/docs/verification
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/Notifications/VerifyEmail.php#L77 - verificationUrl()
 */
export const generateVerificationUrl = (user: User): string => {
  return generateSignedUrl('/email/verify', {
    id: user.id,
    hash: hash(user.id),
  });
};
