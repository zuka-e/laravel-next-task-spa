import { db } from '@test/api/database';

const initialize = (): void => {
  try {
    db.load('sessions');
  } catch (e) {
    console.log(e); // ignore SyntaxError at JSON.parse
  }
};

// 初期化実行
initialize();
