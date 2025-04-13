import dayjs from 'dayjs';
import { HttpResponse, http, type PathParams } from 'msw';

import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
import type {
  DeleteAccountResponse,
  FetchSessionResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  RequestVerificationEmailResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ValidationErrorResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '@/store/api';
import { getUser, logoutWithSession } from '@test/api/auth';
import db from '@test/api/database/manager';
import type { User } from '@test/api/database/models';
import {
  createUserController,
  deleteAccountController,
  resetPasswordController,
  updatePasswordController,
  updateProfileController,
} from '@test/api/http/controllers';
import { validateSignature } from '@test/api/http/middleware';
import {
  authorizationErrorResponse,
  validationErrorResponse,
} from '@test/api/http/responses/errors';
import { withMiddleware } from '@test/api/http/utils';
import { generatePasswordResetUrl } from '@test/api/http/utils/passwords';
import { authenticate, isUniqueEmail } from '@test/api/http/utils/validation';
import { generateVerificationUrl } from '@test/api/http/utils/verifications';
import { verifyHash } from '@test/utils/crypto';

const sanitizeUser = (user: User): Omit<User, 'password'> => {
  const { password, ...visible } = user;
  return visible;
};

export const handlers = [
  http.post(
    API_BASE_URL + API_ENDPOINTS.AUTH.SIGNUP,
    withMiddleware<
      PathParams,
      RegisterRequest,
      RegisterResponse | ValidationErrorResponse
    >()(async ({ request }) => {
      const requestData = await request.json();

      if (!isUniqueEmail(requestData.email)) {
        return validationErrorResponse({
          email: ['このメールアドレスは既に使用されています。'],
        });
      }

      const newUser = createUserController.store(requestData);

      // as if sending verification email
      console.info({
        'verification URL': generateVerificationUrl(newUser),
      });

      const data: RegisterResponse = {
        severity: 'success',
        message: '認証用メールを送信しました。',
        user: sanitizeUser(newUser),
      };

      return HttpResponse.json(data, { status: 201 });
    }),
  ),

  http.get(
    API_BASE_URL + API_ENDPOINTS.AUTH.CSRF_TOKEN,
    withMiddleware()(async () => {
      // cf. https://github.com/laravel/sanctum/blob/3.x/src/Http/Controllers/CsrfCookieController.php
      return HttpResponse.json({
        severity: 'info',
        message: 'CSRFトークンを取得しました。',
      });
    }),
  ),

  http.get(
    API_BASE_URL + API_ENDPOINTS.AUTH.SESSION,
    withMiddleware<PathParams, undefined, FetchSessionResponse>()(() => {
      const currentUser = getUser();

      return HttpResponse.json({
        severity: 'info',
        message: 'ユーザー情報を取得しました。',
        user: currentUser ? sanitizeUser(currentUser) : null,
      });
    }),
  ),

  http.post(
    API_BASE_URL + API_ENDPOINTS.AUTH.VERIFICATION_NOTIFICATION,
    withMiddleware<
      PathParams,
      undefined,
      RequestVerificationEmailResponse | ValidationErrorResponse
    >()(() => {
      const currentUser = getUser()!;

      // as if sending verification email
      console.info({
        'verification URL': generateVerificationUrl(currentUser),
      });

      const data: RequestVerificationEmailResponse = currentUser.emailVerifiedAt
        ? {
            severity: 'error',
            message: '既に認証済みです。',
          }
        : {
            severity: 'success',
            message: '認証用メールを送信しました。',
          };

      return HttpResponse.json(data);
    }),
  ),

  http.post(
    API_BASE_URL + API_ENDPOINTS.AUTH.LOGIN,
    withMiddleware<
      PathParams,
      LoginRequest,
      LoginResponse | ValidationErrorResponse
    >()(async ({ request }) => {
      const requestData = await request.json();

      const user = await authenticate(requestData);

      if (!user) {
        return validationErrorResponse({ email: ['認証に失敗しました。'] });
      }

      const data: LoginResponse = {
        severity: 'info',
        message: 'ログインしました。',
        user: sanitizeUser(user),
      };

      return HttpResponse.json(data, { status: 201 });
    }),
  ),

  http.get(
    API_BASE_URL + API_ENDPOINTS.AUTH.VERIFY_EMAIL,
    withMiddleware<
      PathParams<'token' | 'hash'>,
      VerifyEmailRequest,
      VerifyEmailResponse | ValidationErrorResponse
    >([validateSignature])(({ params }) => {
      /** An unpredictable value like UUID */
      const token = params['token']?.toString() ?? '';
      /** Token hash */
      const hash = params['hash']?.toString() ?? '';

      if (!verifyHash(token, hash)) {
        return authorizationErrorResponse('Invalid Signature.');
      }

      const user = db.user.findFirst({ where: { id: { equals: token } } });

      if (!user || user.emailVerifiedAt) {
        return authorizationErrorResponse('Invalid Signature.');
      }

      const updatedUser = db.user.update({
        where: { id: { equals: user.id } },
        data: { ...user, emailVerifiedAt: dayjs().toISOString() },
        strict: true,
      });

      return HttpResponse.json({
        severity: 'info',
        message: '認証に成功しました。',
        user: sanitizeUser(updatedUser),
      });
    }),
  ),

  http.patch(
    API_BASE_URL + API_ENDPOINTS.AUTH.UPDATE_PROFILE,
    withMiddleware<
      PathParams,
      UpdateProfileRequest,
      UpdateProfileResponse | ValidationErrorResponse
    >()(async ({ request }) => {
      const requestData = await request.json();

      if (requestData.email && !isUniqueEmail(requestData.email)) {
        return validationErrorResponse({
          email: ['このメールアドレスは既に使用されています。'],
        });
      }

      const updatedUser = updateProfileController.update(
        getUser()!,
        requestData,
      );

      const data: UpdateProfileResponse = {
        severity: 'success',
        message: 'ユーザー情報を更新しました。',
        user: sanitizeUser(updatedUser),
      };

      return HttpResponse.json(data);
    }),
  ),

  http.patch(
    API_BASE_URL + API_ENDPOINTS.AUTH.UPDATE_PASSWORD,
    withMiddleware<
      PathParams,
      UpdatePasswordRequest,
      UpdatePasswordResponse | ValidationErrorResponse
    >()(async ({ request }) => {
      const requestData = await request.json();

      const currentUser = getUser()!;

      if (!verifyHash(requestData.currentPassword, currentUser.password))
        return validationErrorResponse({
          email: ['パスワードが間違っています。'],
        });

      updatePasswordController.update(currentUser, requestData);

      const data: UpdatePasswordResponse = {
        severity: 'success',
        message: 'パスワードを変更しました。',
      };

      return HttpResponse.json(data);
    }),
  ),

  http.post(
    API_BASE_URL + API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    withMiddleware<
      PathParams,
      ForgotPasswordRequest,
      ForgotPasswordResponse | ValidationErrorResponse
    >()(async ({ request }) => {
      const requestData = await request.json();

      const requestedUser = db.user.findFirst({
        where: { email: { equals: requestData.email } },
      });

      if (!requestedUser) {
        return validationErrorResponse({
          email: ['指定されたメールアドレスは存在しません。'],
        });
      }

      // as if sending password reset email
      console.info({
        'password reset URL': generatePasswordResetUrl(requestedUser),
      });

      const data: ForgotPasswordResponse = {
        severity: 'success',
        message: 'パスワード再設定用のメールを送信しました。',
      };

      return HttpResponse.json(data);
    }),
  ),

  http.post(
    API_BASE_URL + API_ENDPOINTS.AUTH.RESET_PASSWORD,
    withMiddleware<
      PathParams<'token'>,
      Omit<ResetPasswordRequest, 'token'>,
      ResetPasswordResponse | ValidationErrorResponse
    >()(async ({ params, request }) => {
      const token = params['token']?.toString() ?? '';
      const requestData = await request.json();

      return resetPasswordController.store({ token, ...requestData });
    }),
  ),

  http.post(
    API_BASE_URL + API_ENDPOINTS.AUTH.LOGOUT,
    withMiddleware<PathParams, undefined, LogoutResponse>()(() => {
      logoutWithSession();

      const data: LogoutResponse = {
        severity: 'info',
        message: 'ログアウトしました。',
      };

      return HttpResponse.json(data);
    }),
  ),

  http.delete(
    API_BASE_URL + API_ENDPOINTS.AUTH.DELETE_ACCOUNT,
    withMiddleware<PathParams, undefined, DeleteAccountResponse>()(() => {
      const currentUser = getUser()!;

      deleteAccountController.remove(currentUser);

      const data: DeleteAccountResponse = {
        severity: 'warning',
        message: 'アカウントは削除されました。',
      };

      return HttpResponse.json(data);
    }),
  ),
];
