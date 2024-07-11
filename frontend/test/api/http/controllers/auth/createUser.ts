import type { RegisterRequest } from '@/store/api';
import { digestText } from '@test/utils/crypto';
import type { User } from '@test/api/database/models';
import db from '@test/api/database/manager';
import { login } from '@test/api/auth';

export const store = (request: RegisterRequest): User => {
  const newUser = db.user.create({
    name: request.email,
    email: request.email,
    password: digestText(request.password),
  });

  login(newUser);

  return newUser;
};
