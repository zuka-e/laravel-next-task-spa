import { createAsyncThunk } from '@reduxjs/toolkit';

import { SIGNUP_PATH } from '@/config/api';
import { apiClient } from '@/utils/api';
import { AsyncThunkConfig } from '@/store/thunks/config';
import { makeRejectValue } from '@/store/thunks/utils';
import { type FlashNotificationProps } from '@/store/slices';

export type DeleteAccountResponse = FlashNotificationProps;
export type DeleteAccountRequest = void;

export const deleteAccount = createAsyncThunk<
  DeleteAccountResponse,
  DeleteAccountRequest,
  AsyncThunkConfig
>('auth/deleteAccount', async (_, thunkApi) => {
  try {
    return (await apiClient().delete(SIGNUP_PATH)).data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
