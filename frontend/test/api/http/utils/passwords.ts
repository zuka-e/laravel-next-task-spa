import dayjs from 'dayjs';

import { APP_URL } from '@/config/app';
import { generateRandomString } from '@/utils/generator';
import db from '@test/api/database/manager';
import type { User } from '@test/api/database/models';
import { hash } from '@test/utils/crypto';

/**
 * The number of minutes that the password reset token is valid for.
 */
const TTL = 1;

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

/**
 * Validate token.
 *
 * @returns void if the token is valid, otherwise an error message.
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/Passwords/DatabaseTokenRepository.php#L130 - exists()
 */
export const validateToken = (credentials: {
  email: string;
  token: string;
}): string | void => {
  const record = db.passwordReset.findMany({
    where: { email: { equals: credentials.email } },
    orderBy: { createdAt: 'desc' },
  })[0];

  if (!record) {
    return "Token for the email doesn't exist.";
  }

  if (record.token !== credentials.token) {
    return 'The given token is invalid.';
  }

  if (dayjs(record.createdAt).add(TTL, 'minute').isBefore(dayjs())) {
    return 'The given token has expired.';
  }
};

/**
 * Validate token and then get the user from database.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/Passwords/PasswordBroker.php#L113 - validateReset()
 * @see https://github.com/laravel/framework/blob/11.x/src/Illuminate/Auth/EloquentUserProvider.php#L112 - retrieveByCredentials()
 */
export const getUserByCredentials = (credentials: {
  email: string;
  token: string;
}): User | string => {
  const message = validateToken(credentials);

  if (message) {
    return message;
  }

  db.passwordReset.delete({ where: { email: { equals: credentials.email } } });

  return (
    db.user.findFirst({
      where: { email: { equals: credentials.email } },
    }) ?? 'The given email does not exist.'
  );
};

/**
 * Validate and reset the user's password.
 *
 * @see https://github.com/laravel/fortify/blob/1.x/stubs/ResetUserPassword.php#L19 - reset()
 */
export const resetPassword = (
  user: User,
  input: {
    password: string;
    passwordConfirmation: string;
  },
): User | string => {
  const { password, passwordConfirmation } = input;

  if (password.length < 8) {
    return 'Password should be at least 8 characters.';
  }

  if (password !== passwordConfirmation) {
    return 'Password confirmation does not match.';
  }

  return db.user.update({
    where: { id: { equals: user.id } },
    data: { password },
    strict: true,
  });
};
