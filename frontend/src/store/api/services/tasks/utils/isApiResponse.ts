import { SEVERITIES } from '@/store/api/config/response';
import { type ApiResponse } from '@/store/api/services/tasks';
import { isPlainObject, isString } from '@/utils/types';

/**
 * Determine if the type of `value` is `ApiResponse`.
 */
const isApiResponse = (value: unknown): value is ApiResponse => {
  if (!isPlainObject(value)) {
    return false;
  }

  return (
    SEVERITIES.includes(value['severity'] as ApiResponse['severity']) &&
    isString(value['message'])
  );
};

export default isApiResponse;
