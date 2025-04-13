import { isAsyncThunkAction, type Middleware } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { NOTIFIABLE } from '@/store/api/config/response';
import { isApiResponse } from '@/store/api/services/tasks/utils';
import { pushNotification } from '@/store/slices';
import { isPlainObject } from '@/utils/types';

/**
 * Create a notification action if the API response contains certain props.
 */
const createNotificationIfNeeded = (action: unknown) => {
  if (!isAsyncThunkAction(action)) {
    return;
  }

  const status = isAxiosError(action.payload)
    ? action.payload.response?.status
    : undefined;

  if (status === 404) {
    return;
  }

  const data = isAxiosError(action.payload)
    ? action.payload.response?.data
    : action.payload;

  if (!isPlainObject(data)) {
    return;
  }

  if (!isApiResponse(data)) {
    return;
  }

  if (!NOTIFIABLE.includes(data.severity as (typeof NOTIFIABLE)[number])) {
    return;
  }

  return pushNotification(data);
};

/**
 * Display a notification if the API response contains certain props.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/error-handling#handling-errors-at-a-macro-level
 * @see https://redux.js.org/usage/usage-with-typescript#type-checking-middleware
 */
const apiResponseNotification: Middleware = (api) => (next) => (action) => {
  const notification = createNotificationIfNeeded(action);

  if (notification) {
    api.dispatch(notification);
  }

  return next(action);
};

export default apiResponseNotification;
