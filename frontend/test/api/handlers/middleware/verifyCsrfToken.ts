import { context, type RestRequest } from 'msw';

import { getCsrfTokenFromSession } from '@test/api/session/store';
import type { ErrorResponse } from '@test/api/handlers/types';
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
const verifyCsrfToken: Middleware = (req) => {
  if (isReadRequest(req) || hasValidToken(req)) {
    /** @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Http/Middleware/VerifyCsrfToken.php#L183 - addCookieToResponse() */
    // Issue:
    // Setting cookie with the same name using `context.cookie` probably doesn't always overwrite the previous.
    // So, use `context.cookie` once when returning the response in the handler instead of in this.
    return [
      // context.cookie(XSRF_TOKEN, getCsrfTokenFromSession())
    ];
  }

  throw [
    context.status(419),
    context.json<ErrorResponse>({ message: 'CSRF token mismatch.' }),
  ];
};

/**
 * Determine if the HTTP request uses a ‘read’ verb.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Http/Middleware/VerifyCsrfToken.php - isReading()
 */
const isReadRequest = (req: RestRequest): boolean => {
  return ['HEAD', 'GET', 'OPTIONS'].includes(req.method);
};

/**
 * HTTPヘッダーの`X_XSRF_TOKEN`とセッションの`csrf-token`を比較
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Http/Middleware/VerifyCsrfToken.php#L136 - tokensMatch()
 */
const hasValidToken = (req: RestRequest): boolean => {
  const requestToken = decrypt(req.headers.get(X_XSRF_TOKEN) ?? '');
  const sessionToken = getCsrfTokenFromSession();

  return requestToken === sessionToken;
};

export default verifyCsrfToken;
