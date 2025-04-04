import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { TaskBoard, TaskList } from '@/store/api/services/tasks/models';
import { type Sort } from '@/utils/sort';

type State = {
  data: Record<
    TaskBoard['id'],
    {
      search: {
        cursor?: string;
        sort?: Partial<Sort<TaskList>>;
      };
    }
  >;
};

const initialState: State = {
  data: {},
};

export const taskBoardSlice = createSlice({
  name: 'taskBoard',
  initialState,
  reducers: {
    /**
     * Set pagination cursor for the board's lists to fetch the next.
     */
    setCursorByBoard(
      state,
      action: PayloadAction<{
        id: TaskBoard['id'];
        cursor?: string;
      }>,
    ) {
      const { id, cursor } = action.payload;

      state.data[id] = {
        ...state.data[id],
        search: { ...state.data[id]?.search, cursor },
      };
    },
    /**
     * Set sort values for the board's lists.
     */
    setSortByBoard(
      state,
      action: PayloadAction<{
        id: TaskBoard['id'];
        sort: Partial<Sort<TaskList>>;
      }>,
    ) {
      const { id, sort } = action.payload;

      state.data[id] = {
        ...state.data[id],
        search: { sort, cursor: undefined },
      };
    },
  },
});

export const { setCursorByBoard, setSortByBoard } = taskBoardSlice.actions;
