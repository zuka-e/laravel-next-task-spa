import { ResetPasswordRequest } from '@/store/thunks/auth';
import type { UserDocument } from '@test/api/models';
import { db } from '@test/api/database';
import { digestText } from '@test/utils/crypto';
import { login } from '@test/api/auth';

export const reset = (request: ResetPasswordRequest) => {
  if (request.password !== request.password_confirmation)
    throw new Error('Passwords do not match');

  const requestedUser = db.where('users', 'email', request.email)[0];
  const newUserDoc: UserDocument = {
    ...requestedUser,
    updatedAt: new Date().toISOString(),
    password: digestText(request.password),
  };

  db.update('users', newUserDoc);
  login(newUserDoc);
};
