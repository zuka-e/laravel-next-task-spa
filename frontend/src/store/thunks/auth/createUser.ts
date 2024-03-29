// `createAsyncThunk` returns a standard Redux thunk action creator.
import { createAsyncThunk } from '@reduxjs/toolkit';

import { GET_CSRF_TOKEN_PATH, SIGNUP_PATH } from '@/config/api';
import { User } from '@/models/User';
import { apiClient } from '@/utils/api';
import { AsyncThunkConfig } from '@/store/thunks/config';
import { makeRejectValue } from '@/store/thunks/utils';
import { setIntendedUrl, type FlashNotificationProps } from '@/store/slices';

export type SignUpRequest = {
  email: string;
  password: string;
  password_confirmation: string;
};

export type SignUpResponse = FlashNotificationProps & {
  user: User;
};

export const createUser = createAsyncThunk<
  SignUpResponse,
  SignUpRequest,
  AsyncThunkConfig
>('auth/createUser', async (payload, thunkApi) => {
  try {
    await apiClient({ apiRoute: false }).get(GET_CSRF_TOKEN_PATH);
    const response = await apiClient().post(SIGNUP_PATH, {
      name: payload.email,
      ...payload,
    });

    thunkApi.dispatch(setIntendedUrl('/email-verification'));

    return response?.data as SignUpResponse;
  } catch (error) {
    // `Slice`の`extraReducers`の`rejected`を呼び出す
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
