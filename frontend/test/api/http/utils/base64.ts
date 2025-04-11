/**
 * Encodes the data to a base64 string.
 */
// cf. https://github.com/laravel/framework/blob/11.x/src/Illuminate/Pagination/Cursor.php#L103 - encode()
export const base64Encode = (
  data: string | Record<string, unknown>,
): string => {
  const str = typeof data === 'object' ? JSON.stringify(data) : data;
  // cf. https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
  const bytes = new TextEncoder().encode(str);
  const utf8 = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');

  return typeof window === 'undefined'
    ? Buffer.from(utf8, 'binary').toString('base64')
    : window.btoa(utf8);
};

/**
 * Encodes the data to a base64 URL-safe string.
 */
export const base64UrlEncode = (
  data: string | Record<string, unknown>,
): string => {
  return base64Encode(data)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Decodes a base64-encoded string and parses the resulting JSON.
 */
export const base64Decode = (encoded: string) => {
  const str =
    typeof window === 'undefined'
      ? Buffer.from(encoded, 'base64').toString('binary')
      : window.atob(encoded);
  // cf. https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
  const bytes = Uint8Array.from(str, (v) => v.codePointAt(0) ?? NaN);
  const utf8 = new TextDecoder().decode(bytes);

  return JSON.parse(utf8);
};

/**
 * Decodes a base64-encoded string with URL-safe characters.
 */
export const base64UrlDecode = (encoded: string) => {
  return base64Decode(encoded.replace(/-/g, '+').replace(/_/g, '/'));
};
