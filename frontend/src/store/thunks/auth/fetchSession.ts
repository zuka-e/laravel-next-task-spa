import { createAsyncThunk } from '@reduxjs/toolkit';

import { SESSION_PATH } from '@/config/api';
import type { User } from '@/models/User';
import { apiClient } from '@/utils/api';
import type { AsyncThunkConfig } from '@/store/thunks/config';
import { makeRejectValue } from '@/store/thunks/utils';

export type FetchSessionResponse = {
  user: User | null;
};
export type FetchSessionRequest = void;

const fetchSession = createAsyncThunk<
  FetchSessionResponse,
  FetchSessionRequest,
  AsyncThunkConfig
>('auth/fetchSession', async (_, thunkApi) => {
  try {
    return (await apiClient().get(SESSION_PATH)).data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

export default fetchSession;
