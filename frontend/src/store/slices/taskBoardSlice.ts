import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskBoard, TaskBoardsCollection, TaskCard, TaskList } from '@/models';
import { compare, SortOperation } from '@/utils/sort';
import { destroyTaskCard } from '@/store/thunks/cards';
import { updateTaskCardRelationships } from '@/store/thunks/cards/updateTaskCardRelationships';

export type FormAction =
  | { method: 'POST'; model: 'board' }
  | { method: 'POST'; model: 'list'; parent: TaskBoard }
  | { method: 'POST'; model: 'card'; parent: TaskList }
  | { method: 'PATCH'; model: 'board'; data: TaskBoard }
  | { method: 'PATCH'; model: 'list'; data: TaskList }
  | { method: 'PATCH'; model: 'card'; data: TaskCard };

export type DeleteAction =
  | { model: 'board'; data: TaskBoard }
  | { model: 'list'; data: TaskList }
  | { model: 'card'; data: TaskCard };

type SortListAction = Pick<TaskList, 'boardId'> & SortOperation<TaskList>;

type SortCardAction = Pick<TaskCard, 'boardId' | 'listId'> &
  SortOperation<TaskCard>;

type MoveCardAction = {
  dragListIndex: number;
  hoverListIndex: number;
  dragIndex: number;
  hoverIndex: number;
  boardId: string;
  listId?: string;
};

type InfoBoxAction =
  | { model: 'board'; data: TaskBoard }
  | { model: 'list'; data: TaskList }
  | { model: 'card'; data: TaskCard };

type TaskBoardState = {
  loading: boolean;
  infoBox: { open: boolean } & InfoBoxAction;
  docs: TaskBoardsCollection;
};

const initialState = {
  loading: false,
  infoBox: {} as TaskBoardState['infoBox'],
  docs: {},
  data: [],
} as TaskBoardState;

export const taskBoardSlice = createSlice({
  name: 'taskBoard',
  initialState,
  reducers: {
    openInfoBox(state, action: PayloadAction<InfoBoxAction>) {
      state.infoBox.open = true;
      state.infoBox.model = action.payload.model;
      state.infoBox.data = action.payload.data;
    },
    closeInfoBox(state) {
      state.infoBox.open = false;
    },
    removeInfoBox(state) {
      state.infoBox = initialState.infoBox;
    },
    moveCard(state, action: PayloadAction<MoveCardAction>) {
      const { dragListIndex, hoverListIndex, dragIndex, hoverIndex, boardId } =
        action.payload;

      const sortedLists = state.docs[boardId].lists;
      const dragged = sortedLists[dragListIndex].cards[dragIndex];

      if (action.payload.listId) dragged.listId = action.payload.listId;

      sortedLists[dragListIndex].cards.splice(dragIndex, 1);
      sortedLists[hoverListIndex].cards.splice(hoverIndex, 0, dragged);
    },

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

    builder.addCase(destroyTaskCard.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(destroyTaskCard.fulfilled, (state, action) => {
      const deletedCard = action.payload.data;
      const boardId = action.payload.boardId;
      const board = state.docs[boardId];
      const list = board.lists.find((list) => list.id === deletedCard.listId);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      list!.cards = list!.cards.filter((card) => card.id !== deletedCard.id);

      if (deletedCard.id === state.infoBox.data?.id)
        state.infoBox = initialState.infoBox;

      state.loading = false;
    });

    builder.addCase(destroyTaskCard.rejected, (state, _action) => {
      state.loading = false;
    });
  },
});

export const {
  openInfoBox,
  closeInfoBox,
  removeInfoBox,
  sortList,
  sortCard,
  moveCard,
} = taskBoardSlice.actions;
