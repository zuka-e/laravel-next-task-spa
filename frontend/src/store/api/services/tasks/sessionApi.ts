import {
  FORGOT_PASSWORD_PATH,
  RESET_PASSWORD_PATH,
  SESSION_PATH,
  SIGNIN_PATH,
  SIGNOUT_PATH,
  SIGNUP_PATH,
  UPDATE_PASSWORD_PATH,
  USER_INFO_PATH,
  VERIFICATION_NOTIFICATION_PATH,
  VERIFY_EMAIL_PATH,
} from '@/config/api';
import { getPreviousUrl, setIntendedUrl } from '@/lib/routes';
import baseApi from './baseApi';
import type {
  FetchSessionRequest,
  FetchSessionResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  RequestVerificationEmailRequest,
  RequestVerificationEmailResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
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
        };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const {
          data: { user },
        } = await queryFulfilled;

        dispatch(
          api.util.updateQueryData('getSession', undefined, (draft) => {
            draft.user = user;
          })
        );
      },
    }),
    requestVerificationEmail: builder.mutation<
      RequestVerificationEmailResponse,
      RequestVerificationEmailRequest
    >({
      query: () => ({ url: VERIFICATION_NOTIFICATION_PATH, method: 'POST' }),
    }),
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (data) => ({ url: USER_INFO_PATH, method: 'PATCH', data }),
      invalidatesTags: ['Session'],
    }),
    updatePassword: builder.mutation<
      UpdatePasswordResponse,
      UpdatePasswordRequest
    >({
      query: (data) => ({ url: UPDATE_PASSWORD_PATH, method: 'PATCH', data }),
      invalidatesTags: ['Session'],
    }),
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (data) => ({ url: FORGOT_PASSWORD_PATH, method: 'POST', data }),
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (data) => ({
        url: `${RESET_PASSWORD_PATH}/${data.token}`,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Session'],
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
  useRequestVerificationEmailMutation,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = api;
