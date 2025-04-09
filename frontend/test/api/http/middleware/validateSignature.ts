import { authorizationErrorResponse } from '@test/api/http/responses/errors';
import { hasValidSignature } from '@test/api/http/utils/urls';
import type { Middleware } from './types';

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

export default validateSignature;
