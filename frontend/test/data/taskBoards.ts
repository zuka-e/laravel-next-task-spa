import { faker } from '@test/utils/faker';
import type { TaskBoard, User } from '@test/api/database/models';
import db from '@test/api/database/manager';
import { timestamp } from '@test/api/database/definitions';
import { guestUser, otherUser, unverifiedUser } from './users';

export const boardOfGuestUser = {
  id: faker.string.uuid(),
  userId: guestUser.id,
  title: 'ゲストユーザーのBoard',
  description: 'ゲストユーザーが所有するTaskBoard',
  createdAt: timestamp(),
  updatedAt: timestamp(),
} as TaskBoard;

export const boardOfOtherUser = {
  id: faker.string.uuid(),
  userId: otherUser.id,
  title: '他のユーザーのBoard',
  description: '他のユーザーが所有するTaskBoard',
  createdAt: timestamp(),
  updatedAt: timestamp(),
} as TaskBoard;

export const boardOfUnverifiedUser = {
  id: faker.string.uuid(),
  userId: unverifiedUser.id,
  title: '未認証ユーザーのBoard',
  description: '未認証ユーザーが所有するTaskBoard',
  createdAt: timestamp(),
  updatedAt: timestamp(),
} as TaskBoard;

const initialBoards: TaskBoard[] = [
  boardOfGuestUser,
  boardOfOtherUser,
  boardOfUnverifiedUser,
];

type SeederProps = {
  count: number;
  belongsTo: { user: User };
};

const seed = (props: SeederProps) => {
  const user = db.user.findFirst({
    where: { id: { equals: props.belongsTo.user.id } },
    strict: true,
  });

  [...Array(props.count)].forEach(() => {
    db.taskBoard.create({
      userId: user.id,
      title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
      description: faker.hacker.phrase(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    });
  });
};

const initialize = () => {
  if (db.taskBoard.count()) {
    return;
  }

  initialBoards.forEach((board) => {
    db.taskBoard.create(board);
  });

  seed({ count: 30, belongsTo: { user: guestUser } });
  seed({ count: 1, belongsTo: { user: otherUser } });
};

// 初期化実行
initialize();
