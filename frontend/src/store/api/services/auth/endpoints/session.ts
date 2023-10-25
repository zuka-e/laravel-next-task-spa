import type { User } from '@/models';
import { SESSION_PATH, SIGNIN_PATH } from '@/config/api';
import { type FlashNotificationProps } from '@/store/slices';
import { type Endpoints } from '../baseApi';

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

const endpoints = ((builder) => ({
  getSession: builder.query<FetchSessionResponse, FetchSessionRequest>({
    query: () => ({ url: SESSION_PATH }),
    providesTags: ['Session'],
  }),
  login: builder.mutation<SignInResponse, SignInRequest>({
    query: (data) => ({ url: SIGNIN_PATH, data, method: 'POST' }),
    invalidatesTags: ['Session'],
  }),
})) satisfies Endpoints;

export default endpoints;
