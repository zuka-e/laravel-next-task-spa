import { type ApiResponse } from '@/store/api/services/tasks';

const severities: ApiResponse['severity'][] = [
  'error',
  'warning',
  'info',
  'success',
];

/**
 * Determine if the type of `payload` is `ApiResponse`.
 */
const isApiResponse = (payload: unknown): payload is ApiResponse => {
  // Determine if it's `AsyncThunkAction` with a `object` payload.
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  return (
    'severity' in payload &&
    (severities as string[]).includes(payload.severity as string) &&
    'message' in payload &&
    typeof payload.message === 'string'
  );
};

export default isApiResponse;
