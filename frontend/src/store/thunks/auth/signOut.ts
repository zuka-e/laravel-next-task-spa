import { createAsyncThunk } from '@reduxjs/toolkit';

import { SIGNOUT_PATH } from '@/config/api';
import { apiClient } from '@/utils/api';
import { AsyncThunkConfig } from '@/store/thunks/config';
import { makeRejectValue } from '@/store/thunks/utils';
import { type FlashNotificationProps } from '@/store/slices';

export type SignOutResponse = FlashNotificationProps;
export type SignOutRequest = void;

export const signOut = createAsyncThunk<
  SignOutResponse,
  SignOutRequest,
  AsyncThunkConfig
>('auth/signOut', async (_, thunkApi) => {
  try {
    return (await apiClient().post(SIGNOUT_PATH)).data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
