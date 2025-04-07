import { isAxiosError } from 'axios';
import {
  type Middleware,
  type PayloadAction,
  isAsyncThunkAction,
} from '@reduxjs/toolkit';

import type { GuardType } from '@/types/utils';
import { pushNotification } from '@/store/slices';
import { type ApiResponse } from '@/store/api/services/tasks';
import { isApiResponse } from '@/store/api/services/tasks/utils';

/**
 * Determine if the action is an API response.
 */
const isAsyncThunkActionResponse = (
  action: unknown,
): action is GuardType<typeof isAsyncThunkAction> &
  PayloadAction<ApiResponse> => {
  if (!isAsyncThunkAction(action)) {
    return false;
  }

  const response = isAxiosError(action.payload)
    ? action.payload.response?.data
    : action.payload;

  return isApiResponse(response);
};

/**
 * Determine if the `response` should be notified.
 */
const shouldNotify = (response: ApiResponse): boolean => {
  const notifiable: ApiResponse['severity'][] = ['success', 'warning', 'error'];

  return notifiable.includes(response.severity);
};

/**
 * Display a notification if the API response contains certain props.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/error-handling#handling-errors-at-a-macro-level
 * @see https://redux.js.org/usage/usage-with-typescript#type-checking-middleware
 */
const apiResponseNotification: Middleware = (api) => (next) => (action) => {
  if (isAsyncThunkActionResponse(action) && shouldNotify(action.payload)) {
    api.dispatch(pushNotification(action.payload));
  }

  return next(action);
};

export default apiResponseNotification;
