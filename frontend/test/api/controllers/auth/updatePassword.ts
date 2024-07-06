import { type UpdatePasswordRequest } from '@/store/thunks/auth';
import type { User } from '@test/api/database/models';
import db from '@test/api/database/manager';
import { timestamp } from '@test/api/database/definitions';
import { digestText } from '@test/utils/crypto';

export const update = (user: User, request: UpdatePasswordRequest): User => {
  if (request.password !== request.password_confirmation)
    throw new Error('Passwords do not match');

  return db.user.update({
    where: { id: { equals: user.id } },
    data: {
      ...user,
      password: digestText(request.password),
      updatedAt: timestamp(),
    },
    strict: true,
  });
};
