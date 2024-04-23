import { type PathParams, type HttpResponseResolver } from 'msw';
import { compose } from '@reduxjs/toolkit';

import { type ApiResponse } from '@/store/api';
import { startSession, verifyCsrfToken } from '@test/api/handlers/middleware';
import type { Middleware } from '@test/api/handlers/middleware/types';
import { type ErrorResponse } from '@test/api/handlers/utils/responses';

/**
 * Global middleware that will run for every request handler.
 */
const globalMiddleware: Middleware[] = [startSession, verifyCsrfToken];

/**
 * Creates a higher-order resolver that composes multiple middleware
 *
 * @param middleware - Additional middleware
 * @returns A function that takes a resolver and returns a composed resolver with the middleware.
 * @see https://mswjs.io/docs/recipes/global-response-delay
 * @see https://mswjs.io/docs/recipes/higher-order-resolver
 */
export const withMiddleware =
  <
    Params extends PathParams<keyof Params> = PathParams,
    RequestBody extends Record<string, unknown> | undefined = undefined,
    ResponseBody extends ApiResponse = ApiResponse
  >(
    middleware?: Middleware[]
  ) =>
  (
    resolver: HttpResponseResolver<
      Params,
      RequestBody,
      ResponseBody | ErrorResponse
    >
  ) => {
    return compose<typeof resolver>(
      ...globalMiddleware,
      ...(middleware ?? [])
    )(resolver);
  };
