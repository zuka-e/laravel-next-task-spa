import { GUEST_EMAIL, GUEST_PASSWORD } from '@/config/app';
import { faker } from '@test/utils/faker';
import { digestText } from '@test/utils/crypto';
import { repeatEach } from '@/utils';
import type { User } from '@test/api/database/models';
import db from '@test/api/database/manager';
import { timestamp } from '@test/api/database/definitions';

export const guestUser = {
  id: faker.string.uuid(),
  name: 'ゲストユーザー',
  email: GUEST_EMAIL,
  emailVerifiedAt: timestamp(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
  password: digestText(GUEST_PASSWORD),
} as User;

export const otherUser = {
  id: faker.string.uuid(),
  name: 'other_ユーザー',
  email: 'other_' + GUEST_EMAIL,
  emailVerifiedAt: timestamp(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
  password: digestText(GUEST_PASSWORD),
} as User;

export const unverifiedUser = {
  id: faker.string.uuid(),
  name: '未認証ユーザー',
  email: 'unverified_' + GUEST_EMAIL,
  emailVerifiedAt: null,
  createdAt: timestamp(),
  updatedAt: timestamp(),
  password: digestText(GUEST_PASSWORD),
} as User;

const initialUsers: User[] = [guestUser, otherUser, unverifiedUser];

const seed = (props: { count: number }) => {
  repeatEach(props.count, () => {
    db.user.create({
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.exampleEmail(),
      emailVerifiedAt: faker.date.recent().toISOString(),
      password: digestText(GUEST_PASSWORD),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    });
  });
};

const initialize = () => {
  if (db.user.count()) {
    return;
  }

  initialUsers.forEach((user) => {
    db.user.create(user);
  });

  seed({ count: 3 });
};

// 初期化実行
initialize();
