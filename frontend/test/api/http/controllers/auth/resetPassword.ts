import { HttpResponse, StrictResponse } from 'msw';

import { ResetPasswordResponse, type ResetPasswordRequest } from '@/store/api';
import { loginWithSession } from '@test/api/auth';
import {
  getUserByCredentials,
  resetPassword,
} from '@test/api/http/utils/passwords';
import { validationErrorResponse } from '@test/api/http/responses';

/**
 * Reset password.
 *
 * @see https://github.com/laravel/fortify/blob/1.x/src/Http/Controllers/NewPasswordController.php#L55 - store()
 * @see https://github.com/laravel/framework/blob/10.x/src/Illuminate/Auth/Passwords/PasswordBroker.php#L84 - reset()
 */
export const store = (
  request: ResetPasswordRequest,
): StrictResponse<ResetPasswordResponse> => {
  const user = getUserByCredentials(request);

  if (typeof user === 'string') {
    return validationErrorResponse({
      email: [user],
    });
  }

  const updated = resetPassword(user, request);

  if (typeof updated === 'string') {
    return validationErrorResponse({
      email: [updated],
    });
  }

  loginWithSession(user);

  return HttpResponse.json({
    severity: 'success',
    message: 'パスワードを再設定しました。',
  });
};
