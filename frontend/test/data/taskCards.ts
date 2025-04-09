import { timestamp } from '@test/api/database/definitions';
import db from '@test/api/database/manager';
import type { TaskCard, TaskList } from '@test/api/database/models';
import { faker } from '@test/utils/faker';
import { listOfGuestUser, listOfOtherUser } from './taskLists';
import { guestUser, otherUser } from './users';

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
  return [...Array(props.count)].map((_, i) => {
    return db.taskCard.create({
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

          const cards = seed({ count, belongsTo: { list } });

          db.taskList.update({
            where: { id: { equals: list.id } },
            data: { cardIds: cards.map((card) => card.id) },
          });
        });
    });

  db.taskBoard
    .findMany({ where: { userId: { equals: otherUser.id } } })
    .forEach((board) => {
      db.taskList
        .findMany({ where: { boardId: { equals: board.id } } })
        .forEach((list) => {
          const cards = seed({ count: 2, belongsTo: { list } });

          db.taskList.update({
            where: { id: { equals: list.id } },
            data: { cardIds: cards.map((card) => card.id) },
          });
        });
    });
};

// 初期化実行
initialize();
