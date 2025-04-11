import { type DefaultBodyType, type StrictRequest } from 'msw';

import {
  type CursorPaginationResponse,
  type PaginationResponse,
} from '@/store/api';
import { base64UrlDecode, base64UrlEncode } from '@test/api/http/utils/base64';

type PaginateProps<T> = {
  request: StrictRequest<DefaultBodyType>;
  filtered: T[];
};

export const paginate = <T>(props: PaginateProps<T>) => {
  const { request, filtered } = props;
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
  const lastPage =
    filtered.length > 0 ? Math.ceil(filtered.length / perPage) : 1;
  /** `0`以下が指定された場合 `0` */
  const currentPage = query.page <= 0 ? 0 : query.page;
  /** `currentPage`で表示するデータの先頭インデックス (始点: `1`) */
  const from = perPage * (currentPage - 1) + 1;
  /** `currentPage`で表示するデータの後尾インデックス */
  const to = perPage * currentPage;

  const response: PaginationResponse<T> = {
    data: filtered.slice(from - 1, to),
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
      currentPage,
      lastPage,
      from: from,
      to: to,
      total: filtered.length,
      perPage,
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
const addMetaLinks = (props: PaginationResponse<unknown>) => {
  const count = props.meta.lastPage + 2; // page総数 + 2 (prev, next);
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
          active: i === props.meta.currentPage,
        });
      }
    });
};

export const cursorPaginate = <T extends { id: string }>(
  props: PaginateProps<T>,
): CursorPaginationResponse<T> => {
  const { request, filtered } = props;

  const url = new URL(request.url);
  const query = {
    sort: url.searchParams.get('sort'),
    direction: url.searchParams.get('direction'),
    limit: url.searchParams.get('limit'),
    cursor: url.searchParams.get('cursor'),
  } as const;

  const column = (query.sort || 'id') as keyof T;
  const direction = query.direction || 'asc';
  const perPage = parseInt(query.limit ?? '') || 20;

  const sorted = filtered.sort((a, b) => {
    if (a[column] < b[column]) return direction === 'desc' ? 1 : -1;
    if (a[column] > b[column]) return direction === 'desc' ? -1 : 1;
    if (a.id < b.id) return direction === 'desc' ? 1 : -1;
    if (a.id > b.id) return direction === 'desc' ? -1 : 1;
    return 0;
  });

  // cf. https://github.com/laravel/framework/blob/11.x/src/Illuminate/Pagination/Cursor.php#L114 - fromEncoded()
  const cursor = query.cursor ? base64UrlDecode(query.cursor) : null;

  const from = cursor
    ? sorted.findIndex((item) => {
        return (
          String(item[column]) === String(cursor[column]) &&
          item.id === cursor.id
        );
      })
    : 0;
  const to = from + perPage;

  if (from < 0) {
    throw new Error(`Unexpected cursor. "${JSON.stringify(cursor)}"`);
  }

  const nextCursor =
    from + perPage < sorted.length
      ? base64UrlEncode({
          id: sorted[from + perPage]!.id,
          [column]: sorted[from + perPage]![column],
        })
      : null;
  const prevCursor =
    from > 0
      ? base64UrlEncode({
          id: sorted[Math.max(from - perPage, 0)]!.id,
          [column]: sorted[Math.max(from - perPage, 0)]![column],
        })
      : null;
  const nextLink = nextCursor ? getUrlWithCursor(url, nextCursor) : null;
  const prevLink = prevCursor ? getUrlWithCursor(url, prevCursor) : null;

  return {
    data: sorted.slice(from, to),
    links: {
      next: nextLink,
      prev: prevLink,
    },
    meta: {
      path: url.origin + url.pathname,
      perPage,
      nextCursor,
      prevCursor,
    },
  };
};

const getUrlWithCursor = (url: URL, cursor: string) => {
  const newUrl = new URL(url);
  newUrl.searchParams.set('cursor', cursor);
  return newUrl.toString();
};
