import { type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import {
  type AxiosRequestConfig as BaseAxiosRequestConfig,
  type Method,
} from 'axios';

import { GET_CSRF_TOKEN_PATH } from '@/config/api';
import { apiClient } from '@/utils/api';
import isReadRequest from './isReadRequest';

type AxiosRequestConfig<D = unknown> = BaseAxiosRequestConfig<D> & {
  /** @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods */
  method?: Extract<
    Uppercase<Method>,
    'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTION'
  >;
};

/**
 * Base query function RTK Query uses
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/customizing-queries
 * @see https://redux-toolkit.js.org/rtk-query/usage-with-typescript#typing-a-basequery
 */
const axiosBaseQuery =
  (): BaseQueryFn<AxiosRequestConfig, unknown, unknown> => async (config) => {
    try {
      if (!isReadRequest(config.method ?? 'GET')) {
        await apiClient({ apiRoute: false }).get(GET_CSRF_TOKEN_PATH);
      }
      const response = await apiClient().request(config);
      return { data: response.data };
    } catch (error) {
      // cf. https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling
      return { error };
    }
  };

export default axiosBaseQuery;
