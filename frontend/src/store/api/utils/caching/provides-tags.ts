import type { AbstractTagId } from './types';

/**
 * Returns cache tags for each query result with an abstract tag.
 *
 * @param resultsWithIds - An array of API response containing IDs.
 * @param tagType - The type of tag to provide.
 * @returns An array of tags.
 * @see https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#abstracting-common-providesinvalidates-usage
 * @see https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#advanced-invalidation-with-abstract-tag-ids
 */
const getTagsWithAbstract = <
  R extends { id: string | number }[] | undefined,
  T extends string,
  U extends AbstractTagId,
>(
  resultsWithIds: R,
  tagType: T,
  abstractTagId: U,
) => {
  // cf. https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#advanced-invalidation-with-abstract-tag-ids

  const baseTag = { type: tagType, id: abstractTagId } as const;

  const tags = (
    resultsWithIds
      ? [baseTag, ...resultsWithIds.map(({ id }) => ({ type: tagType, id }))]
      : [baseTag]
  ) as R extends NonNullable<R>
    ? [{ type: T; id: U }, ...{ type: T; id: R[number]['id'] }[]]
    : [{ type: T; id: U }];

  return tags;
};

/**
 * Returns cache tags for each query result and its entire list.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#abstracting-common-providesinvalidates-usage
 * @see https://redux-toolkit.js.org/rtk-query/usage/mutations#revalidation-example
 */
export const getTagsForList = <
  R extends Parameters<typeof getTagsWithAbstract>[0],
  T extends Parameters<typeof getTagsWithAbstract>[1],
>(
  resultsWithIds: R,
  tagType: T,
) => getTagsWithAbstract(resultsWithIds, tagType, 'LIST');

/**
 * Returns cache tags for each query result and "partial" list such as paginated data.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#abstracting-common-providesinvalidates-usage
 * @see https://redux-toolkit.js.org/rtk-query/usage/pagination#automated-re-fetching-of-paginated-queries
 */
export const getTagsForPartialList = <
  R extends Parameters<typeof getTagsWithAbstract>[0],
  T extends Parameters<typeof getTagsWithAbstract>[1],
>(
  resultsWithIds: R,
  tagType: T,
) => getTagsWithAbstract(resultsWithIds, tagType, 'PARTIAL-LIST');
