import type { InvalidRequest } from '@/utils/api/errors';

export type ErrorResponse = {
  message?: string;
  errors?: InvalidRequest['response']['data']['errors'];
};
