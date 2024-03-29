import { GUEST_EMAIL, GUEST_PASSWORD } from '@/config/app';
import { signIn } from '@/store/slices/authSlice';
import {
  sendEmailVerificationLink,
  SignInRequest,
  signInWithEmail,
} from '@/store/thunks/auth';
import { unverifiedUser } from '@test/data/users';
import { initializeStore, store } from '@test/store';
import {
  getFlashState,
  getUserState,
  isLoading,
  isSignedIn,
} from '@test/utils/store/auth';
import { CSRF_TOKEN } from '@test/utils/validation';

describe('Thunk requesting the Email verification link', () => {
  beforeEach(() => {
    initializeStore();
  });

  describe('Rejected', () => {
    it('should throw an error without a session', async () => {
      // `store`によるログイン状態を用意する
      store.dispatch(signIn());
      expect(isSignedIn(store)).toBe(true);
      // dispatch
      const response = await store.dispatch(sendEmailVerificationLink());
      expect(sendEmailVerificationLink.rejected.match(response)).toBe(true);

      expect(isLoading(store)).toBe(false);
      expect(store.getState().app.httpStatus).toBe(401);
    });

    it('should throw an error without a valid token', async () => {
      const signInRequest: SignInRequest = {
        email: GUEST_EMAIL,
        password: GUEST_PASSWORD,
      };
      // ログイン
      await store.dispatch(signInWithEmail(signInRequest));
      // token削除
      localStorage.removeItem(CSRF_TOKEN);
      // dispatch
      const response = await store.dispatch(sendEmailVerificationLink());
      expect(sendEmailVerificationLink.rejected.match(response)).toBe(true);

      expect(isLoading(store)).toBe(false);
      expect(store.getState().app.httpStatus).toBe(419);
    });
  });

  describe('Fulfilled', () => {
    it('should not be the state right after registration if verified', async () => {
      const signInRequest: SignInRequest = {
        email: GUEST_EMAIL,
        password: GUEST_PASSWORD,
      };
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      expect(getUserState(store)?.emailVerifiedAt).toBeTruthy(); // 認証済みユーザー
      // dispatch
      const response = await store.dispatch(sendEmailVerificationLink());
      expect(sendEmailVerificationLink.fulfilled.match(response)).toBe(true);

      expect(isLoading(store)).toBe(false);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        severity: 'error',
        message: '既に認証済みです',
      });
    });

    it('should send a verification email', async () => {
      const signInRequest: SignInRequest = {
        email: unverifiedUser.email,
        password: GUEST_PASSWORD,
      };
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      expect(getUserState(store)?.emailVerifiedAt).toBeNull(); // 未認証ユーザー
      // dispatch
      const response = await store.dispatch(sendEmailVerificationLink());
      expect(sendEmailVerificationLink.fulfilled.match(response)).toBe(true);

      expect(isLoading(store)).toBe(false);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        severity: 'success',
        message: '認証用メールを送信しました',
      });
    });
  });
});
