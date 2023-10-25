import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from '@/store/api/utils';

/**
 * Define a base API for others which use the same config such as the query function.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/code-splitting
 */
const baseApi = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'authApi',
  tagTypes: ['Session'],
  endpoints: () => ({}),
});

export type Endpoints = Parameters<
  typeof baseApi['injectEndpoints']
>[number]['endpoints'];

export default baseApi;
