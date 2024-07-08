import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { TaskCard, TaskList } from '@/store/api/services/tasks/models';
import { type Sort } from '@/utils/sort';

type State = {
  data: Record<
    TaskList['id'],
    {
      search: {
        cursor?: string;
        sort?: Partial<Sort<TaskCard>>;
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
    /**
     * Set sort values for the list's cards.
     */
    setSortByList(
      state,
      action: PayloadAction<{
        id: TaskList['id'];
        sort: Partial<Sort<TaskCard>>;
      }>
    ) {
      const { id, sort } = action.payload;

      state.data[id] = {
        ...state.data[id],
        search: { sort, cursor: undefined },
      };
    },
  },
});

export const { setCursorByList, setSortByList } = taskListSlice.actions;
