import type { ParsedUrlQuery } from 'querystring';

import { useRouter } from 'next/router';
import type { NextRouter } from 'next/router';

/**
 * Route values that Next `router` object doesn't have directly.
 *
 * @see https://nextjs.org/docs/api-reference/next/router#router-object
 */
export type AppRoute<
  Path extends string[] | void = void,
  Query extends ParsedUrlQuery | void = void
> = {
  /**
   * Pathname without query string. - *e.g.*`'/users/1'`
   */
  pathname: string;
  /**
   * Query string followed by `?` - *e.g.*`'page=1&key=value'`
   */
  queryString?: string;
  /**
   * Path parameters as key-value object - *e.g.*`{ userId: 1 }`
   * The key name is determined by the filename.
   */
  pathParams?: Path extends string[]
    ? { [K in Path[number]]: string }
    : { [key: string]: string };
  /**
   * Query parameters as key-value object - *e.g.*`{ page: 1 }`
   */
  queryParams?: Query extends ParsedUrlQuery
    ? { [K in keyof Query]: Query[K] }
    : ParsedUrlQuery;
};

/**
 * Return the route object including values
 * that Next `router` object doesn't have directly.
 *
 * @example
 * // In case of generics being used.
 * const route = useRoute<['userId'], { page: string }>();
 * route.pathParams.userId // `string`
 * route.queryParams.page // `string`
 */
const useRoute = <
  Path extends string[] | void = void,
  Query extends ParsedUrlQuery | void = void
>(): AppRoute<Path, Query> => {
  const router = useRouter();

  if (!router.isReady) {
    return {
      pathname: router.pathname,
    };
  }

  /**
   * **Note:**
   * In terms of [dynamic routes](https://nextjs.org/docs/routing/dynamic-routes),
   * on the server side or until the router is ready (`isReady` is `true`),
   * ~`asPath` value is the same as `pathname`.~
   * `query` have no query parameters even if `asPath` contains the query string.
   * ~For example, it's like `/users/[userId]`, not `/users/1`.~
   * (e.g. `asPath` => `/users/1?foo=bar`, `query` => `{ userId: 1 }`)
   * ~In that time, `query` value is empty `{}`, not like `{ userId: '1' }`.~
   * After the router is ready on the client side, the values are updated.
   * (e.g. `pathname` => `/email/verify/[...credentials]`, `asPath` => `/email/verify/xxx/yyy`)
   */
  const pathAndQuery = router.asPath.split('?');
  const pathname: AppRoute['pathname'] = pathAndQuery[0];
  const queryString: AppRoute['queryString'] = pathAndQuery[1];

  /**
   * `NextRouter.query` value containing only path params.
   */
  const pathParams = getPathParamNames(router).reduce(
    (obj, routeSegmentName: string) => {
      const key = routeSegmentName.replace('...', '');
      const values = router.query[key];

      switch (typeof values) {
        case 'string':
          obj[key] = values;
          break;
        case 'object':
          obj[key] = values.join(' ');
          break;
        default:
        // throw new Error('Unexpected.');
      }

      return obj;
    },
    {} as NonNullable<AppRoute<Path, Query>['pathParams']>
  );

  /**
   * `NextRouter.query` value containing only query params.
   *
   * **Note:**
   * In terms of [dynamic routes](https://nextjs.org/docs/routing/dynamic-routes),
   * on the server side or until the router is ready (`isReady` is `true`),
   * `query` have no query parameters even if `asPath` contains the query string.
   * (e.g. `asPath` => `/users/1?foo=bar`, `query` => `{ userId: 1 }`)
   * (e.g. `asPath` => `/email/verify/[...credentials]`, `query` => `{}`)
   */
  const queryParams = getQueryParamNames(router).reduce(
    (obj, queryParamName: string) => {
      const queryValue = router.query[queryParamName];

      if (router.isReady && typeof queryValue === 'undefined') {
        console.error('Unexpected query parameter format.');
      }

      obj[queryParamName] = queryValue;

      return obj;
    },
    {} as NonNullable<AppRoute<Path, Query>['queryParams']>
  );

  return {
    pathname,
    queryString,
    pathParams,
    queryParams,
  };
};

/**
 * Get the path parameter keys from NextRouter.
 *
 * @example
 * router.pathname ==='/users/[userId]' => ['userId']
 */
const getPathParamNames = (router: NextRouter): string[] =>
  router.pathname.match(/(?<=\[)[^\]]+(?=\])/g) ?? [];

/**
 * Get the query parameter keys from NextRouter.
 *
 * @example
 * router.asPath ==='/users?foo=x&bar=y&bar=' => ['foo', 'bar']
 */
const getQueryParamNames = (router: NextRouter): string[] => {
  const queryString = router.asPath.split('?')[1];
  const queryParams = queryString?.split('&') ?? [];

  return [...new Set(queryParams.map((param) => param.split('=')[0]))];
};

export default useRoute;
