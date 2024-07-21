import { type UpdatePasswordRequest } from '@/store/api';
import type { User } from '@test/api/database/models';
import db from '@test/api/database/manager';
import { timestamp } from '@test/api/database/definitions';
import { hash } from '@test/utils/crypto';

export const update = (user: User, request: UpdatePasswordRequest): User => {
  if (request.password !== request.passwordConfirmation)
    throw new Error('Passwords do not match');

  return db.user.update({
    where: { id: { equals: user.id } },
    data: {
      ...user,
      password: hash(request.password),
      updatedAt: timestamp(),
    },
    strict: true,
  });
};
