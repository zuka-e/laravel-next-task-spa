import type {
  DefaultBodyType,
  HttpResponse,
  HttpResponseResolver,
  PathParams,
} from 'msw';

import type { ApiResponse } from '@/store/api';

/**
 * Higher-order resolver that wrap a response resolver.
 *
 * @see https://mswjs.io/docs/recipes/global-response-delay
 * @see https://mswjs.io/docs/recipes/higher-order-resolver
 */
export type Middleware<
  R extends HttpResponseResolver = HttpResponseResolver<
    PathParams,
    DefaultBodyType,
    ApiResponse
  >,
> = (resolver: R) => (...args: Parameters<R>) => ReturnType<R> | HttpResponse;
