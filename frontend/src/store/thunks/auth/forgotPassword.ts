import { createAsyncThunk } from '@reduxjs/toolkit';

import { GET_CSRF_TOKEN_PATH, FORGOT_PASSWORD_PATH } from '@/config/api';
import { apiClient } from '@/utils/api';
import { AsyncThunkConfig } from '@/store/thunks/config';
import { makeRejectValue } from '@/store/thunks/utils';
import { type FlashNotificationProps } from '@/store/slices';

export type ForgotPasswordResponse = FlashNotificationProps;

export type ForgotPasswordRequest = {
  email: string;
};

export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordRequest,
  AsyncThunkConfig
>('auth/forgotPassword', async (payload, thunkApi) => {
  try {
    await apiClient({ apiRoute: false }).get(GET_CSRF_TOKEN_PATH);
    const response = await apiClient().post(FORGOT_PASSWORD_PATH, payload);

    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
