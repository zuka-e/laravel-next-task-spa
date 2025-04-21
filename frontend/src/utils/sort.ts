export type Sort<T> = {
  key: keyof T;
  direction?: 'asc' | 'desc';
};

/**
 * `Array.sort()`の比較関数として利用
 * 1. `number`型、`Date`型の場合は数値比較
 * 2. 上記以外の型は`string`型に変換して比較
 *
 * @see https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description
 * */
export const compare = <T>(
  a: T,
  b: T,
  key: keyof T,
  direction?: 'asc' | 'desc',
) => {
  const process = () => {
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

  return direction === 'desc' ? -process() : process();
};

/**
 * Get a record's items as an ordered array based on the order of IDs.
 *
 * @example
 * const array = [
 *   { id: 1, name: 'Alpha' },
 *   { id: 2, name: 'Bravo' },
 * ];
 * const orderedArray = getOrderedArray(arrayToMapById(array), [2, 1]);
 * // [ { id: 2, name: 'Bravo' }, { id: 1, name: 'Alpha' } ]
 */
export const getOrderedArray = <T extends { id: K }, K extends string | number>(
  records: Map<K, T> | Record<K, T>,
  ids: K[],
): T[] => {
  return ids.reduce<T[]>((acc, id) => {
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
