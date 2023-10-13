import type { UserDocument } from '@test/api/models';
import { db } from '@test/api/database';
import { logout } from '@test/api/auth';

export const remove = (currentUser: UserDocument) => {
  if (!db.remove('users', currentUser.id))
    throw new Error('The Account failed to be deleted');

  logout();
};
