import type { TaskCard } from '@/models';
import { db, type Doc } from '@test/api/database';
import { faker } from '@test/utils/faker';
import { guestUser, otherUser } from './users';
import { listOfGuestUser, listOfOtherUser } from './taskLists';

export const cardOfGuestUser: TaskCard = {
  id: faker.string.uuid(),
  listId: listOfGuestUser.id,
  title: 'ゲストユーザーのTaskCard',
  content: 'ゲストユーザーが所有するTaskCard',
  deadline: new Date().toISOString(),
  done: true,
  sequence: 2 ** 10 / 2,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const cardOfOtherUser: TaskCard = {
  id: faker.string.uuid(),
  listId: listOfOtherUser.id,
  title: '他のユーザーのTaskCard',
  content: '他のユーザーが所有するTaskCard',
  deadline: new Date().toISOString(),
  done: false,
  sequence: 2 ** 10 / 2,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const initialCards: TaskCard[] = [cardOfGuestUser, cardOfOtherUser];

type SeederProps = {
  count: number;
  belongsTo: {
    list: Doc<'taskLists'>;
  };
};

const runSeeder = (props: SeederProps) => {
  initialCards.forEach((card) => {
    db.create('taskCards', card);
  });

  [...Array(props.count)].forEach((_, i) => {
    db.create('taskCards', {
      id: faker.string.uuid(),
      listId: props.belongsTo.list.id,
      title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
      content: faker.hacker.phrase(),
      done: Math.floor(Math.random() * 10) % 3 === 0,
      deadline: faker.date.future().toISOString(),
      sequence: (i + 1) * 2 ** 10,
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    });
  });
};

const initialize = () => {
  db.load('taskCards');

  if (db.exists('taskCards')) return;

  const guestUserBoards = db.where('taskBoards', 'userId', guestUser.id);
  guestUserBoards.forEach((board, i) => {
    const guestUserLists = db.where('taskLists', 'boardId', board.id);
    guestUserLists.forEach((list, j) => {
      const count = !i && !j ? 50 : 2;
      runSeeder({ count, belongsTo: { list } });
    });
  });

  const otherUserBoards = db.where('taskBoards', 'userId', otherUser.id);
  otherUserBoards.forEach((board) => {
    const otherUserLists = db.where('taskLists', 'boardId', board.id);
    otherUserLists.forEach((list) => {
      runSeeder({ count: 2, belongsTo: { list } });
    });
  });
};

// 初期化実行
initialize();
