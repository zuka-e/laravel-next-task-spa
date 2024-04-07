/**
 * Abstract tag IDs for invalidating multiple caches simultaneously.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#abstracting-common-providesinvalidates-usage
 */
export const ABSTRACT_TAG_IDS = {
  /**
   * Key for the entire list
   *
   * @see https://redux-toolkit.js.org/rtk-query/usage/mutations#revalidation-example
   */
  LIST: 'LIST',
  /**
   * Key for the partial list such as pagination
   *
   * @see https://redux-toolkit.js.org/rtk-query/usage/pagination#automated-re-fetching-of-paginated-queries
   */
  PARTIAL_LIST: 'PARTIAL-LIST',
} as const;
