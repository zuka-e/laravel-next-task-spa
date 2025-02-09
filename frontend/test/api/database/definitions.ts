import { nullable, primaryKey } from '@mswjs/data';

import { faker } from '@test/utils/faker';

/**
 * Session key of CSRF token.
 */
const CSRF_TOKEN = '_token';

/**
 * Timestamp definition.
 */
export const timestamp = () => new Date().toISOString();

/**
 * Creation and update timestamp definitions
 *
 * @todo `satisfies ModelDefinition`
 */
const timestamps = {
  createdAt: timestamp,
  updatedAt: timestamp,
};

/**
 * Models definitions as if table definitions
 *
 * @see https://github.com/mswjs/data#api
 * @see https://github.com/mswjs/data#recipes
 */
export const modelDictionary = {
  session: {
    id: primaryKey(String),
    userId: nullable<string>(() => null),
    payload: {
      userId: nullable<string>(() => null),
      [CSRF_TOKEN]: String,
    },
    ...timestamps,
  },
  passwordReset: {
    id: primaryKey(faker.string.uuid),
    email: String,
    token: String,
    ...timestamps,
  },
  user: {
    id: primaryKey(faker.string.uuid),
    name: String,
    email: String,
    emailVerifiedAt: nullable<string>(() => null),
    password: String,
    ...timestamps,
  },
  taskBoard: {
    id: primaryKey(faker.string.uuid),
    userId: String,
    title: String,
    description: nullable<string>(() => null),
    listIds: Array<string>,
    cardIds: Array<string>,
    ...timestamps,
  },
  taskList: {
    id: primaryKey(faker.string.uuid),
    boardId: String,
    title: String,
    description: nullable<string>(() => null),
    sequence: Number,
    cardIds: Array<string>,
    ...timestamps,
  },
  taskCard: {
    id: primaryKey(faker.string.uuid),
    listId: String,
    title: String,
    content: nullable<string>(() => null),
    deadline: nullable<string>(() => null),
    done: Boolean,
    sequence: Number,
    ...timestamps,
  },
};
