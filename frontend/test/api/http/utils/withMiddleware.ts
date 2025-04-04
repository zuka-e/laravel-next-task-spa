import { type PathParams, type HttpResponseResolver } from 'msw';
import { compose } from '@reduxjs/toolkit';

import { type ApiResponse } from '@/store/api';
import {
  preserveDb,
  startSession,
  verifyCsrfToken,
} from '@test/api/http/middleware';
import type { Middleware } from '@test/api/http/middleware/types';
import { type ErrorResponse } from '@test/api/http/responses/errors';

/**
 * Global middleware that will run for every request handler.
 */
const globalMiddleware: Middleware[] = [
  preserveDb,
  startSession,
  verifyCsrfToken,
];

/**
 * Creates a higher-order resolver that composes multiple middleware
 *
 * @param middleware - Additional middleware
 * @returns A function that takes a resolver and returns a composed resolver with the middleware.
 * @see https://mswjs.io/docs/recipes/global-response-delay
 * @see https://mswjs.io/docs/recipes/higher-order-resolver
 */
const withMiddleware = <
  Params extends PathParams<keyof Params> = PathParams,
  RequestBody extends Record<string, unknown> | undefined = undefined,
  ResponseBody extends ApiResponse = ApiResponse,
>(
  middleware?: Middleware[],
) => {
  return (
    resolver: HttpResponseResolver<
      Params,
      RequestBody,
      ResponseBody | ErrorResponse
    >,
  ) => {
    return compose<typeof resolver>(
      ...globalMiddleware,
      ...(middleware ?? []),
    )(resolver);
  };
};

export default withMiddleware;
