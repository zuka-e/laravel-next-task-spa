import { SignUpRequest, SignUpResponse } from '@/store/thunks/auth';
import { db, auth } from '@test/api/models';
import { sanitizeUser, UserDocument } from '@test/api/models/user';
import { digestText } from '@test/utils/crypto';

export const store = (request: SignUpRequest): SignUpResponse => {
  const newUserDoc = {
    name: request.email,
    email: request.email,
    emailVerifiedAt: null,
    password: digestText(request.password),
  } as UserDocument;

  const createdUser = db.create('users', newUserDoc);
  auth.login(createdUser);

  return { user: sanitizeUser(createdUser) };
};
