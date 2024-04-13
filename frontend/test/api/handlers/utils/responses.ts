import { HttpResponse } from 'msw';

import { type ValidationErrorResponse } from '@/store/api';

/**
 * Create `Response` for authentication errors.
 */
export const authenticationErrorResponse = (message?: string) => {
  return HttpResponse.json(
    {
      severity: 'error',
      message: message ?? 'Unauthenticated.',
    } as const,
    { status: 401 }
  );
};

/**
 * Create `Response` for authorization errors.
 */
export const authorizationErrorResponse = (message?: string) => {
  return HttpResponse.json(
    {
      severity: 'error',
      message: message ?? 'Forbidden.',
    } as const,
    { status: 403 }
  );
};

/**
 * Create `Response` for validation errors.
 */
export const validationErrorResponse = (
  errors: ValidationErrorResponse['errors']
) => {
  return HttpResponse.json(
    {
      severity: 'error',
      message: 'Invalid request.',
      errors,
    } as const,
    { status: 422 }
  );
};
