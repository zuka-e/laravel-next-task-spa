import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AlertColor } from '@mui/material';

import { User } from '@/models/User';
import {
  createUser,
  fetchAuthUser,
  sendEmailVerificationLink,
  verifyEmail,
  signInWithEmail,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  signOut,
  deleteAccount,
} from '@/store/thunks/auth';

export type FlashNotificationProps = {
  severity: AlertColor;
  message: string;
};

export type AuthState = {
  user: User | null;
  signedIn: boolean;
  loading: boolean;
  flash: FlashNotificationProps[];
};

export const initialAuthState = {
  flash: [] as AuthState['flash'],
} as AuthState;

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    flushAllStates(state) {
      // ※ It's supposed to remove all state beforehand in `rootReducer()`
      state.signedIn = false;
      state.user = null;
    },
    setFlash(state, action: PayloadAction<FlashNotificationProps>) {
      state.flash.push({ ...action.payload });
    },
    signIn(state) {
      state.signedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.signedIn = true;
      state.loading = false;
      state.flash.push({
        severity: 'success',
        message: 'ユーザー登録が完了しました',
      });
    });
    builder.addCase(createUser.rejected, (state, _action) => {
      state.signedIn = false;
      state.loading = false;
    });
    builder.addCase(fetchAuthUser.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(fetchAuthUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.signedIn = true;
      state.loading = false;
    });
    builder.addCase(fetchAuthUser.rejected, (state, _action) => {
      state.user = null;
      state.signedIn = false;
      state.loading = false;
    });
    builder.addCase(sendEmailVerificationLink.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(sendEmailVerificationLink.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload === 202) {
        state.flash.push({
          severity: 'success',
          message: '認証用メールを送信しました',
        });
      } else if (action.payload === 204) {
        state.flash.push({
          severity: 'error',
          message: '既に認証済みです',
        });
      }
    });
    builder.addCase(sendEmailVerificationLink.rejected, (state, _action) => {
      state.loading = false;
    });
    builder.addCase(verifyEmail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyEmail.fulfilled, (state, action) => {
      const { user, ...flash } = action.payload;
      state.loading = false;
      state.user = user;
      state.flash.push({ ...flash });
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      state.loading = false;
      state.flash.push({
        severity: 'error',
        message: action.payload?.error.message || 'Unexpected Error.',
      });
    });
    builder.addCase(signInWithEmail.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(signInWithEmail.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.signedIn = true;
      state.loading = false;
      state.flash.push({ severity: 'info', message: 'ログインしました' });
    });
    builder.addCase(signInWithEmail.rejected, (state, _action) => {
      state.signedIn = false;
      state.loading = false;
    });
    builder.addCase(updateProfile.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      if (!state.user) return; // `null`を排除 (state.user?利用不可)

      state.loading = false;
      state.user.name = action.payload.name;

      if (state.user.email !== action.payload.email) {
        state.user.email = action.payload.email;
        state.user.emailVerifiedAt = null;
        state.flash.push({
          severity: 'info',
          message: '認証用メールを送信しました',
        });
      } else {
        state.user.email = action.payload.email;
        state.flash.push({
          severity: 'success',
          message: 'ユーザー情報を更新しました',
        });
      }
    });
    builder.addCase(updateProfile.rejected, (state, _action) => {
      state.loading = false;
    });
    builder.addCase(updatePassword.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(updatePassword.fulfilled, (state, _action) => {
      state.flash.push({
        severity: 'success',
        message: 'パスワードを変更しました',
      });
      state.loading = false;
    });
    builder.addCase(updatePassword.rejected, (state, _action) => {
      state.loading = false;
    });
    builder.addCase(forgotPassword.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state, _action) => {
      state.loading = false;
      state.flash.push({
        severity: 'success',
        message: 'パスワード再設定用のメールを送信しました',
      });
    });
    builder.addCase(forgotPassword.rejected, (state, _action) => {
      state.loading = false;
    });
    builder.addCase(resetPassword.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state, _action) => {
      state.loading = false;
      state.flash.push({
        severity: 'success',
        message: 'パスワードを再設定しました',
      });
    });
    builder.addCase(resetPassword.rejected, (state, _action) => {
      state.loading = false;
    });
    builder.addCase(signOut.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(signOut.fulfilled, (state, _action) => {
      state.user = null;
      state.signedIn = false;
      state.loading = false;
      state.flash.push({ severity: 'success', message: 'ログアウトしました' });
    });
    builder.addCase(signOut.rejected, (state, _action) => {
      state.signedIn = false;
      state.loading = false;
    });
    builder.addCase(deleteAccount.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(deleteAccount.fulfilled, (state, _action) => {
      state.user = null;
      state.signedIn = false;
      state.loading = false;
      state.flash.push({
        severity: 'warning',
        message: 'アカウントは削除されました',
      });
    });
    builder.addCase(deleteAccount.rejected, (state, _action) => {
      state.loading = false;
    });
  },
});

export const { flushAllStates, setFlash, signIn } = authSlice.actions;
