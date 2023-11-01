import Router from 'next/router';

import { SESSION_PATH, SIGNIN_PATH } from '@/config/api';
import baseApi from './baseApi';
import type {
  FetchSessionRequest,
  FetchSessionResponse,
  LoginRequest,
  LoginResponse,
} from './types';

/**
 * @see https://redux-toolkit.js.org/rtk-query/usage/queries
 * @see https://redux-toolkit.js.org/rtk-query/usage/mutations
 * @see https://redux-toolkit.js.org/rtk-query/api/created-api/code-splitting
 */
const api = baseApi.injectEndpoints({
  // > If you inject an endpoint that already exists
  // > and don't explicitly specify `overrideExisting: true`,
  // > `the endpoint will not be overridden.
  // > https://redux-toolkit.js.org/rtk-query/usage/code-splitting
  overrideExisting: true,
  endpoints: (builder) => ({
    // cf. https://redux-toolkit.js.org/rtk-query/usage/queries
    getSession: builder.query<FetchSessionResponse, FetchSessionRequest>({
      query: () => ({ url: SESSION_PATH }),
      providesTags: ['Session'],
    }),
    // cf. https://redux-toolkit.js.org/rtk-query/usage/mutations
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({ url: SIGNIN_PATH, method: 'POST', data }),
      // cf. https://redux-toolkit.js.org/rtk-query/api/createApi#onquerystarted
      onQueryStarted() {
        const previousUrl = sessionStorage.getItem('previousUrl');

        if (previousUrl && previousUrl !== Router.asPath) {
          sessionStorage.setItem('intendedUrl', previousUrl);
        }
      },
      invalidatesTags: ['Session', 'TaskBoard'],
    }),
  }),
});

export const { useGetSessionQuery, useLoginMutation } = api;
