import { type DefaultBodyType, type StrictRequest } from 'msw';

import type { DocumentBase } from '@/models';
import { type PaginationResponse } from '@/utils/api';

type PaginateProps<T> = {
  request: StrictRequest<DefaultBodyType>;
  allData: T[];
};

export const paginate = <T extends DocumentBase>(props: PaginateProps<T>) => {
  const { request, allData } = props;
  const url = new URL(request.url);

  /** APIエンドポイントの内クエリパラメータ (`?page=`) を除外した部分 */
  const path = url.origin + url.pathname;
  /** クエリパラメータ */
  const query = {
    /** パラメータ未指定 or `NaN` の場合 `1` () */
    page: parseInt(url.searchParams.get('page') ?? '') || 1,
    /** パラメータ未指定 or `NaN` の場合 `20` () */
    limit: parseInt(url.searchParams.get('limit') ?? '') || 20,
  } as const;
  /** 一度に返却するデータ数 (任意の値) */
  const perPage = query.limit;
  /** `perPage`に収まらない分だけページ数を増加 (データが存在しない場合 `1`) */
  const lastPage = allData.length > 0 ? Math.ceil(allData.length / perPage) : 1;
  /** `0`以下が指定された場合 `0` */
  const currentPage = query.page <= 0 ? 0 : query.page;
  /** `currentPage`で表示するデータの先頭インデックス (始点: `1`) */
  const from = perPage * (currentPage - 1) + 1;
  /** `currentPage`で表示するデータの後尾インデックス */
  const to = perPage * currentPage;

  const response: PaginationResponse<T> = {
    data: allData.slice(from - 1, to),
    links: {
      first: path + '?page=' + 1,
      last: path + '?page=' + lastPage,
      next:
        1 <= currentPage && currentPage < lastPage
          ? path + '?page=' + (currentPage + 1)
          : null,
      prev: 1 < currentPage ? path + '?page=' + (currentPage - 1) : null,
    },
    meta: {
      current_page: currentPage,
      last_page: lastPage,
      from: from,
      to: to,
      total: allData.length,
      per_page: perPage,
      path: path,
      links: [],
    },
  };

  addMetaLinks(response);

  return response;
};

/**
 * `PaginationResponse`の`meta`に`links`を設定する
 * */
const addMetaLinks = (props: PaginationResponse<DocumentBase>) => {
  const count = props.meta.last_page + 2; // page総数 + 2 (prev, next);
  Array(count)
    .fill('_')
    .forEach((_, i) => {
      if (i === 0 && props.links.prev) {
        props.meta.links.push({
          url: props.links.prev,
          label: '&laquo; Prev',
          active: false,
        });
      } else if (i === count - 1 && props.links.next) {
        props.meta.links.push({
          url: props.links.next,
          label: 'Next &raquo;',
          active: false,
        });
      } else {
        props.meta.links.push({
          url: props.meta.path + '?page=' + i,
          label: String(i),
          active: i === props.meta.current_page,
        });
      }
    });
};
