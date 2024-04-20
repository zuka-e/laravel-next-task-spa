import { GUEST_EMAIL, GUEST_PASSWORD } from '@/config/app';
import { UserDocument } from '@test/api/models';
import { db } from '@test/api/database';
import { faker } from '@test/utils/faker';
import { digestText } from '@test/utils/crypto';
import { repeatEach } from '@/utils';

export const guestUser: UserDocument = {
  id: faker.string.uuid(),
  name: 'ゲストユーザー',
  email: GUEST_EMAIL,
  emailVerifiedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  password: digestText(GUEST_PASSWORD),
};

export const otherUser: UserDocument = {
  id: faker.string.uuid(),
  name: 'other_ユーザー',
  email: 'other_' + GUEST_EMAIL,
  emailVerifiedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  password: digestText(GUEST_PASSWORD),
};

export const unverifiedUser: UserDocument = {
  id: faker.string.uuid(),
  name: '未認証ユーザー',
  email: 'unverified_' + GUEST_EMAIL,
  emailVerifiedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  password: digestText(GUEST_PASSWORD),
};

const initialUsers: UserDocument[] = [guestUser, otherUser, unverifiedUser];

const runSeeder = (props: { count: number }) => {
  initialUsers.forEach((user) => {
    db.create('users', user);
  });

  repeatEach(props.count, () => {
    db.create('users', {
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.exampleEmail(),
      emailVerifiedAt: faker.date.recent().toISOString(),
      password: digestText(GUEST_PASSWORD),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    });
  });
};

export const refresh = () => {
  db.reset('users');
  runSeeder({ count: 1 });
};

const initialize = () => {
  try {
    db.load('users');
  } catch (e) {
    console.log(e); // ignore SyntaxError at JSON.parse
  }
  if (db.exists('users')) return;
  else runSeeder({ count: 3 });
};

// 初期化実行
initialize();
