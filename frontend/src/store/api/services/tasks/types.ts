import { type AxiosError } from 'axios';

import type { TaskBoard, TaskCard, TaskList, User } from '@/models';
import { type PaginationResponse } from '@/utils/api';
import type { SoftDelete } from '@/store/api/types';

type Severity = 'success' | 'info' | 'warning' | 'error';

/**
 * API response with default properties
 */
export type ApiResponse<
  T extends Record<string, unknown> = Record<never, never>
> = {
  severity: Severity;
  message: string;
} & { [K in keyof T]: T[K] };

/**
 * Validation error
 */
export type ValidationError = {
  errors: { [source: string]: string[] };
};

/**
 * Validation error response
 */
export type ValidationErrorResponse = ApiResponse<ValidationError>;

/**
 * Validation error response by Axios
 */
export type AxiosValidationErrorResponse = AxiosError<ValidationErrorResponse>;

/**
 * Request params expecting paginated response
 */
type PaginationRequest<
  T extends Record<string, unknown> = Record<never, never>
> = {
  page?: number;
  limit?: number;
} & { [K in keyof T]: T[K] };

export type FetchSessionResponse = ApiResponse<{
  user: User | null;
}>;

export type FetchSessionRequest = void;

export type LoginResponse = ApiResponse<{
  user: User;
}>;

export type LoginRequest = {
  email: string;
  password: string;
  remember?: string;
};

export type LogoutResponse = ApiResponse;

export type LogoutRequest = void;

export type RegisterResponse = ApiResponse<{
  user: User;
}>;

export type RegisterRequest = {
  email: string;
  password: string;
  password_confirmation: string;
};

export type VerifyEmailResponse = ApiResponse<{
  user: User;
}>;

export type VerifyEmailRequest = {
  credentials: string;
  queryString: string;
};

export type FetchTaskBoardsResponse = ApiResponse<
  PaginationResponse<TaskBoard>
>;

export type FetchTaskBoardsRequest = {
  page?: string;
};

export type CreateTaskBoardResponse = ApiResponse<{
  data: TaskBoard;
}>;

export type CreateTaskBoardRequest = Partial<
  Pick<TaskBoard, 'title' | 'description'>
>;

export type FetchTaskBoardResponse = ApiResponse<{
  data: TaskBoard & SoftDelete;
}>;

export type FetchTaskBoardRequest = Pick<TaskBoard, 'id'>;

export type UpdateTaskBoardResponse = ApiResponse<{
  data: TaskBoard;
}>;

export type UpdateTaskBoardRequest = Pick<TaskBoard, 'id'> &
  Partial<Pick<TaskBoard, 'title' | 'description'>>;

export type DestroyTaskBoardResponse = ApiResponse<{
  data: TaskBoard;
}>;

export type DestroyTaskBoardRequest = Pick<TaskBoard, 'id'>;

export type FetchTaskListsResponse = ApiResponse<PaginationResponse<TaskList>>;

export type FetchTaskListsRequest = PaginationRequest<{
  boardId: TaskBoard['id'];
}>;

export type CreateTaskListResponse = ApiResponse<{
  data: TaskList;
}>;

export type CreateTaskListRequest = {
  boardId: TaskBoard['id'];
} & Partial<Pick<TaskList, 'title' | 'description'>>;

export type FetchTaskListResponse = ApiResponse<{
  data: TaskList & SoftDelete;
}>;

export type FetchTaskListRequest = Pick<TaskList, 'id'>;

export type UpdateTaskListResponse = ApiResponse<{
  data: TaskList;
}>;

export type UpdateTaskListRequest = Pick<TaskList, 'id'> &
  Partial<Pick<TaskList, 'title' | 'description'>>;

export type DestroyTaskListResponse = ApiResponse<{
  data: TaskList;
}>;

export type DestroyTaskListRequest = Pick<TaskList, 'id'>;

export type FetchTaskCardsResponse = ApiResponse<PaginationResponse<TaskCard>>;

export type FetchTaskCardsRequest = PaginationRequest<{
  listId: TaskList['id'];
}>;

export type CreateTaskCardResponse = ApiResponse<{
  data: TaskCard;
}>;

export type CreateTaskCardRequest = {
  listId: TaskList['id'];
} & Pick<TaskCard, 'title'> &
  Partial<Pick<TaskCard, 'content' | 'deadline' | 'done'>>;

export type FetchTaskCardResponse = ApiResponse<{
  data: TaskCard & SoftDelete;
}>;

export type FetchTaskCardRequest = Pick<TaskCard, 'id'>;

export type UpdateTaskCardResponse = ApiResponse<{
  data: TaskCard;
}>;

export type UpdateTaskCardRequest = Pick<TaskCard, 'id'> &
  Partial<
    Pick<
      TaskCard,
      'listId' | 'title' | 'content' | 'deadline' | 'done' | 'sequence'
    >
  > & {
    index?: number;
  };

export type DestroyTaskCardResponse = ApiResponse<{
  data: TaskCard;
}>;

export type DestroyTaskCardRequest = Pick<TaskCard, 'id'>;
