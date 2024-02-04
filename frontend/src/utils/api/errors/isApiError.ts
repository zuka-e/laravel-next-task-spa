import { type AxiosError, isAxiosError } from 'axios';

export type ApiError = Required<Pick<AxiosError, 'response'>> & AxiosError;

export const isApiError = (payload: unknown): payload is ApiError =>
  isAxiosError(payload) && !!payload.response;
