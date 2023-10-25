import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from '@/store/api/utils';

/**
 * Define a base API for others which use the same config such as the query function.
 *
 * > Typically, you should only have one API slice per base URL
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/code-splitting
 * @see https://redux-toolkit.js.org/rtk-query/api/createApi
 * @see https://redux-toolkit.js.org/rtk-query/api/created-api/overview
 */
const baseApi = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'taskApi',
  tagTypes: ['TaskBoard'],
  endpoints: () => ({}),
});

export default baseApi;
