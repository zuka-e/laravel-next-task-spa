import { factory } from '@mswjs/data';

import { modelDictionary } from './definitions';

/**
 * @see https://github.com/mswjs/datamodel-methods
 * @see https://github.com/mswjs/data#querying-data
 */
const db = factory(modelDictionary);

export default db;
