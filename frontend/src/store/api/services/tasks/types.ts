import type { TaskBoard, User } from '@/models';
import { type FlashNotificationProps } from '@/store/slices';
import { type PaginationResponse } from '@/utils/api';

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

export type LogoutResponse = FlashNotificationProps;

export type LogoutRequest = void;

export type FetchTaskBoardsResponse = PaginationResponse<TaskBoard>;

export type FetchTaskBoardsRequest = {
  userId: User['id'];
  page?: string;
};
