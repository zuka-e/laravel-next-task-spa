import type { UserDocument } from '@test/api/models';
import { db } from '@test/api/database';
import { getSession, migrateSession, putSession } from '@test/api/session';

// /**
//  * The currently authenticated user.
//  *
//  * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/GuardHelpers.php#L18 - user
//  */
// let user: UserDocument | null = null;

/**
 * Get the currently authenticated user from the session.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/SessionGuard.php#L141 - user()
 */
export const getUser = (): UserDocument | null => {
  // if (user) {
  //   return { ...user };
  // }

  return getUserBySessionId();
};

// /**
//  * Set the current user.
//  *
//  * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/GuardHelpers.php#L91 - setUser()
//  */
// const setUser = (userDoc: UserDocument): void => {
//   user = { ...userDoc };
// };

// /**
//  * Forget the current user.
//  *
//  * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/GuardHelpers.php#L103 - forgetUser()
//  */
// const forgetUser = (): void => {
//   user = null;
// };

/**
 * Log a user into the application.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/SessionGuard.php#L493 - login()
 */
export const login = (userDoc: UserDocument): void => {
  updateSession(userDoc.id);
  // setUser(userDoc);
};

/**
 * Update the session with the given ID.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/SessionGuard.php#L520 - updateSession()
 */
const updateSession = (id: UserDocument['id']) => {
  putSession('userId', id);
  migrateSession(true);
};

/**
 * Log the user out of the application.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/SessionGuard.php#L569 - logout()
 */
export const logout = (): void => {
  putSession('userId');
  // forgetUser();
};

/**
 * Get the currently authenticated user from the session.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/SessionGuard.php#L141 - user()
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/EloquentUserProvider.php#L53 - retrieveById()
 */
const getUserBySessionId = (): UserDocument | null => {
  return db.where('users', 'id', getSession().userId)[0] ?? null;
};
