import Router from 'next/router';

import {
  SESSION_PATH,
  SIGNIN_PATH,
  SIGNOUT_PATH,
  SIGNUP_PATH,
} from '@/config/api';
import baseApi from './baseApi';
import type {
  FetchSessionRequest,
  FetchSessionResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
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
    logout: builder.mutation<LogoutResponse, LogoutRequest>({
      query: () => ({ url: SIGNOUT_PATH, method: 'POST' }),
      // cf. https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#pessimistic-updates
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          // cf. https://redux-toolkit.js.org/rtk-query/api/created-api/api-slice-utils#resetapistate
          dispatch(baseApi.util.resetApiState());
        } catch (error) {
          //
        }
      },
      invalidatesTags: ['Session'],
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: SIGNUP_PATH,
        method: 'POST',
        data: { name: data.email, ...data },
      }),
      onQueryStarted() {
        sessionStorage.setItem('intendedUrl', '/email-verification');
      },
      invalidatesTags: ['Session', 'TaskBoard'],
    }),
  }),
});

export const {
  useGetSessionQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} = api;
