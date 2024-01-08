/**
 * Provide each tags by IDs.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#abstracting-common-providesinvalidates-usage
 */
const providesList = <R extends { id: string | number }[], T extends string>(
  resultsWithIds: R | undefined,
  tagType: T
): {
  type: T;
  id: R[number]['id'];
}[] => {
  // cf. https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#advanced-invalidation-with-abstract-tag-ids

  const baseTag = { type: tagType, id: 'LIST' } as const;

  return resultsWithIds
    ? [baseTag, ...resultsWithIds.map(({ id }) => ({ type: tagType, id }))]
    : [baseTag];
};

export default providesList;
