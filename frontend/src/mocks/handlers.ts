import { DefaultRequestBody, RequestParams, rest } from 'msw';

import {
  API_HOST,
  AUTH_USER_PATH,
  GET_CSRF_TOKEN_PATH,
  SIGNIN_PATH,
  SIGNOUT_PATH,
  SIGNUP_PATH,
  UPDATE_USER_INFO_PATH,
  VERIFICATION_NOTIFICATION_PATH,
} from 'config/api';
import {
  SignUpRequest,
  SignUpResponse,
  FetchAuthUserResponse,
  SignInRequest,
  SignInResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from 'store/thunks';
import { User } from 'models/User';
import { generateRandomString } from 'utils/generator';
import { collection, sanitizeUser } from 'mocks/models';
import {
  createUserController,
  updateProfileController,
} from 'mocks/controllers';
import { encrypt, decrypt, digestText } from 'mocks/utils/crypto';
import {
  CSRF_TOKEN,
  XSRF_TOKEN,
  X_XSRF_TOKEN,
  hasValidToken,
  isUniqueEmail,
  authenticate,
} from 'mocks/utils/validation';

import 'mocks/data';

// HTTPメソッドとリクエストパス(第一引数)を指定し、`Request handler`を生成
// リクエストに対応するレスポンスのモックを`Response resolver`により作成

export const handlers = [
  rest.post<SignUpRequest, SignUpResponse, RequestParams>(
    API_HOST + SIGNUP_PATH,
    (req, res, ctx) => {
      const token = req.headers.get(X_XSRF_TOKEN);
      const { email } = req.body;

      // token mismatch error
      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      // validation error
      if (!isUniqueEmail(email)) return res(ctx.status(422));

      const sessionId = generateRandomString(32);
      const encryptedSessionId = encrypt(sessionId);
      const response = createUserController.store(req.body);

      sessionStorage.setItem(sessionId, String(response.user.id));
      return res(
        ctx.status(201),
        ctx.cookie('session_id', encryptedSessionId, { httpOnly: true }),
        ctx.json(response)
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
      const encryptedSessionId = req.cookies.session_id;
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      if (!encryptedSessionId) return res(ctx.status(401));

      const sessionId = decrypt(encryptedSessionId);
      const uuid = sessionStorage.getItem(sessionId);

      if (!uuid) return res(ctx.status(401));

      const userDoc = collection.users[uuid];
      const statusCode = userDoc ? 200 : 401;
      const user = userDoc ? sanitizeUser(userDoc) : null;

      return res(ctx.status(statusCode), ctx.json({ user: user as User }));
    }
  ),

  rest.post<DefaultRequestBody, FetchAuthUserResponse, RequestParams>(
    API_HOST + VERIFICATION_NOTIFICATION_PATH,
    (req, res, ctx) => {
      const encryptedSessionId = req.cookies.session_id;
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      if (!encryptedSessionId) return res(ctx.status(401));

      const sessionId = decrypt(encryptedSessionId);
      const uuid = sessionStorage.getItem(sessionId);

      if (!uuid) return res(ctx.status(401));

      const userDoc = collection.users[uuid];
      const statusCode = userDoc.emailVerifiedAt ? 204 : 202;

      return res(ctx.status(statusCode));
    }
  ),

  rest.post<SignInRequest, SignInResponse, RequestParams>(
    API_HOST + SIGNIN_PATH,
    (req, res, ctx) => {
      const user = authenticate(req.body);

      if (!user) return res(ctx.status(422));

      const sessionId = generateRandomString(32);
      const encryptedSessionId = encrypt(sessionId);

      sessionStorage.setItem(sessionId, String(user.id));
      return res(
        ctx.status(200),
        ctx.cookie('session_id', encryptedSessionId, { httpOnly: true }),
        ctx.json({ user: user, verified: undefined } as SignInResponse)
      );
    }
  ),

  rest.put<UpdateProfileRequest, UpdateProfileResponse, RequestParams>(
    API_HOST + UPDATE_USER_INFO_PATH,
    (req, res, ctx) => {
      const encryptedSessionId = req.cookies.session_id;
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      if (!isUniqueEmail(req.body.email)) return res(ctx.status(422));

      if (!encryptedSessionId) return res(ctx.status(401));

      const sessionId = decrypt(encryptedSessionId);
      const uuid = sessionStorage.getItem(sessionId);

      if (!uuid) return res(ctx.status(401));

      const userDoc = collection.users[uuid];

      if (!userDoc) return res(ctx.status(401));

      const currentUser = userDoc;
      const request = req.body;
      const response = updateProfileController.update({ currentUser, request });

      return res(
        ctx.status(200),
        ctx.cookie('session_id', encryptedSessionId, { httpOnly: true }),
        ctx.json(response)
      );
    }
  ),

  rest.post(API_HOST + SIGNOUT_PATH, (req, res, ctx) => {
    const { session_id } = req.cookies;
    const token = req.headers.get(X_XSRF_TOKEN);

    if (!session_id) return res(ctx.status(401));

    if (!token || !hasValidToken(token)) return res(ctx.status(419));

    sessionStorage.clear();
    return res(ctx.status(204), ctx.cookie('session_id', ''));
  }),
];
