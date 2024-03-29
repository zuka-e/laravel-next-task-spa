import { ResetPasswordRequest } from '@/store/thunks/auth';
import { auth, db, UserDocument } from '@test/api/models';
import { digestText } from '@test/utils/crypto';

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
  auth.login(newUserDoc);
};
