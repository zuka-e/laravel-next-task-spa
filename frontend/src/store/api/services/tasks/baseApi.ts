import { createApi } from '@reduxjs/toolkit/query/react';

import { API_BASE_URL } from '@/config/api';
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
  baseQuery: axiosBaseQuery({ baseURL: API_BASE_URL }),
  reducerPath: 'taskApi',
  tagTypes: ['Session', 'TaskBoard', 'TaskList', 'TaskCard'],
  endpoints: () => ({}),
});

export default baseApi;
