import { factory } from '@mswjs/data';

import { modelDictionary } from './definitions';

/** Determine if DB has been initialized. */
export const isInitialized = Symbol('isInitialized');

/**
 * @see https://github.com/mswjs/datamodel-methods
 * @see https://github.com/mswjs/data#queryitg-data
 */
const db = {
  ...factory(modelDictionary),
  [isInitialized]: false,
};

export default db;
