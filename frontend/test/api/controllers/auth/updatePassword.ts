import { type UpdatePasswordRequest } from '@/store/thunks/auth';
import type { UserDocument } from '@test/api/models';
import { db } from '@test/api/database';
import { digestText } from '@test/utils/crypto';

type UpdatePasswordProps = {
  currentUser: UserDocument;
  request: UpdatePasswordRequest;
};

export const update = (props: UpdatePasswordProps) => {
  const { currentUser, request } = props;

  if (request.password !== request.password_confirmation)
    throw new Error('Passwords do not match');

  const newUserDoc: UserDocument = {
    ...currentUser,
    updatedAt: new Date().toISOString(),
    password: digestText(request.password),
  };

  db.update('users', newUserDoc);
};
