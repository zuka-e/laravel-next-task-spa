import db, { isInitialized } from '@test/api/database/manager';
import type { Middleware } from './types';

// cf. https://github.com/alan2207/bulletproof-react/blob/master/src/testing/mocks/db.ts

/**
 * Preserve DB state in a non in-memory storage.
 */
const preserveDb: Middleware = (resolver) => {
  return async (input) => {
    await initialize();

    const response = await resolver(input);

    persist();

    return response;
  };
};

/**
 * Initialize the DB state from local storage and set it to `db` instance.
 */
const initialize = async (): Promise<void> => {
  if (db[isInitialized]) {
    return;
  }

  restore() || (await seed());

  db[isInitialized] = true;
};

/**
 * Restore the previous DB state from local storage and set it to `db` instance.
 */
const restore = (): boolean => {
  if (typeof window === 'undefined') {
    return true;
  }

  const data = JSON.parse(window.localStorage.getItem('mockDb') || '{}');

  if (!Object.keys(data).length) {
    return false;
  }

  Object.entries(db).forEach(([table, model]) => {
    data[table]?.forEach((entry: Record<string, unknown>) => {
      model.create(entry);
    });
  });

  return true;
};

/**
 * Seed the DB.
 */
const seed = async (): Promise<void> => {
  await import('@test/data');
};

/**
 * Persist the database state to allow it to be restored.
 */
const persist = (): void => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const data = Object.fromEntries(
    Object.entries(db).map(([table, model]) => [table, model.getAll()])
  );

  store(JSON.stringify(data));
};

/**
 * Store the data in local storage.
 */
const store = (data: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem('mockDb', data);
};

export default preserveDb;
