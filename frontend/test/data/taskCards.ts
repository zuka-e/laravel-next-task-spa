import { faker } from '@test/utils/faker';
import type { TaskCard, TaskList } from '@test/api/database/models';
import db from '@test/api/database/manager';
import { timestamp } from '@test/api/database/definitions';
import { guestUser, otherUser } from './users';
import { listOfGuestUser, listOfOtherUser } from './taskLists';

export const cardOfGuestUser = {
  id: faker.string.uuid(),
  listId: listOfGuestUser.id,
  title: 'ゲストユーザーのTaskCard',
  content: 'ゲストユーザーが所有するTaskCard',
  deadline: timestamp(),
  done: true,
  sequence: 2 ** 10 / 2,
  createdAt: timestamp(),
  updatedAt: timestamp(),
} as TaskCard;

export const cardOfOtherUser = {
  id: faker.string.uuid(),
  listId: listOfOtherUser.id,
  title: '他のユーザーのTaskCard',
  content: '他のユーザーが所有するTaskCard',
  deadline: timestamp(),
  done: false,
  sequence: 2 ** 10 / 2,
  createdAt: timestamp(),
  updatedAt: timestamp(),
} as TaskCard;

const initialCards: TaskCard[] = [cardOfGuestUser, cardOfOtherUser];

type SeederProps = {
  count: number;
  belongsTo: {
    list: TaskList;
  };
};

const seed = (props: SeederProps) => {
  [...Array(props.count)].forEach((_, i) => {
    db.taskCard.create({
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
  if (db.taskCard.count()) {
    return;
  }

  initialCards.forEach((card) => {
    db.taskCard.create(card);
  });

  db.taskBoard
    .findMany({
      where: { userId: { equals: guestUser.id } },
    })
    .forEach((board, i) => {
      db.taskList
        .findMany({ where: { boardId: { equals: board.id } } })
        .forEach((list, j) => {
          const count = !i && !j ? 50 : 2;
          seed({ count, belongsTo: { list } });
        });
    });

  db.taskBoard
    .findMany({ where: { userId: { equals: otherUser.id } } })
    .forEach((board) => {
      db.taskList
        .findMany({ where: { boardId: { equals: board.id } } })
        .forEach((list) => {
          seed({ count: 2, belongsTo: { list } });
        });
    });
};

// 初期化実行
initialize();
