import {
  isApiError,
  isInvalidRequest,
  makeErrorMessageFrom,
} from '@/utils/api/errors';
import { RejectValue } from '@/store/thunks/config';

export const makeRejectValue = (error: unknown): RejectValue => {
  if (isInvalidRequest(error))
    return {
      error: {
        ...error,
        message: makeErrorMessageFrom(error),
      },
    };
  if (isApiError(error)) {
    const message =
      typeof error.response.data === 'object' &&
      error.response.data &&
      'message' in error.response.data
        ? error.response.data.message
        : error.response.statusText;

    return {
      error: {
        ...error,
        message: `${error.response.status}: ${message}`,
      },
    };
  }
  return {
    error: { message: String(error) },
  };
};
