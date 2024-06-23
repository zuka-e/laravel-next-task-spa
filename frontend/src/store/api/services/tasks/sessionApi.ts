import {
  SESSION_PATH,
  SIGNIN_PATH,
  SIGNOUT_PATH,
  SIGNUP_PATH,
  VERIFY_EMAIL_PATH,
} from '@/config/api';
import { getPreviousUrl, setIntendedUrl } from '@/lib/routes';
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
  VerifyEmailRequest,
  VerifyEmailResponse,
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
        setIntendedUrl(getPreviousUrl() ?? '/');
      },
      invalidatesTags: ['Session', 'TaskBoard'],
    }),
    logout: builder.mutation<LogoutResponse, LogoutRequest>({
      query: () => ({ url: SIGNOUT_PATH, method: 'POST' }),
      // cf. https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#pessimistic-updates
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        setIntendedUrl('/');

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
        setIntendedUrl('/email-verification');
      },
      invalidatesTags: ['Session', 'TaskBoard'],
    }),
    verifyEmail: builder.query<VerifyEmailResponse, VerifyEmailRequest>({
      query: (data) => {
        const { credentials, queryString } = data;
        const path = credentials.replace(' ', '/');

        return {
          url: `${VERIFY_EMAIL_PATH}/${path}?${queryString}`,
          method: 'GET',
        };
      },
      providesTags: ['Session'],
    }),
    // cf. https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#providing-errors-to-the-cache
    invalidateSession: builder.mutation<null, void>({
      queryFn: () => ({ data: null }),
      invalidatesTags: ['Session'],
    }),
  }),
});

export const {
  useGetSessionQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useVerifyEmailQuery,
  useInvalidateSessionMutation,
} = api;
