import type { CookieSerializeOptions } from 'cookie';

/**
 * Cookie key of encrypted session ID.
 */
export const COOKIE = 'msw_session';

/**
 * Key of "XSRF-TOKEN" cookie that contains the CSRF token.
 *
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Foundation/Http/Middleware/VerifyCsrfToken.php#L203 - newSession()
 */
export const XSRF_TOKEN = 'XSRF-TOKEN';

/**
 * See Cookies tab instead of `MSW_COOKIE_STORE` in Local Storage tab.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
 */
export const options: CookieSerializeOptions = {
  // domain: `.${new URL(process.env.NEXT_PUBLIC_APP_URL || '').host}`,
  path: '/',
  maxAge: 300,
  // httpOnly: true,
  // secure: true,
  sameSite: 'lax',
};
