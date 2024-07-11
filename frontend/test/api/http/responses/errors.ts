import { HttpResponse } from 'msw';

import { type ApiResponse, type ValidationErrorResponse } from '@/store/api';

export type ErrorResponse = ApiResponse<{
  severity: 'error';
}>;

/**
 * Create `Response` for authentication errors.
 */
export const authenticationErrorResponse = (message?: string) => {
  return HttpResponse.json<ErrorResponse>(
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
  return HttpResponse.json<ErrorResponse>(
    {
      severity: 'error',
      message: message ?? 'Forbidden.',
    } as const,
    { status: 403 }
  );
};

/**
 * Create `Response` for no resource errors.
 */
export const notFoundErrorResponse = (message?: string) => {
  return HttpResponse.json<ErrorResponse>(
    {
      severity: 'error',
      message: message ?? 'Not Found.',
    } as const,
    { status: 404 }
  );
};

/**
 * Create `Response` for validation errors.
 */
export const validationErrorResponse = (
  errors: ValidationErrorResponse['errors']
) => {
  return HttpResponse.json<ValidationErrorResponse>(
    {
      severity: 'error',
      message: 'Invalid request.',
      errors,
    } as const,
    { status: 422 }
  );
};
