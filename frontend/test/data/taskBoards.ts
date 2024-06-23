import type { TaskBoard } from '@/models';
import { db, type Doc } from '@test/api/database';
import { faker } from '@test/utils/faker';
import { guestUser, otherUser, unverifiedUser } from './users';

export const boardOfGuestUser: TaskBoard = {
  id: faker.string.uuid(),
  userId: guestUser.id,
  title: 'ゲストユーザーのBoard',
  description: 'ゲストユーザーが所有するTaskBoard',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const boardOfOtherUser: TaskBoard = {
  id: faker.string.uuid(),
  userId: otherUser.id,
  title: '他のユーザーのBoard',
  description: '他のユーザーが所有するTaskBoard',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const boardOfUnverifiedUser: TaskBoard = {
  id: faker.string.uuid(),
  userId: unverifiedUser.id,
  title: '未認証ユーザーのBoard',
  description: '未認証ユーザーが所有するTaskBoard',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const initialBoards: TaskBoard[] = [
  boardOfGuestUser,
  boardOfOtherUser,
  boardOfUnverifiedUser,
];

type SeederProps = {
  count: number;
  belongsTo: { user: Doc<'users'> };
};

const runSeeder = (props: SeederProps) => {
  const user = db.where('users', 'id', props.belongsTo.user.id)[0];
  if (!user) throw Error('The specified data does not exist');

  initialBoards.forEach((board) => {
    db.create('taskBoards', board);
  });

  [...Array(props.count)].forEach(() => {
    db.create('taskBoards', {
      userId: user.id,
      title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
      description: faker.hacker.phrase(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    });
  });
};

const initialize = () => {
  db.load('taskBoards');

  if (db.exists('taskBoards')) return;

  runSeeder({ count: 30, belongsTo: { user: guestUser } });
  runSeeder({ count: 1, belongsTo: { user: otherUser } });
};

// 初期化実行
initialize();
