/**
 * Convert an array to a record by each item's key.
 *
 * @example
 * const array = [
 *   { id: '1', name: 'Alpha' },
 *   { id: '2', name: 'Bravo' },
 * ];
 * const record = arrayToObjectByKey(array, 'id');
 * // { '1': { id: '1', name: 'Alpha' }, '2': { id: '2', name: 'Bravo' } }
 */
export const arrayToObjectByKey = <T extends Record<string, unknown>>(
  array: T[],
  key: keyof T,
): Record<string, T> => {
  return array.reduce<Record<string, T>>((acc, item) => {
    const keyValue = item[key];

    if (!(typeof keyValue === 'string')) {
      throw new Error('Key type should be "string"');
    }

    acc[keyValue] = item;

    return acc;
  }, {});
};

/**
 * Convert an array to a record by each item's ID.
 *
 * @example
 * const array = [
 *   { id: 1, name: 'Alpha' },
 *   { id: 2, name: 'Bravo' },
 * ];
 * const record = arrayToObjectById(array);
 * // { 1: { id: 1, name: 'Alpha' }, 2: { id: 2, name: 'Bravo' } }
 */
export const arrayToObjectById = <T extends { id: string }>(
  array: T[],
): Record<string, T> => {
  return arrayToObjectByKey(array, 'id');
};

/**
 * Convert an array to a Map by each item's key.
 *
 * @example
 * const array = [
 *   { id: 1, name: 'Alpha' },
 *   { id: 2, name: 'Bravo' },
 * ];
 * const map = arrayToMapByKey(array, 'id');
 * // { 1: { id: 1, name: 'Alpha' }, 2: { id: 2, name: 'Bravo' } }
 */
export const arrayToMapByKey = <
  T extends Record<string, unknown>,
  K extends keyof T,
>(
  array: T[],
  key: K,
): Map<T[K], T> => {
  return array.reduce((acc, item) => {
    const keyValue = item[key];

    return acc.set(keyValue, item);
  }, new Map<T[K], T>());
};

/**
 * Convert an array to a Map by each item's ID.
 *
 * @example
 * const array = [
 *   { id: 1, name: 'Alpha' },
 *   { id: 2, name: 'Bravo' },
 * ];
 * const map = arrayToMapById(array);
 * // { 1: { id: 1, name: 'Alpha' }, 2: { id: 2, name: 'Bravo' } }
 */
export const arrayToMapById = <T extends { id: string }>(
  array: T[],
): Map<string, T> => {
  return arrayToMapByKey(array, 'id');
};
