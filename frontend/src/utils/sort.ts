/**
 * Sort rule
 */
export type Sort<T extends Record<string, unknown> = Record<string, unknown>> =
  {
    key: keyof T;
    direction?: 'asc' | 'desc';
  };

/**
 * Sort method for an array of records
 */
export type Sorter<T extends { id: K }, K> = Sort<T> | { ids: K[] };

/**
 * A function that determines the order of the elements.
 *
 * - A negative value indicates that `a` should come before `b`.
 * - A positive value indicates that `a` should come after `b`.
 * - `0` or `NaN` indicates that `a` and `b` are considered equal.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#comparefn
 * @example
 * array.sort((a, b) => compare(a, b, { key, direction }));
 */
export type SortFn = <T extends Record<string, unknown>>(
  a: T,
  b: T,
  sort: Sort<T>,
) => number;

export const sortFn: SortFn = (a, b, { key, direction }) => {
  const compare = () => {
    const valueA = a[key];
    const valueB = b[key];

    if (typeof valueA === 'number' && typeof valueB === 'number')
      return valueA - valueB;
    else if (valueA instanceof Date && valueB instanceof Date)
      return valueA.valueOf() - valueB.valueOf();

    const stringValueA = String(valueA);
    const stringValueB = String(valueB);

    if (stringValueA < stringValueB) return -1;
    else if (stringValueA > stringValueB) return 1;
    else return 0;
  };

  return direction === 'desc' ? -compare() : compare();
};

/**
 * Get a record's items as an ordered array based on the order of IDs.
 *
 * @example
 * const array = [
 *   { id: 1, name: 'Alpha' },
 *   { id: 2, name: 'Bravo' },
 * ];
 * const orderedArray = getOrderedArray(arrayToMapById(array), {ids: [2, 1]});
 * // [ { id: 2, name: 'Bravo' }, { id: 1, name: 'Alpha' } ]
 */
export const getOrderedArray = <T extends { id: K }, K extends string | number>(
  records: Map<K, T> | Record<K, T>,
  sorter: Sorter<T, K>,
): T[] => {
  if (!('ids' in sorter)) {
    const values =
      records instanceof Map
        ? [...records.values()]
        : (Object.values(records) as T[]);

    return values.sort((a, b) => sortFn(a, b, sorter));
  }

  return sorter.ids.reduce<T[]>((acc, id) => {
    const record = records instanceof Map ? records.get(id) : records[id];

    if (record) {
      acc.push(record);
    }

    return acc;
  }, []);
};

/**
 * Get a record's items as an ordered Map based on the order of IDs.
 *
 * @example
 * const array = [
 *   { id: 1, name: 'Alpha' },
 *   { id: 2, name: 'Bravo' },
 * ];
 * const orderedMap = getOrderedMap(arrayToMapById(array), [2, 1]);
 * // { 2: { id: 2, name: 'Bravo' }, 1: { id: 1, name: 'Alpha' } }
 */
export const getOrderedMap = <T extends { id: K }, K extends string | number>(
  records: Map<K, T>,
  ids: K[],
): Map<K, T> => {
  return ids.reduce<Map<K, T>>((acc, id) => {
    const record = records.get(id);

    if (record) {
      acc.set(id, record);
    }

    return acc;
  }, new Map<K, T>());
};
