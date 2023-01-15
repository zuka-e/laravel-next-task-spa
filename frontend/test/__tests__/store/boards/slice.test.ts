import faker from 'faker';

import { TaskBoard, TaskList, TaskCard } from '@/models';
import { initializeStore, store } from '@test/store';
import { guestUser } from '@test/data';

describe('taskBoardSlice reducers', () => {
  beforeEach(() => {
    initializeStore();
  });

  const taskBoard: TaskBoard = {
    id: faker.datatype.uuid(),
    userId: guestUser.id,
    title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
    description: faker.hacker.phrase(),
    lists: [],
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };

  const taskList: TaskList = {
    id: faker.datatype.uuid(),
    boardId: taskBoard.id,
    title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
    description: faker.hacker.phrase(),
    cards: [],
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };

  const taskCard: TaskCard = {
    id: faker.datatype.uuid(),
    listId: taskList.id,
    title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
    content: faker.hacker.phrase(),
    done: true,
    deadline: faker.date.future().toISOString(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };

  describe('openInfoBox', () => {
    const expected = {
      card: {
        open: true,
        model: 'card',
        data: taskCard,
      },
      list: {
        open: true,
        model: 'list',
        data: taskList,
      },
      board: {
        open: true,
        model: 'board',
        data: taskBoard,
      },
    } as const;

    it('should add a new infoBox whose type is board', async () => {
      const { openInfoBox } = await import('@/store/slices/taskBoardSlice');

      expect(store.getState().boards.infoBox).toEqual({});
      store.dispatch(openInfoBox({ model: 'board', data: taskBoard }));
      expect(store.getState().boards.infoBox).toEqual(expected.board);
    });

    it('should add a new infoBox whose type is list', async () => {
      const { openInfoBox } = await import('@/store/slices/taskBoardSlice');

      expect(store.getState().boards.infoBox).toEqual({});
      store.dispatch(openInfoBox({ model: 'list', data: taskList }));
      expect(store.getState().boards.infoBox).toEqual(expected.list);
    });

    it('should add a new infoBox whose type is card', async () => {
      const { openInfoBox } = await import('@/store/slices/taskBoardSlice');

      expect(store.getState().boards.infoBox).toEqual({});
      store.dispatch(openInfoBox({ model: 'card', data: taskCard }));
      expect(store.getState().boards.infoBox).toEqual(expected.card);
    });

    it('should update if the state is already set', async () => {
      const { openInfoBox } = await import('@/store/slices/taskBoardSlice');

      store.dispatch(openInfoBox({ model: 'board', data: taskBoard }));
      expect(store.getState().boards.infoBox).toEqual(expected.board);

      store.dispatch(openInfoBox({ model: 'list', data: taskList }));
      expect(store.getState().boards.infoBox).toEqual(expected.list);

      store.dispatch(openInfoBox({ model: 'card', data: taskCard }));
      expect(store.getState().boards.infoBox).toEqual(expected.card);

      store.dispatch(openInfoBox({ model: 'board', data: taskBoard }));
      expect(store.getState().boards.infoBox).toEqual(expected.board);
    });
  });

  describe('closeInfoBox', () => {
    const openInfoBoxAction = { model: 'board', data: taskBoard } as const;
    const infoBox = {
      open: true,
      model: 'board',
      data: taskBoard,
    } as const;

    it('should be run even if the state is initial state', async () => {
      const { closeInfoBox } = await import('@/store/slices/taskBoardSlice');

      expect(store.getState().boards.infoBox).toEqual({});
      store.dispatch(closeInfoBox());
      expect(store.getState().boards.infoBox).toEqual({ open: false });
    });

    it('should be run even if a infoBox is closed', async () => {
      const { closeInfoBox } = await import('@/store/slices/taskBoardSlice');

      store.dispatch(closeInfoBox());
      expect(store.getState().boards.infoBox).toEqual({ open: false });

      store.dispatch(closeInfoBox());
      expect(store.getState().boards.infoBox).toEqual({ open: false });
    });

    it('should be closed but maintain data if a infoBox is open', async () => {
      const { openInfoBox, closeInfoBox } = await import(
        '@/store/slices/taskBoardSlice'
      );

      store.dispatch(openInfoBox(openInfoBoxAction));
      expect(store.getState().boards.infoBox).toEqual(infoBox);

      store.dispatch(closeInfoBox());
      expect(store.getState().boards.infoBox).toEqual({
        ...infoBox,
        open: false,
      });
    });
  });

  describe('removeInfoBox', () => {
    const openInfoBoxAction = { model: 'board', data: taskBoard } as const;
    const infoBox = {
      open: true,
      model: 'board',
      data: taskBoard,
    } as const;

    it('should be run even if the state is initial state', async () => {
      const { removeInfoBox } = await import('@/store/slices/taskBoardSlice');

      expect(store.getState().boards.infoBox).toEqual({});
      store.dispatch(removeInfoBox());
      expect(store.getState().boards.infoBox).toEqual({});
    });

    it('should be run if a infoBox is closed', async () => {
      const { closeInfoBox, removeInfoBox } = await import(
        '@/store/slices/taskBoardSlice'
      );

      store.dispatch(closeInfoBox());
      expect(store.getState().boards.infoBox).toEqual({ open: false });

      store.dispatch(removeInfoBox());
      expect(store.getState().boards.infoBox).toEqual({});
    });

    it('should initialize the state if a infoBox is open', async () => {
      const { openInfoBox, removeInfoBox } = await import(
        '@/store/slices/taskBoardSlice'
      );

      store.dispatch(openInfoBox(openInfoBoxAction));
      expect(store.getState().boards.infoBox).toEqual(infoBox);

      store.dispatch(removeInfoBox());
      expect(store.getState().boards.infoBox).toEqual({});
    });
  });
});
