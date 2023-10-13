import type { CookieSerializeOptions } from 'cookie';

import {
  context,
  response,
  type DefaultBodyType,
  type ResponseTransformer,
} from 'msw';

import config from '@test/api/handlers/config';
import { COOKIE, XSRF_TOKEN } from '@test/api/handlers/config/cookies';
import { getCsrfTokenFromSession, getSessionId } from '@test/api/session';
import { encrypt } from '@test/utils/crypto';

/**
 * Create a response transformer to set encrypted cookies using default options.
 */
const setCookie = (
  name: string,
  value: string,
  options?: CookieSerializeOptions
): ResponseTransformer => {
  return context.cookie(name, encrypt(value), {
    ...config.cookies.options,
    ...options,
  });
};

/**
 * Create a response with cookies
 *
 * It'll resolve the following issue:
 *
 * Setting a cookie with the same name using `context.cookie`
 * outside of the handler's `return` statement
 * may not always overwrite the previous cookie.
 */
const statefulResponse = <BodyType extends DefaultBodyType>(
  ...transformers: ResponseTransformer<BodyType>[]
) => {
  return response(
    setCookie(COOKIE, getSessionId()),
    setCookie(XSRF_TOKEN, getCsrfTokenFromSession()),
    ...transformers
  );
};

export default statefulResponse;
