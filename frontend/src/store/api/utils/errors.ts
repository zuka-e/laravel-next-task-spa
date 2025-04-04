import { type AxiosError, isAxiosError } from 'axios';

/**
 * Check if the error is a 404 error.
 */
export const isNotFoundError = (
  error: unknown,
): error is AxiosError & { response: { status: 404 } } => {
  if (!isAxiosError(error)) {
    return false;
  }

  return error.response?.status === 404;
};
