import type { Model } from '.';

type User = Model<{
  name: string;
  email: string;
  emailVerifiedAt: string | null;
}>;

export default User;
