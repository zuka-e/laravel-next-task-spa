import {
  getSessionId,
  saveSession,
  setSessionId,
  startSession as startSessionStore,
} from '@test/api/session/store';
import { SESSION_COOKIE } from '@test/api/config/cookie';
import { setCookie } from '@test/api/http/utils';
import { decrypt } from '@test/utils/crypto';
import type { Middleware } from './types';

/**
 * Create or retrieve a session.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Middleware/StartSession.php#L51 - handle()
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Middleware/StartSession.php#L110 - handleStatefulRequest()
 */
const startSession: Middleware = (resolver) => {
  return async (input) => {
    const { cookies } = input;

    /** @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Middleware/StartSession.php#L157-L160 - getSession() */
    setSessionId(decrypt(cookies[SESSION_COOKIE] ?? '') || undefined);

    /** @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Middleware/StartSession.php#L142 - startSession() */
    startSessionStore();

    const response = await resolver(input);

    /** @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Middleware/StartSession.php#L218 - addCookieToResponse() */
    setCookie(SESSION_COOKIE, getSessionId());

    /** @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Middleware/StartSession.php#L242 - saveSession() */
    saveSession();

    return response;
  };
};

export default startSession;
