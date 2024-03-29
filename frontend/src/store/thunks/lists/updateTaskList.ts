import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskList } from '@/models';
import { apiClient, makePath } from '@/utils/api';
import { AsyncThunkConfig } from '@/store/thunks/config';
import { makeRejectValue } from '@/store/thunks/utils';

export type UpdateTaskListResponse = {
  data: TaskList;
};

export type UpdateTaskListRequest = Partial<
  Pick<TaskList, 'title' | 'description'>
>;

export type UpdateTaskListArg = Pick<TaskList, 'id' | 'boardId'> &
  UpdateTaskListRequest;

export const updateTaskList = createAsyncThunk<
  UpdateTaskListResponse,
  UpdateTaskListArg,
  AsyncThunkConfig
>('lists/updateTaskList', async (payload, thunkApi) => {
  const { id, boardId, ...requestBody } = payload;
  const path = makePath(['task-boards', boardId], ['task-lists', id]);

  try {
    const response = await apiClient().patch(path, requestBody);
    return response?.data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
