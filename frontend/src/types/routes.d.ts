/**
 * Route definition.
 *
 * @example
 * {
 *   BOARDS: {
 *     INDEX: '/boards',
 *     LISTS: {
 *       INDEX: '/boards/:boardId/lists',
 *     },
 *   },
 * } as const satisfies Routes;
 */
export type Routes = {
  [key: Uppercase<string>]: `/${string}` | Routes;
};
