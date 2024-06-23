import type { TaskList } from '@/models';
import { db, type Doc } from '@test/api/database';
import { faker } from '@test/utils/faker';
import { guestUser, otherUser } from './users';
import { boardOfGuestUser, boardOfOtherUser } from './taskBoards';

export const listOfGuestUser: TaskList = {
  id: faker.string.uuid(),
  boardId: boardOfGuestUser.id,
  title: 'ゲストユーザーのTaskList',
  description: 'ゲストユーザーが所有するTaskList',
  sequence: 2 ** 10 / 2,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const listOfOtherUser: TaskList = {
  id: faker.string.uuid(),
  boardId: boardOfOtherUser.id,
  title: '他のユーザーのTaskList',
  description: '他のユーザーが所有するTaskList',
  sequence: 2 ** 10 / 2,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const initialLists: TaskList[] = [listOfGuestUser, listOfOtherUser];

type SeederProps = {
  count: number;
  belongsTo: {
    board: Doc<'taskBoards'>;
  };
};

const runSeeder = (props: SeederProps) => {
  initialLists.forEach((list) => {
    db.create('taskLists', list);
  });

  [...Array(props.count)].forEach((_, i) => {
    db.create('taskLists', {
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
  db.load('taskLists');

  if (db.exists('taskLists')) return;

  const guestUserBoards = db.where('taskBoards', 'userId', guestUser.id);
  guestUserBoards.forEach((board, i) => {
    const count = i === 0 ? 50 : 2;
    runSeeder({ count, belongsTo: { board } });
  });

  const otherUserBoards = db.where('taskBoards', 'userId', otherUser.id);
  otherUserBoards.forEach((board) => {
    runSeeder({ count: 2, belongsTo: { board } });
  });
};

// 初期化実行
initialize();
