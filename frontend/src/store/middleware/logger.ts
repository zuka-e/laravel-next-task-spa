import { type Middleware, isAction, isRejected } from '@reduxjs/toolkit';

/**
 * Logger middleware that logs all actions to the console.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/error-handling#handling-errors-at-a-macro-level
 * @see https://redux.js.org/usage/usage-with-typescript#type-checking-middleware
 */
const logger: Middleware = (_api) => (next) => (action) => {
  if (isRejected(action)) {
    console.warn(action);
  } else if (isAction(action)) {
    console.log(action);
  }

  return next(action);
};

export default logger;
