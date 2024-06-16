import { createSlice } from '@reduxjs/toolkit';

import { TaskBoard, TaskBoardsCollection, TaskCard, TaskList } from '@/models';

export type DeleteAction =
  | { model: 'board'; data: TaskBoard }
  | { model: 'list'; data: TaskList }
  | { model: 'card'; data: TaskCard };

type TaskBoardState = {
  loading: boolean;
  docs: TaskBoardsCollection;
};

const initialState = {
  loading: false,
  docs: {},
  data: [],
} as TaskBoardState;

export const taskBoardSlice = createSlice({
  name: 'taskBoard',
  initialState,
  reducers: {},
});
