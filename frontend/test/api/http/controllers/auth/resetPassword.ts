import { ResetPasswordRequest } from '@/store/thunks/auth';
import { digestText } from '@test/utils/crypto';
import { login } from '@test/api/auth';
import db from '@test/api/database/manager';
import { timestamp } from '@test/api/database/definitions';

export const reset = (request: ResetPasswordRequest) => {
  if (request.password !== request.password_confirmation)
    throw new Error('Passwords do not match');

  const user = db.user.findFirst({
    where: { email: { equals: request.email } },
    strict: true,
  });

  db.user.update({
    where: { id: { equals: user.id } },
    data: {
      ...user,
      updatedAt: timestamp(),
      password: digestText(request.password),
    },
    strict: true,
  });

  login(user);
};
