import type {
  MiddlewareAPI,
  Middleware,
  PayloadAction,
} from '@reduxjs/toolkit';

import { pushFlash, type FlashNotificationProps } from '@/store/slices';

/**
 * Determine if an action is `PayloadAction` with object.
 */
const isObjectPayloadAction = (
  action: unknown
): action is PayloadAction<Record<string, unknown>> => {
  return (
    action !== null &&
    typeof action === 'object' &&
    'type' in action &&
    'payload' in action &&
    typeof action.payload === 'object'
  );
};

/**
 * Determine if an action includes notification props.
 */
const hasFlash = (
  action: unknown
): action is PayloadAction<FlashNotificationProps> => {
  return (
    isObjectPayloadAction(action) &&
    action.type !== pushFlash.type &&
    'severity' in action.payload &&
    'message' in action.payload
  );
};

/**
 * Display a notification if the API response contains certain props.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/error-handling#handling-errors-at-a-macro-level
 */
const apiResponseNotification: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (hasFlash(action)) {
      api.dispatch(pushFlash(action.payload));
    }

    return next(action);
  };

export default apiResponseNotification;
