import { SignInRequest } from '@/store/thunks/auth';
import { getUser, login } from '@test/api/auth';
import { digestText } from '@test/utils/crypto';
import db from '@test/api/database/manager';

/**
 * リクエストされた`password`をハッシュ化し、`User`の`password`と比較
 */
export const isValidPassword = (
  requestPassword: string,
  userPassword: string
) => {
  const digestedRequestPassword = digestText(requestPassword);
  const digestedUserPassword = userPassword;

  return digestedRequestPassword === digestedUserPassword;
};

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
export const authenticate = async (request: SignInRequest) => {
  const user = db.user.findFirst({
    where: { email: { equals: request.email } },
  });

  if (!user || !isValidPassword(request.password, user.password)) {
    return null;
  }

  login(user);

  return user;
};
