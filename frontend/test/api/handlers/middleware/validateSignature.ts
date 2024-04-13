import { type DefaultBodyType, type StrictRequest } from 'msw';

import type { Middleware } from './types';
import { authorizationErrorResponse } from '@test/api/handlers/utils/responses';

/**
 * Validate a signature for the requested URL.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Routing/Middleware/ValidateSignature.php#L58 - handle()
 */
const validateSignature: Middleware = (resolver) => {
  return (input) => {
    const { request } = input;

    if (!hasValidSignature(request)) {
      return authorizationErrorResponse('Invalid signature.');
    }

    return resolver(input);
  };
};

/**
 * Determine if the given request has a valid signature.
 *
 * @see https://laravel.com/docs/10.x/urls#validating-signed-route-requests
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Providers/FoundationServiceProvider.php#L154 - Request::macro('hasValidSignatureWhileIgnoring'...
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Routing/UrlGenerator.php#L402 - hasValidSignature()
 */
const hasValidSignature = (req: StrictRequest<DefaultBodyType>): boolean => {
  // const encryptedId = req.params['id'];
  // const emailHash = req.params['hash'];
  const signature = new URL(req.url).searchParams.get('signature');

  // While the URL validity will be determined by the backend in production,
  // the following value is considered to be valid here in testing.
  return (
    // encryptedId === 'enc-id' &&
    // emailHash === 'email-hash' &&
    signature === 'xxx'
  );
};

export default validateSignature;
