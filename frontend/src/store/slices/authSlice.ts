import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AlertColor } from '@mui/material';

import { User } from '@/models/User';
import { type RejectValue } from '@/store/thunks/config';
import {
  sendEmailVerificationLink,
  verifyEmail,
  signInWithEmail,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
  fetchSession,
} from '@/store/thunks/auth';

export type FlashNotificationProps = {
  severity: AlertColor;
  message: string;
};

export type AuthState = {
  user: User | null;
  signedIn: boolean;
  loading: boolean;
  flashes: FlashNotificationProps[];
};

/**
 * Push API error flash notification to the state
 */
const pushErrorFlash = (state: AuthState, rejectValue?: RejectValue): void => {
  const message = rejectValue?.error.message || 'Unexpected Error.';
  state.flashes = [...state.flashes, { severity: 'error', message }];
};

export const initialAuthState = {
  flashes: [] as AuthState['flashes'],
} as AuthState;

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  // cf. https://redux-toolkit.js.org/usage/immer-reducers
  reducers: {
    flushAllStates(state) {
      // ※ It's supposed to remove all state beforehand in `rootReducer()`
      state.signedIn = false;
      state.user = null;
    },
    /** Add new flash */
    pushFlash(state, action: PayloadAction<FlashNotificationProps>): void {
      state.flashes = [...state.flashes, { ...action.payload }];
    },
    /** Remove the first element of the flashes */
    shiftFlash(state): void {
      state.flashes = state.flashes.filter((_, i) => i !== 0);
    },
    signIn(state) {
      state.signedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSession.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(fetchSession.fulfilled, (state, action) => {
      const { user } = action.payload;

      state.loading = false;
      state.user = user;
      state.signedIn = !!user;
    });
    builder.addCase(fetchSession.rejected, (state, action) => {
      state.loading = false;
      pushErrorFlash(state, action.payload);
    });
    builder.addCase(sendEmailVerificationLink.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(sendEmailVerificationLink.fulfilled, (state, action) => {
      const { ...flash } = action.payload;
      state.loading = false;
      state.flashes = [...state.flashes, { ...flash }];
    });
    builder.addCase(sendEmailVerificationLink.rejected, (state, action) => {
      state.loading = false;
      pushErrorFlash(state, action.payload);
    });
    builder.addCase(verifyEmail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyEmail.fulfilled, (state, action) => {
      const { user, ...flash } = action.payload;

      state.loading = false;
      state.user = user;
      state.flashes.push({ ...flash });
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      state.loading = false;
      pushErrorFlash(state, action.payload);
    });
    builder.addCase(signInWithEmail.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(signInWithEmail.fulfilled, (state, action) => {
      const { user, ...flash } = action.payload;

      state.user = action.payload.user;
      state.flashes = [...state.flashes, { ...flash }];
      state.signedIn = true;
      state.loading = false;
    });
    builder.addCase(signInWithEmail.rejected, (state, action) => {
      state.signedIn = false;
      state.loading = false;
      pushErrorFlash(state, action.payload);
    });
    builder.addCase(updateProfile.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      const { user, ...flash } = action.payload;

      state.loading = false;
      state.user = action.payload.user;
      state.flashes = [...state.flashes, { ...flash }];
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      pushErrorFlash(state, action.payload);
    });
    builder.addCase(updatePassword.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      const { ...flash } = action.payload;

      state.loading = false;
      state.flashes = [...state.flashes, { ...flash }];
    });
    builder.addCase(updatePassword.rejected, (state, _action) => {
      state.loading = false;
    });
    builder.addCase(forgotPassword.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.flashes = [...state.flashes, { ...action.payload }];
    });
    builder.addCase(forgotPassword.rejected, (state, _action) => {
      state.loading = false;
    });
    builder.addCase(resetPassword.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      const { ...flash } = action.payload;

      state.loading = false;
      state.flashes = [...state.flashes, { ...flash }];
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      pushErrorFlash(state, action.payload);
    });
    builder.addCase(deleteAccount.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(deleteAccount.fulfilled, (state, action) => {
      const { ...flash } = action.payload;

      state.loading = false;
      state.user = null;
      state.signedIn = false;
      state.flashes = [...state.flashes, { ...flash }];
    });
    builder.addCase(deleteAccount.rejected, (state, action) => {
      state.loading = false;
      pushErrorFlash(state, action.payload);
    });
  },
});

export const { flushAllStates, pushFlash, shiftFlash, signIn } =
  authSlice.actions;
