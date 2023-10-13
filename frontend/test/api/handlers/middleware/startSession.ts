import { parse } from 'cookie';

import {
  getSession,
  saveSession,
  setSessionId,
  startSession as startSessionStore,
} from '@test/api/session/store';
import { COOKIE } from '@test/api/handlers/config/cookies';
import { decrypt } from '@test/utils/crypto';
import type { Middleware } from './types';

/**
 * Create or retrieve a session.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Middleware/StartSession.php#L51 - handle()
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Middleware/StartSession.php#L110 - handleStatefulRequest()
 */
const startSession: Middleware = () => {
  // Issue:
  // `document.cookie` isn't always the same as `res.cookies`
  setSessionId(decrypt(parse(document.cookie)[COOKIE]) || undefined);

  /** @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Middleware/StartSession.php#L142 - startSession() */
  startSessionStore();

  /** @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Middleware/StartSession.php#L235 - saveSession() */
  saveSession(getSession());

  /** @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Middleware/StartSession.php#L218 - addCookieToResponse() */
  // Issue:
  // Setting cookie with the same name using `context.cookie` probably doesn't always overwrite the previous.
  // So, use `context.cookie` once when returning the response in the handler instead of in this file.
  return [
    // context.cookie(COOKIE, encrypt(getSessionId()))
    // context.cookie(COOKIE, getSessionId())
  ];
};

export default startSession;
