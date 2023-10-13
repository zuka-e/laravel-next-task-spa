import { generateRandomString } from '@/utils/generator';
import type { Session } from '@test/api/models';
import { db } from '@test/api/database';

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
let attributes: Partial<Session> = {};

/**
 * Set the session ID.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L638 - setId()
 */
export const setSessionId = (sessionId?: Session['id']): void => {
  id = sessionId || generateSessionId();
};

/**
 * Get the current session ID.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L627 - getId()
 */
export const getSessionId = (): Session['id'] => {
  return id;
};

/**
 * Get a new, random session ID.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L659 - generateSessionId()
 */
export const generateSessionId = (): string => {
  return generateRandomString(32);
};

/**
 * Get the session from the session driver (DB).
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L232 - all()
 */
export const getSession = (): Partial<Session> => {
  const { id, ...session } = attributes;
  return { ...session };
};

/**
 * Set the session.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L342 - replace()
 */
export const setSession = (session: Partial<Session>): void => {
  attributes = { ...session };
};

/**
 * Put a key / value pair in the session.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L354 - put()
 */
export const putSession = <K extends keyof Session>(
  key: K,
  value?: Session[K]
): void => {
  const session = getSession();

  session[key] = value;

  setSession(session);
  saveSession(getSession());
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
  /**
   * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L99 - loadSession()
   * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L111 - readFromHandler()
   */
  const savedSession = db.where('sessions', 'id', getSessionId())[0];

  if (!savedSession) {
    setSessionId();
  }

  const session = savedSession ?? { id: getSessionId() };

  if (!session._token) {
    session._token = regenerateCsrfToken();
  }

  setSession(session);
};

/**
 * Generate a new session ID for the session.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L578 - migrate()
 */
export const migrateSession = (destroy = false): void => {
  if (destroy) {
    /** @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/DatabaseSessionHandler.php#L267 - destroy() */
    db.remove('sessions', getSessionId());
  }

  setSessionId();
  saveSession(getSession());
};

/**
 * Set the new session to the session driver (DB).
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L166 - save()
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/DatabaseSessionHandler.php#L131 - write()
 */
export const saveSession = (session: Partial<Session>): Session => {
  const savedSession = db.where('sessions', 'id', getSessionId())[0];
  const { id, ...fillable } = session;

  return savedSession
    ? db.update('sessions', { ...savedSession, ...fillable })
    : db.create('sessions', { ...session, id: getSessionId() });
};

/**
 * Regenerate the CSRF token value.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L692 - regenerateToken()
 */
export const regenerateCsrfToken = (): string => {
  return generateRandomString(32);
};

/**
 * Get the CSRF token value from the session.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Session/Store.php#L682 - token()
 */
export const getCsrfTokenFromSession = (): string => {
  return getSession()._token ?? '';
};
