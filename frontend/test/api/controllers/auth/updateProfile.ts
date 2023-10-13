import { type UpdateProfileRequest } from '@/store/thunks/auth';
import { sanitizeUser, UserDocument } from '@test/api/models';
import { db } from '@test/api/database';

type UpdateProfileProps = {
  currentUser: UserDocument;
  request: UpdateProfileRequest;
};

export const update = (props: UpdateProfileProps) => {
  const { currentUser, request } = props;
  const IsEmailUpdated = currentUser.email !== request.email;
  const newUserDoc: UserDocument = {
    ...currentUser,
    name: request.name || currentUser.name,
    email: request.email || currentUser.email,
    emailVerifiedAt: IsEmailUpdated ? null : currentUser.emailVerifiedAt,
    updatedAt: new Date().toISOString(),
  };

  db.update('users', newUserDoc);

  return sanitizeUser(newUserDoc);
};
