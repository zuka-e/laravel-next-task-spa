import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
  httpStatus?: number;
  intendedUrl?: string;
};

const initialState: Partial<AppState> = {};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setHttpStatus(state, action: PayloadAction<AppState['httpStatus']>) {
      state.httpStatus = action.payload;
    },
    clearHttpStatus(state) {
      state.httpStatus = undefined;
    },
    setIntendedUrl(state, action: PayloadAction<AppState['intendedUrl']>) {
      state.intendedUrl = action.payload;
    },
    clearIntendedUrl(state) {
      state.intendedUrl = undefined;
    },
  },
});

export const {
  setHttpStatus,
  clearHttpStatus,
  setIntendedUrl,
  clearIntendedUrl,
} = appSlice.actions;
