import { serialize, type CookieSerializeOptions } from 'cookie';

import config from '@test/api/config';
import { encrypt } from '@test/utils/crypto';

/**
 * Set a cookie.
 *
 * > setting mocked response cookies directly on the document.cookie,
 * > as if they were received from the server.
 * > https://mswjs.io/docs/recipes/cookies#mock-response-cookies
 */
const setCookie = (
  name: string,
  value: string,
  options?: CookieSerializeOptions
): void => {
  document.cookie = serialize(name, encrypt(value), {
    ...config.cookie.options,
    ...options,
  });
};

export default setCookie;
