import {
  type AnyAction,
  type MiddlewareAPI,
  type Middleware,
  type PayloadAction,
  isAsyncThunkAction,
} from '@reduxjs/toolkit';
import { type UnknownAsyncThunkAction } from '@reduxjs/toolkit/dist/matchers';

import { pushFlash, type FlashNotificationProps } from '@/store/slices';

const severities: FlashNotificationProps['severity'][] = [
  'error',
  'warning',
  'info',
  'success',
];

/**
 * Determine if an action includes notification props.
 */
const isAsyncThunkActionWithFlash = (
  action: unknown
): action is UnknownAsyncThunkAction &
  PayloadAction<FlashNotificationProps> => {
  if (!isAsyncThunkAction(action)) {
    return false;
  }

  // Determine if an `AsyncThunkAction` that has a payload with object type.
  if (!(typeof action.payload === 'object' && action.payload !== null)) {
    return false;
  }

  return (
    'severity' in action.payload &&
    typeof action.payload.severity === 'string' &&
    (severities as string[]).includes(action.payload.severity) &&
    'message' in action.payload &&
    typeof action.payload.message === 'string'
  );
};

/**
 * Display a notification if the API response contains certain props.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/error-handling#handling-errors-at-a-macro-level
 */
const apiResponseNotification: Middleware =
  (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
    if (isAsyncThunkActionWithFlash(action)) {
      api.dispatch(pushFlash(action.payload));
    }

    return next(action);
  };

export default apiResponseNotification;
