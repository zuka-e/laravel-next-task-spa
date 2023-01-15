import { compose, context } from 'msw';

import type { ErrorResponse } from '@test/api/handlers/types';

export const returnInvalidRequest = (errors: ErrorResponse['errors']) =>
  compose(
    context.status(422),
    context.json<ErrorResponse>({
      message: 'Invalid request.',
      errors,
    })
  );
