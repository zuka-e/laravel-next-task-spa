import type { DefaultBodyType, StrictRequest } from 'msw';
import dayjs from 'dayjs';

import { APP_URL } from '@/config/app';
import { API_ROUTE } from '@/config/api';
import type { User } from '@/store/api/services/tasks/models';
import { generateRandomString } from '@/utils/generator';
import { hash, verifyHash } from '@test/utils/crypto';
import db from '@test/api/database/manager';

/**
 * Generate a signed URL for a given path and query parameters.
 *
 * @see https://laravel.com/docs/urls#signed-urls
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Routing/UrlGenerator.php#L338 - signedRoute()
 */
export const generateSignedUrl = (
  path: string,
  pathParams: Record<string, string>,
  ttl = 10
): string => {
  const extraPath = Object.values(pathParams).join('/');
  const url = new URL(`${path}/${extraPath}`, APP_URL);

  url.searchParams.set('expires', dayjs().add(ttl, 'minute').unix().toString());
  url.searchParams.set('signature', hash(url.toString()));

  return url.toString();
};

/**
 * Determine if the given request has a valid signature.
 *
 * @see https://laravel.com/docs/urls#validating-signed-route-requests
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Providers/FoundationServiceProvider.php#L154 - Request::macro('hasValidSignatureWhileIgnoring'...
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Routing/UrlGenerator.php#L402 - hasValidSignature()
 */
export const hasValidSignature = (
  req: StrictRequest<DefaultBodyType>
): boolean => {
  const verificationUrl = new URL(
    req.url.replace(new RegExp(`^${API_ROUTE}`), APP_URL)
  );
  const searchParams = verificationUrl.searchParams;
  const expires = parseInt(searchParams.get('expires') ?? '');
  const signature = searchParams.get('signature') ?? '';

  const originalUrl = new URL(verificationUrl);
  originalUrl.searchParams.delete('signature');

  return (
    verifyHash(originalUrl.toString(), signature) && dayjs().unix() < expires
  );
};

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
