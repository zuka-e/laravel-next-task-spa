import dayjs from 'dayjs';
import type { DefaultBodyType, StrictRequest } from 'msw';

import { API_ROUTE } from '@/config/api';
import { APP_URL } from '@/config/app';
import { hash, verifyHash } from '@test/utils/crypto';

/**
 * Get the query parameters from the request.
 *
 * @see https://mswjs.io/docs/recipes/query-parameters
 */
export const getQuery = (
  request: StrictRequest<DefaultBodyType>,
): URLSearchParams => {
  return new URL(request.url).searchParams;
};

/**
 * Generate a signed URL for a given path and query parameters.
 *
 * @see https://laravel.com/docs/urls#signed-urls
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Routing/UrlGenerator.php#L338 - signedRoute()
 */
export const generateSignedUrl = (
  path: string,
  pathParams: Record<string, string>,
  ttl = 10,
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
  req: StrictRequest<DefaultBodyType>,
): boolean => {
  const verificationUrl = new URL(
    req.url.replace(new RegExp(`^${API_ROUTE}`), APP_URL),
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
