import {
  rest,
  type DefaultBodyType,
  type MockedResponse,
  type PathParams,
} from 'msw';

import type {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdatePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ForgotPasswordResponse,
  SignOutResponse,
  DeleteAccountResponse,
  SendEmailVerificationLinkResponse,
  UpdatePasswordResponse,
} from '@/store/thunks/auth';
import type { ErrorResponse } from './types';
import { auth, db, sanitizeUser } from '@test/api/models';
import {
  createUserController,
  deleteAccountController,
  resetPasswordController,
  updatePasswordController,
  updateProfileController,
} from '@test/api/controllers';
import { url } from '@test/utils/route';
import {
  XSRF_TOKEN,
  isUniqueEmail,
  authenticate,
  isValidPassword,
  regenerateSessionId,
  createSessionId,
  generateCsrfToken,
  isValidPasswordResetToken,
} from '@test/utils/validation';
import { applyMiddleware, returnInvalidRequest } from './utils';

export const handlers = [
  rest.post<SignUpRequest, PathParams, SignUpResponse & ErrorResponse>(
    url('SIGNUP_PATH'),
    (req, res, ctx) => {
      const httpException = applyMiddleware(req);
      if (httpException) return res(httpException);

      if (!isUniqueEmail(req.body.email))
        return res(
          returnInvalidRequest({
            email: ['このメールアドレスは既に使用されています。'],
          })
        );

      const data: SignUpResponse = {
        severity: 'success',
        message: 'ユーザー登録が完了しました',
        user: createUserController.store(req.body),
      };

      const encryptedSessionId = createSessionId(data.user.id);

      return res(
        ctx.status(201),
        ctx.cookie('session_id', encryptedSessionId, { httpOnly: true }),
        ctx.json(data)
      );
    }
  ),

  rest.get<DefaultBodyType, PathParams, MockedResponse & ErrorResponse>(
    url('GET_CSRF_TOKEN_PATH'),
    (_req, res, ctx) => {
      const csrfToken = generateCsrfToken();
      return res(ctx.cookie(XSRF_TOKEN, csrfToken));
    }
  ),

  rest.post<
    DefaultBodyType,
    PathParams,
    SendEmailVerificationLinkResponse & ErrorResponse
  >(url('VERIFICATION_NOTIFICATION_PATH'), (req, res, ctx) => {
    const httpException = applyMiddleware(req, ['authenticate']);
    if (httpException) return res(httpException);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = auth.getUser()!;

    const data: SendEmailVerificationLinkResponse = currentUser.emailVerifiedAt
      ? {
          severity: 'error',
          message: '既に認証済みです',
        }
      : {
          severity: 'success',
          message: '認証用メールを送信しました',
        };

    return res(ctx.status(200), ctx.json(data));
  }),

  rest.post<SignInRequest, PathParams, SignInResponse & ErrorResponse>(
    url('SIGNIN_PATH'),
    (req, res, ctx) => {
      const user = authenticate(req.body);

      if (!user)
        return res(returnInvalidRequest({ email: ['認証に失敗しました。'] }));

      const data: SignInResponse = {
        severity: 'info',
        message: 'ログインしました',
        user: sanitizeUser(user),
      };

      return res(
        ctx.status(200),
        ctx.cookie('session_id', createSessionId(user.id), { httpOnly: true }),
        ctx.json(data)
      );
    }
  ),

  rest.put<
    UpdateProfileRequest,
    PathParams,
    UpdateProfileResponse & ErrorResponse
  >(url('USER_INFO_PATH'), (req, res, ctx) => {
    const httpException = applyMiddleware(req, ['authenticate']);
    if (httpException) return res(httpException);

    if (!isUniqueEmail(req.body.email))
      return res(
        returnInvalidRequest({
          email: ['このメールアドレスは既に使用されています。'],
        })
      );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = auth.getUser()!;
    const newSessionId = regenerateSessionId(req.cookies.session_id);
    const user = updateProfileController.update({
      currentUser: currentUser,
      request: req.body,
    });

    const data: UpdateProfileResponse = {
      severity: 'success',
      message: 'ユーザー情報を更新しました',
      user,
    };

    return res(
      ctx.status(200),
      ctx.cookie('session_id', newSessionId, { httpOnly: true }),
      ctx.json(data)
    );
  }),

  rest.put<
    UpdatePasswordRequest,
    PathParams,
    UpdatePasswordResponse & ErrorResponse
  >(url('UPDATE_PASSWORD_PATH'), (req, res, ctx) => {
    const httpException = applyMiddleware(req, ['authenticate']);
    if (httpException) return res(httpException);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = auth.getUser()!;

    if (!isValidPassword(req.body.current_password, currentUser.password))
      return res(
        returnInvalidRequest({
          password: ['パスワードが間違っています。'],
        })
      );

    updatePasswordController.update({
      currentUser: currentUser,
      request: req.body,
    });

    const data: UpdatePasswordResponse = {
      severity: 'success',
      message: 'パスワードを変更しました',
    };

    const newSessionId = regenerateSessionId(req.cookies.session_id);

    return res(
      ctx.status(200),
      ctx.cookie('session_id', newSessionId, { httpOnly: true }),
      ctx.json(data)
    );
  }),

  rest.post<
    ForgotPasswordRequest,
    PathParams,
    ForgotPasswordResponse & ErrorResponse
  >(url('FORGOT_PASSWORD_PATH'), (req, res, ctx) => {
    const requestedUser = db.where('users', 'email', req.body.email)[0];

    if (!requestedUser)
      return res(
        returnInvalidRequest({
          email: ['指定されたメールアドレスは存在しません。'],
        })
      );

    const data: ForgotPasswordResponse = {
      severity: 'success',
      message: 'パスワード再設定用のメールを送信しました',
    };

    return res(ctx.status(200), ctx.json(data));
  }),

  rest.post<
    ResetPasswordRequest,
    PathParams,
    ResetPasswordResponse & ErrorResponse
  >(url('RESET_PASSWORD_PATH'), (req, res, ctx) => {
    if (!isValidPasswordResetToken(req.body))
      return res(returnInvalidRequest({ email: ['認証に失敗しました。'] }));

    resetPasswordController.reset(req.body);

    const data: ResetPasswordResponse = {
      severity: 'success',
      message: 'パスワードを再設定しました',
    };

    const sessionId = regenerateSessionId(req.cookies.session_id);

    return res(
      ctx.status(200),
      ctx.cookie('session_id', sessionId, { httpOnly: true }),
      ctx.json(data)
    );
  }),

  rest.post<DefaultBodyType, PathParams, SignOutResponse & ErrorResponse>(
    url('SIGNOUT_PATH'),
    (req, res, ctx) => {
      const httpException = applyMiddleware(req, ['authenticate']);
      if (httpException) return res(httpException);

      auth.logout();

      const data: SignOutResponse = {
        severity: 'info',
        message: 'ログアウトしました',
      };

      return res(
        ctx.status(204),
        ctx.cookie('session_id', '', { httpOnly: true }),
        ctx.json(data)
      );
    }
  ),

  rest.delete<
    DefaultBodyType,
    PathParams,
    DeleteAccountResponse & ErrorResponse
  >(url('SIGNUP_PATH'), (req, res, ctx) => {
    const httpException = applyMiddleware(req, ['authenticate']);
    if (httpException) return res(httpException);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = auth.getUser()!;

    deleteAccountController.remove(currentUser);

    const data: DeleteAccountResponse = {
      severity: 'warning',
      message: 'アカウントは削除されました',
    };

    return res(
      ctx.status(204),
      ctx.cookie('session_id', '', { httpOnly: true }),
      ctx.json(data)
    );
  }),
];
