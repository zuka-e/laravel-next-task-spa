import { APP_URL } from '@/config/app';
import { generateRandomString } from '@/utils/generator';
import db from '@test/api/database/manager';
import type { User } from '@test/api/database/models';
import { hash } from '@test/utils/crypto';

/**
 * Generate a password reset URL for a given user.
 *
 * @see https://laravel.com/docs/11.x/passwords#password-reset-link-handling-the-form-submission
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/Passwords/PasswordBroker.php#L48 - sendResetLink()
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/Passwords/DatabaseTokenRepository.php#L84 - create()
 */
export const generatePasswordResetUrl = (user: User): string => {
  const token = hash(generateRandomString(32));

  db.passwordReset.create({ email: user.email, token });

  const url = new URL(`/reset-password/${token}`, APP_URL);

  url.searchParams.set('email', user.email);

  return url.toString();
};
