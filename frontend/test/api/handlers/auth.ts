import { http, HttpResponse, type PathParams } from 'msw';
import dayjs from 'dayjs';

import type {
  SignInRequest,
  SignInResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdatePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ForgotPasswordResponse,
  DeleteAccountResponse,
  UpdatePasswordResponse,
} from '@/store/thunks/auth';
import type {
  ApiResponse,
  FetchSessionResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  ValidationErrorResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  RequestVerificationEmailRequest,
  RequestVerificationEmailResponse,
} from '@/store/api';
import { sanitizeUser } from '@test/api/models';
import { db } from '@test/api/database';
import { getUser, logout } from '@test/api/auth';
import {
  createUserController,
  deleteAccountController,
  resetPasswordController,
  updatePasswordController,
  updateProfileController,
} from '@test/api/controllers';
import { verifyHash } from '@test/utils/crypto';
import { url } from '@test/utils/route';
import {
  isUniqueEmail,
  authenticate,
  isValidPassword,
  isValidPasswordResetToken,
} from '@test/utils/validation';
import { withMiddleware } from '@test/api/handlers/middleware/utils/withMiddleware';
import { validateSignature } from '@test/api/handlers/middleware';
import {
  authorizationErrorResponse,
  validationErrorResponse,
} from '@test/api/handlers/utils/responses';
import { generateVerificationUrl } from '@test/api/handlers/utils/urls';

export const handlers = [
  http.post(
    url('SIGNUP_PATH'),
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

      const user = createUserController.store(requestData);

      // as if sending verification email
      console.info({
        'verification URL': generateVerificationUrl(user),
      });

      const data: RegisterResponse = {
        severity: 'success',
        message: '認証用メールを送信しました。',
        user,
      };

      return HttpResponse.json(data, { status: 201 });
    })
  ),

  http.get(
    url('GET_CSRF_TOKEN_PATH'),
    withMiddleware()(async () => {
      // cf. https://github.com/laravel/sanctum/blob/3.x/src/Http/Controllers/CsrfCookieController.php
      return HttpResponse.json({
        severity: 'info',
        message: 'CSRFトークンを取得しました。',
      });
    })
  ),

  http.get(
    url('SESSION_PATH'),
    withMiddleware<PathParams, undefined, FetchSessionResponse>()(() => {
      const currentUser = getUser();

      return HttpResponse.json({
        severity: 'info',
        message: 'ユーザー情報を取得しました。',
        user: currentUser ? sanitizeUser(currentUser) : null,
      });
    })
  ),

  http.post(
    url('VERIFICATION_NOTIFICATION_PATH'),
    withMiddleware<
      PathParams,
      RequestVerificationEmailRequest,
      RequestVerificationEmailResponse | ValidationErrorResponse
    >()(() => {
      const user = getUser()!;

      // as if sending verification email
      console.info({
        'verification URL': generateVerificationUrl(user),
      });

      const data: RequestVerificationEmailResponse = user.emailVerifiedAt
        ? {
            severity: 'error',
            message: '既に認証済みです。',
          }
        : {
            severity: 'success',
            message: '認証用メールを送信しました。',
          };

      return HttpResponse.json(data);
    })
  ),

  http.post(
    url('SIGNIN_PATH'),
    withMiddleware<
      PathParams,
      SignInRequest,
      SignInResponse | ValidationErrorResponse
    >()(async ({ request }) => {
      const requestData = await request.json();

      const user = await authenticate(requestData);

      if (!user) {
        return validationErrorResponse({ email: ['認証に失敗しました。'] });
      }

      const data: SignInResponse = {
        severity: 'info',
        message: 'ログインしました。',
        user: sanitizeUser(user),
      };

      return HttpResponse.json(data, { status: 201 });
    })
  ),

  http.get(
    `${url('VERIFY_EMAIL_PATH')}/:token/:hash`,
    withMiddleware<
      PathParams,
      VerifyEmailRequest,
      VerifyEmailResponse | ApiResponse
    >([validateSignature])(({ params }) => {
      /** An unpredictable value like UUID */
      const token = params['token']?.toString() ?? '';
      /** Token hash */
      const hash = params['hash']?.toString() ?? '';

      if (!verifyHash(token, hash)) {
        return authorizationErrorResponse('Invalid Signature.');
      }

      const user = db.where('users', 'id', token)[0];

      if (!user || user.emailVerifiedAt) {
        return authorizationErrorResponse('Invalid Signature.');
      }

      const updated = db.update('users', {
        ...user,
        emailVerifiedAt: dayjs().toISOString(),
      });

      return HttpResponse.json({
        severity: 'info',
        message: '認証に成功しました。',
        user: updated,
      });
    })
  ),

  http.put(
    url('USER_INFO_PATH'),
    withMiddleware<
      PathParams,
      UpdateProfileRequest,
      UpdateProfileResponse | ValidationErrorResponse
    >()(async ({ request }) => {
      const requestData = await request.json();

      if (!isUniqueEmail(requestData.email)) {
        return validationErrorResponse({
          email: ['このメールアドレスは既に使用されています。'],
        });
      }

      const currentUser = getUser()!;
      const user = updateProfileController.update({
        currentUser: currentUser,
        request: requestData,
      });

      const data: UpdateProfileResponse = {
        severity: 'success',
        message: 'ユーザー情報を更新しました。',
        user,
      };

      return HttpResponse.json(data);
    })
  ),

  http.put(
    url('UPDATE_PASSWORD_PATH'),
    withMiddleware<
      PathParams,
      UpdatePasswordRequest,
      UpdatePasswordResponse | ValidationErrorResponse
    >()(async ({ request }) => {
      const requestData = await request.json();

      const currentUser = getUser()!;

      if (!isValidPassword(requestData.current_password, currentUser.password))
        return validationErrorResponse({
          email: ['パスワードが間違っています。'],
        });

      updatePasswordController.update({
        currentUser: currentUser,
        request: requestData,
      });

      const data: UpdatePasswordResponse = {
        severity: 'success',
        message: 'パスワードを変更しました。',
      };

      return HttpResponse.json(data);
    })
  ),

  http.post(
    url('FORGOT_PASSWORD_PATH'),
    withMiddleware<
      PathParams,
      ForgotPasswordRequest,
      ForgotPasswordResponse | ValidationErrorResponse
    >()(async ({ request }) => {
      const requestData = await request.json();

      const requestedUser = db.where('users', 'email', requestData.email)[0];

      if (!requestedUser) {
        return validationErrorResponse({
          email: ['指定されたメールアドレスは存在しません。'],
        });
      }

      const data: ForgotPasswordResponse = {
        severity: 'success',
        message: 'パスワード再設定用のメールを送信しました。',
      };

      return HttpResponse.json(data);
    })
  ),

  http.post(
    url('RESET_PASSWORD_PATH'),
    withMiddleware<
      PathParams,
      ResetPasswordRequest,
      ResetPasswordResponse | ValidationErrorResponse
    >()(async ({ request }) => {
      const requestData = await request.json();

      if (!isValidPasswordResetToken(requestData)) {
        return validationErrorResponse({
          email: ['認証に失敗しました。'],
        });
      }

      resetPasswordController.reset(requestData);

      const data: ResetPasswordResponse = {
        severity: 'success',
        message: 'パスワードを再設定しました。',
      };

      return HttpResponse.json(data);
    })
  ),

  http.post(
    url('SIGNOUT_PATH'),
    withMiddleware<PathParams, undefined, LogoutResponse>()(() => {
      logout();

      const data: LogoutResponse = {
        severity: 'info',
        message: 'ログアウトしました。',
      };

      return HttpResponse.json(data);
    })
  ),

  http.delete(
    url('SIGNUP_PATH'),
    withMiddleware<PathParams, undefined, DeleteAccountResponse>()(() => {
      const currentUser = getUser()!;

      deleteAccountController.remove(currentUser);

      const data: DeleteAccountResponse = {
        severity: 'warning',
        message: 'アカウントは削除されました。',
      };

      return HttpResponse.json(data);
    })
  ),
];
