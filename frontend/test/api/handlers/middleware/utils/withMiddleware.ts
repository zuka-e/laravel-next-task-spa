import {
  type PathParams,
  type DefaultBodyType,
  type HttpResponseResolver,
} from 'msw';
import { compose } from '@reduxjs/toolkit';

import { startSession, verifyCsrfToken } from '@test/api/handlers/middleware';
import type { Middleware } from '../types';

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
    RequestBodyType extends DefaultBodyType = DefaultBodyType,
    ResponseBodyType extends DefaultBodyType = DefaultBodyType
  >(
    middleware?: Middleware[]
  ) =>
  (
    resolver: HttpResponseResolver<Params, RequestBodyType, ResponseBodyType>
  ) => {
    return compose<typeof resolver>(
      ...globalMiddleware,
      ...(middleware ?? [])
    )(resolver);
  };
