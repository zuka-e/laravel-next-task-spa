/**
 * Object that can be deleted without invalidating the cache
 *
 * @example
 * // Don't invalidate tag to avoid unintended refetching resulting in 404.
 * dispatch(
 *   api.util.updateQueryData('getTaskBoard', { id }, (draft) => {
 *     draft.data.isDeleted = true;
 *   })
 * );
 * @see https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates#pessimistic-updates
 */
export type SoftDelete = {
  isDeleted?: boolean;
};
