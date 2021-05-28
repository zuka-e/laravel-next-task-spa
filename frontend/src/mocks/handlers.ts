import { DefaultRequestBody, RequestParams, rest } from 'msw';

import {
  API_HOST,
  AUTH_USER_PATH,
  GET_CSRF_TOKEN_PATH,
  SIGNIN_PATH,
  SIGNOUT_PATH,
  SIGNUP_PATH,
  VERIFICATION_NOTIFICATION_PATH,
} from 'config/api';
import {
  SignUpRequest,
  SignUpResponse,
  FetchAuthUserResponse,
  SignInRequest,
  SignInResponse,
} from 'store/thunks';
import { User } from 'models/User';
import {
  authenticate,
  isUniqueEmail,
  sanitizeUser,
  users,
  usersData,
  UsersSchema,
} from './models/user';
import * as userController from './controllers/userController';
import { digestText } from './utils/hash';
import {
  CSRF_TOKEN,
  XSRF_TOKEN,
  X_XSRF_TOKEN,
  hasValidToken,
} from './utils/validation';

import './data';

// HTTPメソッドとリクエストパス(第一引数)を指定し、`Request handler`を生成
// リクエストに対応するレスポンスのモックを`Response resolver`により作成

export const handlers = [
  rest.post<SignUpRequest, SignUpResponse, RequestParams>(
    API_HOST + SIGNUP_PATH,
    (req, res, ctx) => {
      const token = req.headers.get(X_XSRF_TOKEN);
      const { email, password } = req.body;

      // token mismatch error
      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      // validation error
      if (!isUniqueEmail(email)) return res(ctx.status(422));

      const session_id = digestText(email);
      const newUser: UsersSchema = {
        id: users.length + 1,
        name: email,
        email,
        emailVerifiedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: digestText(password),
      };

      userController.store(newUser);
      return res(
        ctx.status(201),
        ctx.cookie('session_id', session_id, { httpOnly: true }),
        ctx.json({ user: newUser } as SignUpResponse)
      );
    }
  ),

  rest.get(API_HOST + GET_CSRF_TOKEN_PATH, (_req, res, ctx) => {
    const randomString = Math.random().toString(36).substring(2, 15);
    const token = digestText(randomString);
    sessionStorage.setItem(CSRF_TOKEN, token);
    return res(ctx.cookie(XSRF_TOKEN, token));
  }),

  rest.get<DefaultRequestBody, FetchAuthUserResponse, RequestParams>(
    API_HOST + AUTH_USER_PATH,
    (req, res, ctx) => {
      const { session_id } = req.cookies;
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!session_id) return res(ctx.status(401));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      const uuid = digestText(session_id);
      const userData = usersData[uuid];
      const statusCode = userData ? 200 : 401;
      const user = userData ? sanitizeUser(userData) : null;

      return res(ctx.status(statusCode), ctx.json({ user: user as User }));
    }
  ),

  rest.post<DefaultRequestBody, FetchAuthUserResponse, RequestParams>(
    API_HOST + VERIFICATION_NOTIFICATION_PATH,
    (req, res, ctx) => {
      const { session_id } = req.cookies;
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!session_id) return res(ctx.status(401));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      const uuid = digestText(session_id);
      const userData = usersData[uuid];

      const statusCode = userData.emailVerifiedAt ? 204 : 202;

      return res(ctx.status(statusCode));
    }
  ),

  rest.post<SignInRequest, SignInResponse, RequestParams>(
    API_HOST + SIGNIN_PATH,
    (req, res, ctx) => {
      const user = authenticate(req.body);

      if (!user) return res(ctx.status(422));

      return res(
        ctx.status(200),
        ctx.cookie('session_id', user.session_id, { httpOnly: true }),
        ctx.json({ user: user, verified: undefined } as SignInResponse)
      );
    }
  ),

  rest.post(API_HOST + SIGNOUT_PATH, (req, res, ctx) => {
    const { session_id } = req.cookies;
    const token = req.headers.get(X_XSRF_TOKEN);

    if (!session_id) return res(ctx.status(401));

    if (!token || !hasValidToken(token)) return res(ctx.status(419));

    sessionStorage.removeItem(CSRF_TOKEN);
    return res(ctx.status(204), ctx.cookie('session_id', ''));
  }),
];
