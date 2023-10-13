import { ResetPasswordRequest, SignInRequest } from '@/store/thunks/auth';
import { generateRandomString } from '@/utils/generator';
import { getUser, login } from '@test/api/auth';
import { db } from '@test/api/database';
import { digestText } from '@test/utils/crypto';
import { GUEST_EMAIL } from '@/config/app';

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
  const matchedUsers = Object.values(db.collection('users')).filter(
    (user) => user.email === email
  );
  // 合致するデータがない場合`matchedUsers[0]`は`undefined`
  const matchedEmail = matchedUsers[0]?.email;
  const ownEmail = getUser()?.email;

  return !matchedEmail || matchedEmail === ownEmail;
};

/**
 * 1. `request`の`email`から`user`を取得
 * 2. `request`の`password`と取得した`user`の`password`を比較
 * 3. 成功時は認証ユーザーとして取得した`user`をセット
 * @param request - {`email`, `password`,`remember?`}
 */
export const authenticate = async (request: SignInRequest) => {
  const matchedUsers = Object.values(db.collection('users')).filter(
    (user) => user.email === request.email
  );
  const requestedUser = matchedUsers[0];

  if (!requestedUser) return null;

  if (isValidPassword(request.password, requestedUser.password)) {
    login(requestedUser);
    return requestedUser;
  } else {
    return null;
  }
};

/**
 * パスワードリセット用のトークンを生成 (パスワードリセットリンクのパラメータにする)
 */
export const validPasswordResetTokenOf = {
  [GUEST_EMAIL]: generateRandomString(32),
};

/**
 * リクエストの`email`と`token`のセットが一致するか検証
 */
export const isValidPasswordResetToken = (request: ResetPasswordRequest) =>
  validPasswordResetTokenOf[request.email] === request.token;
