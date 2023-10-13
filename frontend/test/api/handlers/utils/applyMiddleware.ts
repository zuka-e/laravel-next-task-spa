import { context, type ResponseTransformer, type RestRequest } from 'msw';

import type { User } from '@/models/User';
import { getSession } from '@test/api/session';
import { getUser, login } from '@test/api/auth';
import { startSession, verifyCsrfToken } from '@test/api/handlers/middleware';
import type { ErrorResponse } from '@test/api/handlers/types';

export type Middleware =
  | 'authenticate'
  | 'authorize'
  | `authorize:${User['id']}`
  | 'verified';

const applyMiddleware = (req: RestRequest, middleware?: Middleware[]) => {
  // Global Middleware
  const transformers = [startSession, verifyCsrfToken]
    .map((middleware) => middleware(req))
    .reduce((acc, current): ResponseTransformer[] => {
      return [...acc, ...current];
    }, []);

  const currentUser = getUser();

  if (middleware?.includes('authenticate') && !currentUser) {
    const message = !currentUser
      ? getSession().userId
        ? 'Session expired.'
        : 'Unauthenticated.'
      : '';

    if (message) {
      throw [context.status(401), context.json<ErrorResponse>({ message })];
    }
  }

  if (middleware?.includes('verified') && !currentUser?.emailVerifiedAt)
    throw [
      context.status(403),
      context.json<ErrorResponse>({
        message: 'Email address is not verified.',
      }),
    ];

  if (middleware?.includes('authorize'))
    throw new Error('Specify the user ID. e.g. "authorize:xxx"');

  const authorizationPattern = /(?<=authorize:)[\w-]+(?=,|$)/;
  const authorizationMatch = middleware?.find((middleware) =>
    middleware.match(authorizationPattern)
  );

  if (authorizationMatch) {
    const userIds = authorizationMatch.slice('authorize:'.length).split(',');
    const uniqueUserIds = [...new Set(userIds)]; // "downlevelIteration"

    if (uniqueUserIds.includes('undefined'))
      throw [
        context.status(404),
        context.json<ErrorResponse>({ message: 'The URL was not found.' }),
      ];
    if (uniqueUserIds.length !== 1 || uniqueUserIds[0] !== currentUser?.id)
      throw [
        context.status(403),
        context.json<ErrorResponse>({
          message: 'This action is unauthorized.',
        }),
      ];
  }

  if (currentUser) {
    login(currentUser);
  }

  return transformers;
};

export default applyMiddleware;
