import { HttpResponse, type DefaultBodyType, type StrictRequest } from 'msw';

import { getCsrfTokenFromSession } from '@test/api/session/store';
import { XSRF_TOKEN } from '@test/api/config/cookie';
import { setCookie } from '@test/api/http/utils';
import { decrypt } from '@test/utils/crypto';
import type { Middleware } from './types';

/**
 * CSRF token header name.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Http/Middleware/VerifyCsrfToken.php#L151 - getTokenFromRequest()
 * @see https://github.com/axios/axios#request-config
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
 */
const X_XSRF_TOKEN = 'X-XSRF-TOKEN';

/**
 * Verify CSRF token.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Http/Middleware/VerifyCsrfToken.php#L70 - handle()
 */
const verifyCsrfToken: Middleware = (resolver) => {
  return async (input) => {
    const { request } = input;

    if (!isReadRequest(request) && !hasValidToken(request)) {
      /** @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Http/Middleware/VerifyCsrfToken.php#L85 - TokenMismatchException */
      return HttpResponse.json(
        {
          severity: 'error',
          message: 'CSRF token mismatch.',
        },
        { status: 419 }
      );
    }

    const response = await resolver(input);

    /** @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Http/Middleware/VerifyCsrfToken.php#L183 - addCookieToResponse() */
    setCookie(XSRF_TOKEN, getCsrfTokenFromSession());

    return response;
  };
};

/**
 * Determine if the HTTP request uses a ‘read’ verb.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Http/Middleware/VerifyCsrfToken.php - isReading()
 */
const isReadRequest = (req: StrictRequest<DefaultBodyType>): boolean => {
  return ['HEAD', 'GET', 'OPTIONS'].includes(req.method);
};

/**
 * HTTPヘッダーの`X_XSRF_TOKEN`とセッションの`csrf-token`を比較
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Http/Middleware/VerifyCsrfToken.php#L136 - tokensMatch()
 */
const hasValidToken = (req: StrictRequest<DefaultBodyType>): boolean => {
  const requestToken = decrypt(req.headers.get(X_XSRF_TOKEN) ?? '');
  const sessionToken = getCsrfTokenFromSession();

  return requestToken === sessionToken;
};

export default verifyCsrfToken;
