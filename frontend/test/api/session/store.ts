import { generateRandomString } from '@/utils/generator';
import type { Session } from '@test/api/database/models';
import db from '@test/api/database/manager';
import { timestamp } from '@test/api/database/definitions';

/**
 * The session ID.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L24 - id
 */
let id: Session['id'] = '';

/**
 * The session attributes.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L38 - attributes
 */
let attributes: Session['payload'] = {};

/**
 * Set the session ID.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L649 - setId()
 */
export const setSessionId = (sessionId?: Session['id']): void => {
  id = sessionId || generateSessionId();
};

/**
 * Get the current session ID.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L638 - getId()
 */
export const getSessionId = (): Session['id'] => {
  return id;
};

/**
 * Get a new, random session ID.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L670 - generateSessionId()
 */
export const generateSessionId = (): string => {
  return generateRandomString(32);
};

/**
 * Get the session from the session driver (DB).
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L232 - all()
 */
export const getSession = (): Session['payload'] => {
  return attributes;
};

/**
 * Set the session.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L342 - replace()
 */
export const setSession = (session: Session['payload']): void => {
  attributes = { ...session };
};

/**
 * Put a key / value pair in the session.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L365 - put()
 */
export const putSession = <K extends keyof Session['payload']>(
  key: K,
  value?: Session['payload'][K]
): void => {
  const session = getSession();

  session[key] = value;

  setSession(session);
};

/**
 * Start the session, reading the data from a handler.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Middleware/StartSession.php#L157 - getSession()
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Support/Manager.php#L66 - driver() - createDriver()
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/SessionManager.php#L88 - createDatabaseDriver()
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/SessionManager.php#L190 - buildSession()
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L83 - start()
 */
export const startSession = (): void => {
  loadSession();

  if (!getSession()._token) {
    regenerateCsrfToken();
  }
};

/**
 * Load the session data from DB.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L99 - loadSession()
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L111 - readFromHandler()

 */
const loadSession = (): void => {
  const session = db.session.findFirst({
    where: { id: { equals: getSessionId() } },
  });

  if (session) {
    setSession(session.payload);
  }
};

/**
 * Generate a new session ID for the session.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L589 - migrate()
 */
export const migrateSession = (destroy = false): void => {
  if (destroy) {
    /** @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/DatabaseSessionHandler.php#L267 - destroy() */
    db.session.delete({ where: { id: { equals: getSessionId() } } });
  }

  setSessionId();
};

/**
 * Set the new session to the session driver (DB).
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L166 - save()
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/DatabaseSessionHandler.php#L131 - write()
 */
export const saveSession = (): Session => {
  const exists =
    db.session.count({ where: { id: { equals: getSessionId() } } }) > 0;

  return exists
    ? db.session.update({
        where: { id: { equals: getSessionId() } },
        data: { payload: getSession(), updatedAt: timestamp },
        strict: true,
      })
    : db.session.create({ id: getSessionId(), payload: getSession() });
};

/**
 * Regenerate the CSRF token value.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L692 - regenerateToken()
 */
export const regenerateCsrfToken = (): void => {
  attributes._token = generateRandomString(32);
};

/**
 * Get the CSRF token value from the session.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L682 - token()
 */
export const getCsrfTokenFromSession = (): string => {
  return getSession()._token ?? '';
};
