import type { LoginRequest } from '@/store/api';
import { getUser, loginWithSession } from '@test/api/auth';
import db from '@test/api/database/manager';
import { verifyHash } from '@test/utils/crypto';

/**
 * 1. 引数の`email`から`User`を検索
 * 2. 引数の`email`と取得した`User`の`email`を比較
 *
 * @returns `email`が一致しない又は自身の`email`の場合 `true`
 */
export const isUniqueEmail = (email: string) => {
  const matchedUser = db.user.findFirst({
    where: { email: { equals: email } },
  });

  if (!matchedUser) {
    return true;
  }

  return matchedUser.email === getUser()?.email;
};

/**
 * 1. `request`の`email`から`user`を取得
 * 2. `request`の`password`と取得した`user`の`password`を比較
 * 3. 成功時は認証ユーザーとして取得した`user`をセット
 * @param request - {`email`, `password`,`remember?`}
 */
export const authenticate = async (request: LoginRequest) => {
  const user = db.user.findFirst({
    where: { email: { equals: request.email } },
  });

  if (!user || !verifyHash(request.password, user.password)) {
    return null;
  }

  loginWithSession(user);

  return user;
};
