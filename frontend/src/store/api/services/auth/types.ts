import type { User } from '@/models';
import { type FlashNotificationProps } from '@/store/slices';

export type FetchSessionResponse = {
  user: User | null;
};
export type FetchSessionRequest = void;

export type SignInResponse = FlashNotificationProps & {
  user: User;
};

export type SignInRequest = {
  email: string;
  password: string;
  remember?: string;
};
