import { type ResponseTransformer, type RestRequest } from 'msw';

import applyMiddleware, { type Middleware } from './applyMiddleware';

type ResulvedMiddleware = {
  transformers: ResponseTransformer[];
  isError: boolean;
};

/**
 * Apply middleware and return `ResponseTransformer[]`,
 */
const resolveMiddleware = (
  req: RestRequest,
  middleware?: Middleware[]
): ResulvedMiddleware => {
  try {
    return {
      transformers: applyMiddleware(req, middleware),
      isError: false,
    };
  } catch (e) {
    if (Array.isArray(e)) {
      return {
        transformers: e,
        isError: true,
      };
    }

    throw e;
  }
};

export default resolveMiddleware;
