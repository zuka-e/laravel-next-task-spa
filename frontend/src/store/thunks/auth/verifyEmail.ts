import { createAsyncThunk } from '@reduxjs/toolkit';

import { VERIFY_EMAIL_PATH } from '@/config/api';
import type { AsyncThunkConfig } from '@/store/thunks/config';
import { type FlashNotificationProps } from '@/store/slices';
import type { User } from '@/models/User';
import { apiClient } from '@/utils/api';
import { makeRejectValue } from '@/store/thunks/utils';

export type VerifyEmailRequest = {
  credentials: string;
  queryString: string;
};

export type VerifyEmailResponse = FlashNotificationProps & {
  user: User;
};

const verifyEmail = createAsyncThunk<
  VerifyEmailResponse,
  VerifyEmailRequest,
  AsyncThunkConfig
>('auth/verifyEmail', async (payload, thunkApi) => {
  const { credentials, queryString } = payload;

  try {
    const response = await apiClient().get<VerifyEmailResponse>(
      `${VERIFY_EMAIL_PATH}/${credentials.replace(' ', '/')}?${queryString}`
    );

    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

export default verifyEmail;
