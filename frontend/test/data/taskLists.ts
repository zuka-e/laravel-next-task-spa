import { timestamp } from '@test/api/database/definitions';
import db from '@test/api/database/manager';
import type { TaskBoard, TaskList } from '@test/api/database/models';
import { faker } from '@test/utils/faker';
import { boardOfGuestUser, boardOfOtherUser } from './taskBoards';
import { guestUser, otherUser } from './users';

export const listOfGuestUser = {
  id: faker.string.uuid(),
  boardId: boardOfGuestUser.id,
  title: 'ゲストユーザーのTaskList',
  description: 'ゲストユーザーが所有するTaskList',
  sequence: 2 ** 10 / 2,
  createdAt: timestamp(),
  updatedAt: timestamp(),
} as TaskList;

export const listOfOtherUser = {
  id: faker.string.uuid(),
  boardId: boardOfOtherUser.id,
  title: '他のユーザーのTaskList',
  description: '他のユーザーが所有するTaskList',
  sequence: 2 ** 10 / 2,
  createdAt: timestamp(),
  updatedAt: timestamp(),
} as TaskList;

const initialLists: TaskList[] = [listOfGuestUser, listOfOtherUser];

type SeederProps = {
  count: number;
  belongsTo: {
    board: TaskBoard;
  };
};

const seed = (props: SeederProps) => {
  [...Array(props.count)].forEach((_, i) => {
    db.taskList.create({
      id: faker.string.uuid(),
      boardId: props.belongsTo.board.id,
      title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
      description: faker.hacker.phrase(),
      sequence: (i + 1) * 2 ** 10,
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    });
  });
};

const initialize = () => {
  if (db.taskList.count()) {
    return;
  }

  initialLists.forEach((list) => {
    db.taskList.create(list);
  });

  db.taskBoard
    .findMany({ where: { userId: { equals: guestUser.id } } })
    .forEach((board, i) => {
      const count = i === 0 ? 50 : 2;
      seed({ count, belongsTo: { board } });
    });

  db.taskBoard
    .findMany({ where: { userId: { equals: otherUser.id } } })
    .forEach((board) => {
      seed({ count: 2, belongsTo: { board } });
    });
};

// 初期化実行
initialize();
