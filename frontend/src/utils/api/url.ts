import { API_BASE_URL } from '@/config/api';

/**
 * Get a type as a record of placeholder parameters.
 *
 * @example
 * PlaceholderRecord<'/users/:userId/posts/:postId'>
 * // => { userId: string | number, postId: string | number }
 */
type PlaceholderRecord<
  T extends string,
  Prefix extends string = ':',
  Separator extends string = '/',
  MaybeSuffix extends string = '?',
> = T extends `${string}${Prefix}${infer Param}${Separator}${infer Rest}`
  ? {
      [K in Param | keyof PlaceholderRecord<Rest, Prefix, Separator>]:
        | string
        | number;
    }
  : T extends `${string}${Prefix}${infer Param}${MaybeSuffix}${string}`
    ? { [K in Param]: string | number }
    : T extends `${string}${Prefix}${infer Param}`
      ? { [K in Param]: string | number }
      : Record<never, never>;

/**
 * Build a path with placeholder parameters.
 *
 * @example
 * buildPath('/users/:userId/posts/:postId', { userId: '1', postId: '2' })
 * // => '/users/1/posts/2'
 */
export const buildPath = <T extends string>(
  pathTemplate: T,
  params: PlaceholderRecord<T>,
): string => {
  const path = Object.entries(params).reduce<string>(
    (result, [key, value]) => result.replace(`:${key}`, String(value)),
    pathTemplate,
  );

  return path;
};

/**
 * Build a URL with placeholder parameters.
 *
 * @example
 * buildUrl('/users/:userId/posts/:postId', { userId: '1', postId: '2' })
 * // => 'https://example.com/users/1/posts/2'
 */
export const buildUrl = <T extends string>(
  pathTemplate: T,
  params: PlaceholderRecord<T>,
  options?: {
    baseUrl?: string;
  },
): string => {
  const { baseUrl = API_BASE_URL } = options || {};

  const path = buildPath(pathTemplate, params);

  return `${baseUrl}/${path.replace(/^\//, '')}`;
};
