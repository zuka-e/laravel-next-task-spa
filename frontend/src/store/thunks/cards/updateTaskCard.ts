import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskCard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

export type UpdateTaskCardResponse = {
  data: TaskCard;
};

export type UpdateTaskCardRequest = Partial<
  Pick<TaskCard, 'listId' | 'title' | 'content' | 'deadline' | 'done'>
>;

export type UpdateTaskCardArg = Pick<TaskCard, 'id' | 'boardId' | 'listId'> &
  UpdateTaskCardRequest;

export const updateTaskCard = createAsyncThunk<
  Pick<TaskCard, 'boardId'> & UpdateTaskCardResponse,
  UpdateTaskCardArg,
  AsyncThunkConfig
>('cards/updateTaskCard', async (payload, thunkApi) => {
  const { id, boardId, listId, ...requestBody } = payload;
  const path = makePath(['task-lists', listId], ['task-cards', id]);
  /**
   * - `Data`型はタイムゾーンを反映させた値としてAPIリクエストを送る
   * - Laravel側ではこれを`DateTime`型にキャストして扱い、またDBに保存する
   *
   * @see https://laravel.com/docs/8.x/eloquent-mutators#date-casting-and-timezones
   */
  const request = !requestBody.deadline
    ? requestBody
    : { ...requestBody, deadline: requestBody.deadline.toISOString() };

  try {
    const response = await apiClient().patch(path, request);
    return { ...response?.data, boardId: payload.boardId };
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});
