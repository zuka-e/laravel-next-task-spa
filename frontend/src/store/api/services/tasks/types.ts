import { type AxiosError } from 'axios';

import type { SoftDelete } from '@/store/api/types';
import type { TaskBoard, TaskCard, TaskList, User } from './models';

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
 * Paginated response
 *
 * @property {Object[]} data 受け取るデータ本体の配列
 * @property {Object} links 隣り合うページ及び端のページのリンク
 * @property {Object} meta 現在のページやデータ総数などの情報
 * @see https://laravel.com/docs/eloquent-resources#pagination
 */
export type PaginationResponse<T> = {
  data: T[];
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
  meta: {
    currentPage: number;
    lastPage: number;
    from: number; // 表示中`data`の最初のインデックス
    to: number; // 表示中`data`の最後のインデックス
    total: number; // `data`総数
    perPage: number; // 一度に表示するデータ数
    path: string; // クエリ`?page=`を除いたURL
    links: {
      url: string; // 各ページへのURL ([0]は前ページ, [-1]は次ページ)
      label: string; // ページ表示用に利用できる文字 (例: "Next &raquo;")
      active: boolean; // 現在のページのみ`true`
    }[];
  };
};

/**
 * Cursor-paginated response
 */
export type CursorPaginationResponse<T> = {
  data: T[];
  links: {
    next: string | null;
    prev: string | null;
  };
  meta: {
    path: string;
    perPage: number;
    nextCursor: string | null;
    prevCursor: string | null;
  };
};

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
  sort?: string;
  direction?: string;
} & { [K in keyof T]: T[K] };

/**
 * Request params expecting cursor-paginated response
 */
type CursorPaginationRequest<
  T extends Record<string, unknown> = Record<never, never>
> = {
  cursor?: string;
  limit?: number;
  sort?: string;
  direction?: string;
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

export type RequestVerificationEmailResponse = ApiResponse;

export type RequestVerificationEmailRequest = void;

export type UpdateProfileResponse = ApiResponse<{
  user: User;
}>;

export type UpdateProfileRequest = Partial<Pick<User, 'name' | 'email'>>;

export type FetchTaskBoardsResponse = ApiResponse<
  PaginationResponse<TaskBoard>
>;

export type FetchTaskBoardsRequest = PaginationRequest;

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

export type FetchTaskListsResponse = ApiResponse<
  CursorPaginationResponse<TaskList>
>;

export type FetchTaskListsRequest = CursorPaginationRequest<{
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

export type SearchTasksByBoardResponse = ApiResponse<{
  data: TaskCard[];
}>;

export type SearchTasksByBoardRequest = {
  boardId: TaskBoard['id'];
  q: string;
};

export type FetchTaskCardsResponse = ApiResponse<
  CursorPaginationResponse<TaskCard>
>;

export type FetchTaskCardsRequest = CursorPaginationRequest<{
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
