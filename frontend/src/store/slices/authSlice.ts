import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AlertColor } from '@mui/material';

export type FlashNotificationProps = {
  severity: AlertColor;
  message: string;
};

export type AuthState = {
  flashes: FlashNotificationProps[];
};

export const initialAuthState = {
  flashes: [] as AuthState['flashes'],
} as AuthState;

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  // cf. https://redux-toolkit.js.org/usage/immer-reducers
  reducers: {
    /** Add new flash */
    pushFlash(state, action: PayloadAction<FlashNotificationProps>): void {
      state.flashes = [...state.flashes, { ...action.payload }];
    },
    /** Remove the first element of the flashes */
    shiftFlash(state): void {
      state.flashes = state.flashes.filter((_, i) => i !== 0);
    },
  },
});

export const { pushFlash, shiftFlash } = authSlice.actions;
