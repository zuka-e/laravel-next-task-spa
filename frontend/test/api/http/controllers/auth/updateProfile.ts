import { type UpdateProfileRequest } from '@/store/api';
import type { User } from '@test/api/database/models';
import db from '@test/api/database/manager';
import { timestamp } from '@test/api/database/definitions';
import { generateVerificationUrl } from '@test/api/http/utils/urls';

export const update = (user: User, request: UpdateProfileRequest): User => {
  const isEmailUpdated = user.email !== request.email;

  const updated = db.user.update({
    where: { id: { equals: user.id } },
    data: {
      ...user,
      name: request.name || user.name,
      email: request.email || user.email,
      emailVerifiedAt: isEmailUpdated ? null : user.emailVerifiedAt,
      updatedAt: timestamp(),
    },
    strict: true,
  });

  if (isEmailUpdated) {
    // as if sending verification email
    console.info({
      'verification URL': generateVerificationUrl(updated),
    });
  }

  return updated;
};
