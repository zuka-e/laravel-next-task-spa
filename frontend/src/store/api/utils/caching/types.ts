import { ABSTRACT_TAG_IDS } from '@/store/api/config/cache';

/**
 * Abstract tag IDs for invalidating multiple caches simultaneously.
 *
 * @see https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#abstracting-common-providesinvalidates-usage
 */
export type AbstractTagId =
  (typeof ABSTRACT_TAG_IDS)[keyof typeof ABSTRACT_TAG_IDS];
