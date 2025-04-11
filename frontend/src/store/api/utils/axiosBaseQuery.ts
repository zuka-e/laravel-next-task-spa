import { type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import axios, {
  isAxiosError,
  type AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig as BaseAxiosRequestConfig,
  type CreateAxiosDefaults,
  type Method,
} from 'axios';

import { GET_CSRF_TOKEN_PATH } from '@/config/api';
import { setHttpStatus } from '@/store/slices';
import isReadRequest from './isReadRequest';

/**
 * More strict `AxiosRequestConfig`
 */
type AxiosRequestConfig<D = unknown> = BaseAxiosRequestConfig<D> & {
  /** @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods */
  method?: Extract<
    Uppercase<Method>,
    'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTION'
  >;
};

/**
 * `AxiosError` without non-serializable values
 *
 * ※ It'll counter `non-serializable value was detected` warning
 * when a middleware option, `serializableCheck`, is set to `false`.
 *
 * cf. https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling
 */
type SerializableAxiosError = Pick<AxiosError, 'isAxiosError'> & {
  response: Pick<NonNullable<AxiosError['response']>, 'status' | 'data'>;
};

/**
 * Base query function RTK Query uses
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/customizing-queries
 * @see https://redux-toolkit.js.org/rtk-query/usage-with-typescript#typing-a-basequery
 */
const axiosBaseQuery = (
  defaultConfig?: CreateAxiosDefaults,
): BaseQueryFn<
  AxiosRequestConfig,
  AxiosResponse<Record<string, unknown>>['data'],
  SerializableAxiosError
> => {
  const apiClient = axios.create({
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true,
    ...defaultConfig,
  });

  return async (config, api) => {
    try {
      if (!isReadRequest(config.method ?? 'GET')) {
        await apiClient.get(GET_CSRF_TOKEN_PATH);
      }
      const response = await apiClient.request(config);
      return { data: response.data };
    } catch (error) {
      if (!isAxiosError(error)) {
        throw error;
      }

      /** HTTP status code */
      const status = error.response?.status || 500;

      if (status !== 404) {
        api.dispatch(setHttpStatus(status));
      }

      return {
        error: {
          isAxiosError: error.isAxiosError,
          response: {
            status: status,
            data: error.response?.data,
          },
        },
      };
    }
  };
};

export default axiosBaseQuery;
