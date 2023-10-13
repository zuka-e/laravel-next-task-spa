import { type User } from '@/models/User';
import { type SignUpRequest } from '@/store/thunks/auth';
import { sanitizeUser, type UserDocument } from '@test/api/models/user';
import { db } from '@test/api/database';
import { login } from '@test/api/auth';
import { digestText } from '@test/utils/crypto';

export const store = (request: SignUpRequest): User => {
  const newUserDoc = {
    name: request.email,
    email: request.email,
    emailVerifiedAt: null,
    password: digestText(request.password),
  } as UserDocument;

  const createdUser = db.create('users', newUserDoc);
  login(createdUser);

  return sanitizeUser(createdUser);
};
