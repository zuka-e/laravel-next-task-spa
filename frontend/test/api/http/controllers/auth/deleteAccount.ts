import { logoutWithSession } from '@test/api/auth';
import db from '@test/api/database/manager';
import type { User } from '@test/api/database/models';

export const remove = (user: User) => {
  logoutWithSession();

  db.user.delete({ where: { id: { equals: user.id } }, strict: true });
};
