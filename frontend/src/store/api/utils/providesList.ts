/**
 * Provide each tags by IDs.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#abstracting-common-providesinvalidates-usage
 */
const providesList = <
  R extends { id: string | number }[] | undefined,
  T extends string
>(
  resultsWithIds: R,
  tagType: T
) => {
  // cf. https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#advanced-invalidation-with-abstract-tag-ids

  const baseTag = { type: tagType, id: 'LIST' } as const;

  const tags = (
    resultsWithIds
      ? [baseTag, ...resultsWithIds.map(({ id }) => ({ type: tagType, id }))]
      : [baseTag]
  ) as R extends NonNullable<R>
    ? [{ type: T; id: 'LIST' }, ...{ type: T; id: R[number]['id'] }[]]
    : [{ type: T; id: 'LIST' }];

  return tags;
};

export default providesList;
