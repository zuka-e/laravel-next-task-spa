import { http, HttpResponse, type DefaultBodyType, type PathParams } from 'msw';

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
  SendEmailVerificationLinkResponse,
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
import { User } from '@/models';

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

      const data: RegisterResponse = {
        severity: 'success',
        message: 'ユーザー登録が完了しました。',
        user: createUserController.store(requestData),
      };

      return HttpResponse.json(data, { status: 201 });
    })
  ),

  http.get(
    url('GET_CSRF_TOKEN_PATH'),
    withMiddleware()(async () => {
      // cf. https://github.com/laravel/sanctum/blob/3.x/src/Http/Controllers/CsrfCookieController.php
      return HttpResponse.json(undefined, { status: 204 });
    })
  ),

  http.get(
    url('SESSION_PATH'),
    withMiddleware<PathParams, DefaultBodyType, FetchSessionResponse>()(() => {
      const currentUser = getUser();

      return HttpResponse.json({
        user: currentUser ? sanitizeUser(currentUser) : null,
        severity: 'info',
        message: 'ユーザー情報を取得しました。',
      });
    })
  ),

  http.post(
    url('VERIFICATION_NOTIFICATION_PATH'),
    withMiddleware<
      PathParams,
      DefaultBodyType,
      SendEmailVerificationLinkResponse
    >()(() => {
      const currentUser = getUser()!;

      const data: SendEmailVerificationLinkResponse =
        currentUser.emailVerifiedAt
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
    `${url('VERIFY_EMAIL_PATH')}/:id/:hash`,
    withMiddleware<
      PathParams,
      VerifyEmailRequest,
      VerifyEmailResponse | ApiResponse
    >([validateSignature])(({ params }) => {
      /** `id` parameter representing the encrypted ID  */
      const encryptedId = params['id'];
      /** `hash` parameter representing the email hash */
      const emailHash = params['hash'];

      /** As valid `id` parameter  */
      const validEncryptedId = 'valid-enc-id';
      /** As valid `hash` parameter */
      const validEmailHash = 'email-hash-for-id';

      if (encryptedId !== validEncryptedId || emailHash !== validEmailHash) {
        return authorizationErrorResponse('Invalid Signature.');
      }

      return HttpResponse.json({
        severity: 'info',
        message: '認証に成功しました。',
        user: getUser() as User,
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
    withMiddleware<PathParams, DefaultBodyType, LogoutResponse>()(() => {
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
    withMiddleware<PathParams, DefaultBodyType, DeleteAccountResponse>()(() => {
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
