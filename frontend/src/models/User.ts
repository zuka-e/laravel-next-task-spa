import type { DocumentBase } from '.';

export type User = {
  name: string;
  email: string;
  emailVerifiedAt: string | null;
} & DocumentBase;
