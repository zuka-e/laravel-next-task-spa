import type { Model } from '.';

export type User = Model<{
  name: string;
  email: string;
  emailVerifiedAt: string | null;
}>;
