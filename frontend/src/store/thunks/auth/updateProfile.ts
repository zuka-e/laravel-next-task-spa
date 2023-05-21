import { createAsyncThunk } from '@reduxjs/toolkit';

import { USER_INFO_PATH } from '@/config/api';
import { apiClient } from '@/utils/api';
import { AsyncThunkConfig } from '@/store/thunks/config';
import { makeRejectValue } from '@/store/thunks/utils';
import { type FlashNotificationProps } from '@/store/slices';
import { type User } from '@/models/User';

export type UpdateProfileResponse = FlashNotificationProps & {
  user: User;
};

export type UpdateProfileRequest = {
  name: string;
  email: string;
};

export const updateProfile = createAsyncThunk<
  UpdateProfileResponse,
  UpdateProfileRequest,
  AsyncThunkConfig
>('auth/updateProfile', async (payload, thunkApi) => {
  try {
    return (await apiClient().put(USER_INFO_PATH, payload)).data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
