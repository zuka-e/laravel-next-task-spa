import { createAsyncThunk } from '@reduxjs/toolkit';

import { GET_CSRF_TOKEN_PATH, SIGNIN_PATH } from '@/config/api';
import { User } from '@/models/User';
import { apiClient } from '@/utils/api';
import { AsyncThunkConfig } from '@/store/thunks/config';
import { makeRejectValue } from '@/store/thunks/utils';
import { setIntendedUrl, type FlashNotificationProps } from '@/store/slices';

export type SignInResponse = FlashNotificationProps & {
  user: User;
};

export type SignInRequest = {
  email: string;
  password: string;
  remember?: string;
};

export const signInWithEmail = createAsyncThunk<
  SignInResponse,
  SignInRequest,
  AsyncThunkConfig
>('auth/signInWithEmail', async (payload, thunkApi) => {
  try {
    await apiClient({ apiRoute: false }).get(GET_CSRF_TOKEN_PATH);
    const response = await apiClient().post(SIGNIN_PATH, payload);

    thunkApi.dispatch(
      setIntendedUrl(sessionStorage.getItem('previousUrl') || undefined)
    );

    return response?.data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
