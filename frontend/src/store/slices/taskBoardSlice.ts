import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskBoard, TaskBoardsCollection, TaskCard, TaskList } from '@/models';
import { compare, SortOperation } from '@/utils/sort';
import { updateTaskCardRelationships } from '@/store/thunks/cards/updateTaskCardRelationships';

export type DeleteAction =
  | { model: 'board'; data: TaskBoard }
  | { model: 'list'; data: TaskList }
  | { model: 'card'; data: TaskCard };

type SortListAction = Pick<TaskList, 'boardId'> & SortOperation<TaskList>;

type SortCardAction = Pick<TaskCard, 'boardId' | 'listId'> &
  SortOperation<TaskCard>;

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
  reducers: {
    sortList(state, action: PayloadAction<SortListAction>) {
      const { boardId, column, direction } = action.payload;
      const board = state.docs[boardId];

      board.lists.sort((a, b) => compare(a, b, column, direction));
    },

    sortCard(state, action: PayloadAction<SortCardAction>) {
      const { boardId, listId, column, direction } = action.payload;
      const list = state.docs[boardId].lists.find((list) => list.id === listId);

      list?.cards.sort((a, b) => compare(a, b, column, direction));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateTaskCardRelationships.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(updateTaskCardRelationships.fulfilled, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(updateTaskCardRelationships.rejected, (state, _action) => {
      state.loading = false;
    });
  },
});

export const { sortList, sortCard } = taskBoardSlice.actions;
