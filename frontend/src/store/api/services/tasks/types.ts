import type { TaskBoard, User } from '@/models';
import { type PaginationResponse } from '@/utils/api';

type ApiResponse = {
  severity: 'success' | 'info' | 'warning' | 'error';
  message: string;
};

type LazyInvalidationModel = {
  isDeleted?: boolean;
};

export type FetchSessionResponse = ApiResponse & {
  user: User | null;
};

export type FetchSessionRequest = void;

export type LoginResponse = ApiResponse & {
  user: User;
};

export type LoginRequest = {
  email: string;
  password: string;
  remember?: string;
};

export type LogoutResponse = ApiResponse;

export type LogoutRequest = void;

export type RegisterResponse = ApiResponse & {
  user: User;
};

export type RegisterRequest = {
  email: string;
  password: string;
  password_confirmation: string;
};

export type VerifyEmailResponse = ApiResponse & {
  user: User;
};

export type VerifyEmailRequest = {
  credentials: string;
  queryString: string;
};

export type FetchTaskBoardsResponse = ApiResponse &
  PaginationResponse<TaskBoard>;

export type FetchTaskBoardsRequest = {
  page?: string;
};

export type CreateTaskBoardResponse = ApiResponse & {
  data: TaskBoard;
};

export type CreateTaskBoardRequest = Partial<
  Pick<TaskBoard, 'title' | 'description'>
>;

export type FetchTaskBoardResponse = ApiResponse & {
  data: TaskBoard & LazyInvalidationModel;
};

export type FetchTaskBoardRequest = Pick<TaskBoard, 'id'>;

export type UpdateTaskBoardResponse = ApiResponse & {
  data: TaskBoard;
};

export type UpdateTaskBoardRequest = Pick<TaskBoard, 'id'> &
  Partial<
    Pick<TaskBoard, 'title' | 'description' | 'listIndexMap' | 'cardIndexMap'>
  >;

export type DestroyTaskBoardResponse = ApiResponse & {
  data: TaskBoard;
};

export type DestroyTaskBoardRequest = Pick<TaskBoard, 'id'>;
