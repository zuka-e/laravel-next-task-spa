import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './utils';

/**
 * Define a base API for others which use the same config such as the query function.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/code-splitting
 */
const baseApi = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'api',
  tagTypes: ['Auth', 'TaskBoard'],
  endpoints: () => ({}),
});

export default baseApi;
