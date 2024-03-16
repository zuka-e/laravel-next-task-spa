import {
  type AnyAction,
  type MiddlewareAPI,
  type Middleware,
  isRejected,
} from '@reduxjs/toolkit';

/**
 * Logger middleware that logs all actions to the console.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/error-handling#handling-errors-at-a-macro-level
 */
const logger: Middleware =
  (_api: MiddlewareAPI) => (next) => (action: AnyAction) => {
    if (isRejected(action)) {
      console.warn(action);
    } else {
      console.log(action);
    }

    return next(action);
  };

export default logger;
