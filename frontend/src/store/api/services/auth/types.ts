import type { User } from '@/models';
import { type FlashNotificationProps } from '@/store/slices';

export type FetchSessionResponse = {
  user: User | null;
};
export type FetchSessionRequest = void;

export type LoginResponse = FlashNotificationProps & {
  user: User;
};

export type LoginRequest = {
  email: string;
  password: string;
  remember?: string;
};
