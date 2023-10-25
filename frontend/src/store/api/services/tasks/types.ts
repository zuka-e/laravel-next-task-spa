import type { TaskBoard, User } from '@/models';
import { type PaginationResponse } from '@/utils/api';

export type FetchTaskBoardsResponse = PaginationResponse<TaskBoard>;

export type FetchTaskBoardsRequest = {
  userId: User['id'];
  page?: string;
};
