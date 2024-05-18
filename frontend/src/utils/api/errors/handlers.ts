import axios, {
  type AxiosError,
  type AxiosResponse,
  isAxiosError,
} from 'axios';

export type ApiError = Required<Pick<AxiosError, 'response'>> & AxiosError;

export const isApiError = (payload: unknown): payload is ApiError =>
  isAxiosError(payload) && !!payload.response;

export interface InvalidRequest extends AxiosError {
  response: AxiosResponse<{
    message: string;
    errors: { [source: string]: string[] };
  }>;
}

export const isInvalidRequest = (payload: unknown): payload is InvalidRequest =>
  axios.isAxiosError(payload) &&
  payload.response?.status === 422 &&
  typeof payload.response?.data?.errors === 'object';

export const makeErrorMessageFrom = (error: InvalidRequest) => {
  const concatenateErrorsWithLineBreaks = (message: string, errors: string[]) =>
    message + errors.join('\n') + '\n';

  return Object.values(error.response.data.errors).reduce(
    concatenateErrorsWithLineBreaks,
    ''
  );
};

/**
 * Get the specified field errors from a form error.
 *
 * @param error Possible form request error
 * @param field Input field name
 * @returns Error messages if exists
 */
export const getInputErrors = (
  error: unknown,
  field: string
): string[] | undefined => {
  return isInvalidRequest(error)
    ? error.response.data.errors[field]
    : undefined;
};

/**
 * Get the specified field errors as string from a form error.
 *
 * @param error Possible form request error
 * @param field Input field name
 * @param separator string to separate error messages
 * @returns Error message if exists
 */
export const getInputErrorMessage = (
  error: unknown,
  field: string,
  separator?: string
): string | undefined => {
  return isInvalidRequest(error)
    ? error.response.data.errors[field]?.join(separator ?? '\n')
    : undefined;
};
