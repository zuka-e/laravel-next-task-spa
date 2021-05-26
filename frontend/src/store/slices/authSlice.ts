import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from 'models/User';
import { FlashNotificationProps } from 'layouts/FlashNotification';
import { createUser } from 'store/thunks/createUser';
import { fetchAuthUser } from 'store/thunks/fetchAuthUser';
import { sendEmailVerificationLink } from 'store/thunks/sendEmailVerificationLink';
import { signInWithEmail } from 'store/thunks/signInWithEmail';
import { updateProfile } from 'store/thunks/updateProfile';
import { updatePassword } from 'store/thunks/updatePassword';
import { forgotPassword } from 'store/thunks/forgotPassoword';
import { resetPassword } from 'store/thunks/resetPassword';
import { putSignOut } from 'store/thunks/putSignOut';
import { deleteAccount } from 'store/thunks/deleteAccount';

type AuthState = {
  user: User | null;
  sentEmail: boolean;
  signedIn: boolean;
  loading: boolean;
  flash: FlashNotificationProps[];
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { flash: [{}] } as AuthState,
  reducers: {
    setFlash(state, action: PayloadAction<FlashNotificationProps>) {
      const { type, message } = action.payload;
      state.flash.push({ type, message });
    },
    deleteSentEmailState(state) {
      state.sentEmail = false;
    },
    signIn(state) {
      state.signedIn = true;
    },
    signOut(state) {
      state.signedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.sentEmail = true;
      state.signedIn = true;
      state.loading = false;
      state.flash.push({
        type: 'success',
        message: 'ユーザー登録が完了しました',
      });
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.signedIn = false;
      state.loading = false;
    });
    builder.addCase(fetchAuthUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchAuthUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.signedIn = true;
      state.loading = false;
    });
    builder.addCase(fetchAuthUser.rejected, (state, action) => {
      state.user = null;
      state.signedIn = false;
      state.loading = false;
    });
    builder.addCase(sendEmailVerificationLink.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(sendEmailVerificationLink.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload === 202) {
        state.flash.push({
          type: 'success',
          message: '認証用メールを送信しました',
        });
      } else if (action.payload === 204) {
        state.sentEmail = false;
        state.flash.push({
          type: 'error',
          message: '既に認証済みです',
        });
      }
    });
    builder.addCase(sendEmailVerificationLink.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(signInWithEmail.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(signInWithEmail.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.signedIn = true;
      state.loading = false;
      // 認証メールリンクからのリダイレクトの場合 `true`
      action.payload.verified
        ? state.flash.push({ type: 'success', message: '認証に成功しました' })
        : state.flash.push({ type: 'info', message: 'ログインしました' });
    });
    builder.addCase(signInWithEmail.rejected, (state, action) => {
      state.signedIn = false;
      state.loading = false;
    });
    builder.addCase(updateProfile.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      if (!state.user) return; // `null`を排除 (state.user?利用不可)

      if (state.user.email !== action.payload.email) {
        state.user.name = action.payload.username;
        state.user.email = action.payload.email;
        state.user.emailVerifiedAt = null;
        state.flash.push({
          type: 'info',
          message: '認証用メールを送信しました',
        });
      } else {
        state.user.name = action.payload.username;
        state.user.email = action.payload.email;
        state.flash.push({
          type: 'success',
          message: 'ユーザー情報を更新しました',
        });
      }
      state.loading = false;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updatePassword.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.flash.push({
        type: 'success',
        message: 'パスワードを変更しました',
      });
      state.loading = false;
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(forgotPassword.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.flash.push({
        type: 'success',
        message: 'パスワード再設定用のメールを送信しました',
      });
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(resetPassword.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.flash.push({
        type: 'success',
        message: 'パスワードを再設定しました',
      });
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(putSignOut.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(putSignOut.fulfilled, (state, action) => {
      state.user = null;
      state.signedIn = false;
      state.loading = false;
      state.flash.push({ type: 'success', message: 'ログアウトしました' });
    });
    builder.addCase(putSignOut.rejected, (state, action) => {
      state.signedIn = false;
      state.loading = false;
    });
    builder.addCase(deleteAccount.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteAccount.fulfilled, (state, action) => {
      state.user = null;
      state.signedIn = false;
      state.loading = false;
      state.flash.push({
        type: 'warning',
        message: 'アカウントは削除されました',
      });
    });
    builder.addCase(deleteAccount.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export const { setFlash, deleteSentEmailState, signIn, signOut } =
  authSlice.actions;

export default authSlice;
