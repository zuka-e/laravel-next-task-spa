import { User } from '@/models/User';
import type { CollectionBase, DocumentBase } from '@/models';

export type UserDocument = {
  name: string;
  email: string;
  emailVerifiedAt: string | null;
  password: string;
} & DocumentBase;

export type UsersCollection = CollectionBase<UserDocument>;

export const sanitizeUser = (userDoc: UserDocument): User => {
  const { password, ...rest } = userDoc;
  return rest;
};
