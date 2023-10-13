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
  VerifyEmailRequest,
  VerifyEmailResponse,
  FetchSessionResponse,
} from '@/store/thunks/auth';
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
import type { ErrorResponse } from './types';
import { statefulResponse } from './responses';
import { resolveMiddleware, returnInvalidRequest } from './utils';

export const handlers = [
  rest.post<SignUpRequest, PathParams, SignUpResponse & ErrorResponse>(
    url('SIGNUP_PATH'),
    async (req, _res, ctx) => {
      const { transformers, isError } = resolveMiddleware(req);

      if (isError) {
        return statefulResponse(...transformers);
      }

      const requestData = await req.json<SignUpRequest>();

      if (!isUniqueEmail(requestData.email))
        return statefulResponse(
          returnInvalidRequest({
            email: ['このメールアドレスは既に使用されています。'],
          })
        );

      const data: SignUpResponse = {
        severity: 'success',
        message: 'ユーザー登録が完了しました',
        user: createUserController.store(requestData),
      };

      return statefulResponse(ctx.status(201), ctx.json(data), ...transformers);
    }
  ),

  rest.get<DefaultBodyType, PathParams, MockedResponse & ErrorResponse>(
    url('GET_CSRF_TOKEN_PATH'),
    (req, _res, ctx) => {
      const { transformers, isError } = resolveMiddleware(req);

      if (isError) {
        return statefulResponse(...transformers);
      }

      // cf. https://github.com/laravel/sanctum/blob/3.x/src/Http/Controllers/CsrfCookieController.php
      return statefulResponse(ctx.status(204), ...transformers);
    }
  ),

  rest.get<DefaultBodyType, PathParams, FetchSessionResponse & ErrorResponse>(
    url('SESSION_PATH'),
    (req, _res, ctx) => {
      const { transformers, isError } = resolveMiddleware(req);

      if (isError) {
        return statefulResponse(...transformers);
      }

      const currentUser = getUser();

      const data: FetchSessionResponse = {
        user: currentUser ? sanitizeUser(currentUser) : null,
      };

      return statefulResponse(ctx.status(200), ctx.json(data), ...transformers);
    }
  ),

  rest.post<
    DefaultBodyType,
    PathParams,
    SendEmailVerificationLinkResponse & ErrorResponse
  >(url('VERIFICATION_NOTIFICATION_PATH'), (req, _res, ctx) => {
    const { transformers, isError } = resolveMiddleware(req, ['authenticate']);

    if (isError) {
      return statefulResponse(...transformers);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = getUser()!;

    const data: SendEmailVerificationLinkResponse = currentUser.emailVerifiedAt
      ? {
          severity: 'error',
          message: '既に認証済みです',
        }
      : {
          severity: 'success',
          message: '認証用メールを送信しました',
        };

    return statefulResponse(ctx.status(200), ctx.json(data), ...transformers);
  }),

  rest.post<SignInRequest, PathParams, SignInResponse & ErrorResponse>(
    url('SIGNIN_PATH'),
    async (req, _res, ctx) => {
      const { transformers, isError } = resolveMiddleware(req);

      if (isError) {
        return statefulResponse(...transformers);
      }

      const requestData = await req.json<SignInRequest>();

      const user = await authenticate(requestData);

      if (!user)
        return statefulResponse(
          returnInvalidRequest({ email: ['認証に失敗しました。'] })
        );

      const data: SignInResponse = {
        severity: 'info',
        message: 'ログインしました',
        user: sanitizeUser(user),
      };

      return statefulResponse(ctx.status(200), ctx.json(data), ...transformers);
    }
  ),

  rest.post<
    VerifyEmailRequest,
    PathParams,
    VerifyEmailResponse & ErrorResponse
  >(`${url('VERIFY_EMAIL_PATH')}/:id/:hash`, (req, _res, ctx) => {
    // const user = authenticate(req.body);
    // if (!user)
    //   return statefulResponse(returnInvalidRequest({ email: ['認証に失敗しました。'] }));
    // const data: SignInResponse = {
    //   severity: 'info',
    //   message: 'ログインしました',
    //   user: sanitizeUser(user),
    // };
    // return statefulResponse(
    //   ctx.status(200),
    //   ctx.cookie('session_id', createSessionId(user.id), { httpOnly: true }),
    //   ctx.json(data)
    // );
  }),

  rest.put<
    UpdateProfileRequest,
    PathParams,
    UpdateProfileResponse & ErrorResponse
  >(url('USER_INFO_PATH'), async (req, _res, ctx) => {
    const { transformers, isError } = resolveMiddleware(req, ['authenticate']);

    if (isError) {
      return statefulResponse(...transformers);
    }

    const requestData = await req.json<UpdateProfileRequest>();

    if (!isUniqueEmail(requestData.email))
      return statefulResponse(
        returnInvalidRequest({
          email: ['このメールアドレスは既に使用されています。'],
        }),
        ...transformers
      );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = getUser()!;
    const user = updateProfileController.update({
      currentUser: currentUser,
      request: requestData,
    });

    const data: UpdateProfileResponse = {
      severity: 'success',
      message: 'ユーザー情報を更新しました',
      user,
    };

    return statefulResponse(ctx.status(200), ctx.json(data), ...transformers);
  }),

  rest.put<
    UpdatePasswordRequest,
    PathParams,
    UpdatePasswordResponse & ErrorResponse
  >(url('UPDATE_PASSWORD_PATH'), async (req, _res, ctx) => {
    const { transformers, isError } = resolveMiddleware(req, ['authenticate']);

    if (isError) {
      return statefulResponse(...transformers);
    }

    const requestData = await req.json<UpdatePasswordRequest>();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = getUser()!;

    if (!isValidPassword(requestData.current_password, currentUser.password))
      return statefulResponse(
        returnInvalidRequest({
          password: ['パスワードが間違っています。'],
        })
      );

    updatePasswordController.update({
      currentUser: currentUser,
      request: requestData,
    });

    const data: UpdatePasswordResponse = {
      severity: 'success',
      message: 'パスワードを変更しました',
    };

    return statefulResponse(ctx.status(200), ctx.json(data), ...transformers);
  }),

  rest.post<
    ForgotPasswordRequest,
    PathParams,
    ForgotPasswordResponse & ErrorResponse
  >(url('FORGOT_PASSWORD_PATH'), async (req, _res, ctx) => {
    const { transformers, isError } = resolveMiddleware(req);

    if (isError) {
      return statefulResponse(...transformers);
    }

    const requestData = await req.json<ForgotPasswordRequest>();

    const requestedUser = db.where('users', 'email', requestData.email)[0];

    if (!requestedUser)
      return statefulResponse(
        returnInvalidRequest({
          email: ['指定されたメールアドレスは存在しません。'],
        })
      );

    const data: ForgotPasswordResponse = {
      severity: 'success',
      message: 'パスワード再設定用のメールを送信しました',
    };

    return statefulResponse(ctx.status(200), ctx.json(data), ...transformers);
  }),

  rest.post<
    ResetPasswordRequest,
    PathParams,
    ResetPasswordResponse & ErrorResponse
  >(url('RESET_PASSWORD_PATH'), async (req, _res, ctx) => {
    const { transformers, isError } = resolveMiddleware(req);

    if (isError) {
      return statefulResponse(...transformers);
    }

    const requestData = await req.json<ResetPasswordRequest>();

    if (!isValidPasswordResetToken(requestData))
      return statefulResponse(
        returnInvalidRequest({ email: ['認証に失敗しました。'] })
      );

    resetPasswordController.reset(requestData);

    const data: ResetPasswordResponse = {
      severity: 'success',
      message: 'パスワードを再設定しました',
    };

    return statefulResponse(ctx.status(200), ctx.json(data), ...transformers);
  }),

  rest.post<DefaultBodyType, PathParams, SignOutResponse & ErrorResponse>(
    url('SIGNOUT_PATH'),
    (req, _res, ctx) => {
      const { transformers, isError } = resolveMiddleware(req, [
        'authenticate',
      ]);

      if (isError) {
        return statefulResponse(...transformers);
      }

      logout();

      const data: SignOutResponse = {
        severity: 'info',
        message: 'ログアウトしました',
      };

      return statefulResponse(ctx.status(200), ctx.json(data), ...transformers);
    }
  ),

  rest.delete<
    DefaultBodyType,
    PathParams,
    DeleteAccountResponse & ErrorResponse
  >(url('SIGNUP_PATH'), (req, _res, ctx) => {
    const { transformers, isError } = resolveMiddleware(req, ['authenticate']);

    if (isError) {
      return statefulResponse(...transformers);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = getUser()!;

    deleteAccountController.remove(currentUser);

    const data: DeleteAccountResponse = {
      severity: 'warning',
      message: 'アカウントは削除されました',
    };

    return statefulResponse(ctx.status(204), ctx.json(data), ...transformers);
  }),
];
