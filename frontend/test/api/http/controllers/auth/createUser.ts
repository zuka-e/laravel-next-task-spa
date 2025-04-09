import type { RegisterRequest } from '@/store/api';
import { loginWithSession } from '@test/api/auth';
import db from '@test/api/database/manager';
import type { User } from '@test/api/database/models';
import { hash } from '@test/utils/crypto';

export const store = (request: RegisterRequest): User => {
  const newUser = db.user.create({
    name: request.email,
    email: request.email,
    password: hash(request.password),
  });

  loginWithSession(newUser);

  return newUser;
};
