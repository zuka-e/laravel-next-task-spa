import type { User } from '@/models';
import { SESSION_PATH, SIGNIN_PATH } from '@/config/api';
import { type FlashNotificationProps } from '@/store/slices';
import api from './baseApi';

export type FetchSessionResponse = {
  user: User | null;
};
export type FetchSessionRequest = void;

export type SignInResponse = FlashNotificationProps & {
  user: User;
};

export type SignInRequest = {
  email: string;
  password: string;
  remember?: string;
};

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSession: build.query<FetchSessionResponse, FetchSessionRequest>({
      query: () => ({ url: SESSION_PATH }),
      providesTags: ['Auth'],
    }),
    login: build.mutation<SignInResponse, SignInRequest>({
      query: (data) => ({ url: SIGNIN_PATH, data, method: 'POST' }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export default authApi;
export const { useGetSessionQuery, useLoginMutation } = authApi;
