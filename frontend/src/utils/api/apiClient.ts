import axios from 'axios';

import { API_HOST, API_ROUTE } from '@/config/api';
import { DocumentBase } from '@/models';

/**
 * Laravelからデータの配列と共にページネーションに関する情報及びリンクをリクエストする際のレスポンスタイプ
 *
 * @property {Object[]} data 受け取るデータ本体の配列
 * @property {Object} links 隣り合うページ及び端のページのリンク
 * @property {Object} meta 現在のページやデータ総数などの情報
 * @see https://laravel.com/docs/8.x/eloquent-resources#pagination
 */
export type PaginationResponse<T extends DocumentBase> = {
  data: T[];
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    from: number; // 表示中`data`の最初のインデックス
    to: number; // 表示中`data`の最後のインデックス
    total: number; // `data`総数
    per_page: number; // 一度に表示するデータ数
    path: string; // クエリ`?page=`を除いたURL
    links: {
      url: string; // 各ページへのURL ([0]は前ページ, [-1]は次ページ)
      label: string; // ページ表示用に利用できる文字 (例: "Next &raquo;")
      active: boolean; // 現在のページのみ`true`
    }[];
  };
};

type ApiClientOption = {
  apiRoute?: boolean;
};

export const apiClient = (options?: ApiClientOption) => {
  /** @returns `true` even if the param is `undefined` (default) */
  const isNonApiRoute = () => options?.apiRoute === false;

  const apiClient = axios.create({
    baseURL: isNonApiRoute() ? API_HOST : API_ROUTE,
    withCredentials: true,
  });

  return apiClient;
};
