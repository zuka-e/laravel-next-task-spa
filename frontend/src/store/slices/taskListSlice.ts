import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { TaskList } from '@/models';

type State = {
  data: Record<
    TaskList['id'],
    {
      search: {
        cursor?: string;
      };
    }
  >;
};

const initialState: State = {
  data: {},
};

export const taskListSlice = createSlice({
  name: 'taskList',
  initialState,
  reducers: {
    /**
     * Set pagination cursor for the list's cards to fetch the next.
     */
    setCursorByList(
      state,
      action: PayloadAction<{
        id: TaskList['id'];
        cursor?: string;
      }>
    ) {
      const { id, cursor } = action.payload;

      state.data[id] = {
        ...state.data[id],
        search: { ...state.data[id]?.search, cursor },
      };
    },
  },
});

export const { setCursorByList } = taskListSlice.actions;
