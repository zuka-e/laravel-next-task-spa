import type { TaskBoard, User } from '@/models';
import { type FlashNotificationProps } from '@/store/slices';
import { type PaginationResponse } from '@/utils/api';

type LazyInvalidationModel = {
  isDeleted?: boolean;
};

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

export type RegisterRequest = {
  email: string;
  password: string;
  password_confirmation: string;
};

export type RegisterResponse = FlashNotificationProps & {
  user: User;
};

export type VerifyEmailRequest = {
  credentials: string;
  queryString: string;
};

export type VerifyEmailResponse = FlashNotificationProps & {
  user: User;
};

export type FetchTaskBoardsResponse = PaginationResponse<TaskBoard>;

export type FetchTaskBoardsRequest = {
  userId: User['id'];
  page?: string;
};

export type CreateTaskBoardResponse = {
  data: TaskBoard;
};

export type CreateTaskBoardRequest = Partial<
  Pick<TaskBoard, 'title' | 'description'>
>;

export type FetchTaskBoardResponse = {
  data: TaskBoard & LazyInvalidationModel;
};

export type FetchTaskBoardRequest =
  | Pick<TaskBoard, 'id'>
  | {
      userId: User['id'];
      boardId: TaskBoard['id'];
    };

export type UpdateTaskBoardResponse = {
  data: TaskBoard;
};

export type UpdateTaskBoardRequest = Pick<TaskBoard, 'id'> &
  Partial<
    Pick<TaskBoard, 'title' | 'description' | 'listIndexMap' | 'cardIndexMap'>
  >;

export type DestroyTaskBoardResponse = {
  data: TaskBoard;
};

export type DestroyTaskBoardRequest = Pick<TaskBoard, 'id'>;
