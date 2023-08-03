import { createAsyncThunk } from '@reduxjs/toolkit';

import { VERIFICATION_NOTIFICATION_PATH } from '@/config/api';
import { apiClient } from '@/utils/api';
import { AsyncThunkConfig } from '@/store/thunks/config';
import { makeRejectValue } from '@/store/thunks/utils';
import { type FlashNotificationProps } from '@/store/slices';

export type SendEmailVerificationLinkRequest = void;
export type SendEmailVerificationLinkResponse = FlashNotificationProps;

export const sendEmailVerificationLink = createAsyncThunk<
  SendEmailVerificationLinkResponse,
  SendEmailVerificationLinkRequest,
  AsyncThunkConfig
>('auth/sendVerificationLink', async (_, thunkApi) => {
  try {
    const response = await apiClient().post(VERIFICATION_NOTIFICATION_PATH);
    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
