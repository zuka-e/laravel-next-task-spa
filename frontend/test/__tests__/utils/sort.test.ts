import { getOrderedArray, getOrderedMap } from '@/utils/sort';

describe('sort utilities', () => {
  const sampleData = [
    { id: 1, name: 'Alpha' },
    { id: 2, name: 'Bravo' },
    { id: 3, name: 'Charlie' },
  ];

  describe('getOrderedArray', () => {
    it('should return ordered array from Map input', () => {
      const map = new Map(sampleData.map((item) => [item.id, item]));
      const orderedIds = [2, 1, 3];
      const result = getOrderedArray(map, orderedIds);

      expect(result).toEqual([
        { id: 2, name: 'Bravo' },
        { id: 1, name: 'Alpha' },
        { id: 3, name: 'Charlie' },
      ]);
    });

    it('should return ordered array from Record input', () => {
      const record = sampleData.reduce(
        (acc, item) => {
          acc[item.id] = item;
          return acc;
        },
        {} as Record<number, (typeof sampleData)[0]>,
      );

      const orderedIds = [3, 1, 2];
      const result = getOrderedArray(record, orderedIds);

      expect(result).toEqual([
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alpha' },
        { id: 2, name: 'Bravo' },
      ]);
    });

    it('should handle missing records gracefully', () => {
      const map = new Map(sampleData.map((item) => [item.id, item]));
      const orderedIds = [2, 999, 1]; // 999 doesn't exist
      const result = getOrderedArray(map, orderedIds);

      expect(result).toEqual([
        { id: 2, name: 'Bravo' },
        { id: 1, name: 'Alpha' },
      ]);
    });

    it('should handle empty input', () => {
      const map = new Map();
      const result = getOrderedArray(map, []);
      expect(result).toEqual([]);
    });
  });

  describe('getOrderedMap', () => {
    it('should return ordered Map based on IDs', () => {
      const map = new Map(sampleData.map((item) => [item.id, item]));
      const orderedIds = [2, 1, 3];
      const result = getOrderedMap(map, orderedIds);

      expect(result instanceof Map).toBe(true);
      expect(Array.from(result.entries())).toEqual([
        [2, { id: 2, name: 'Bravo' }],
        [1, { id: 1, name: 'Alpha' }],
        [3, { id: 3, name: 'Charlie' }],
      ]);
    });

    it('should handle missing records gracefully', () => {
      const map = new Map(sampleData.map((item) => [item.id, item]));
      const orderedIds = [2, 999, 1]; // 999 doesn't exist
      const result = getOrderedMap(map, orderedIds);

      expect(Array.from(result.entries())).toEqual([
        [2, { id: 2, name: 'Bravo' }],
        [1, { id: 1, name: 'Alpha' }],
      ]);
    });

    it('should handle empty input', () => {
      const map = new Map();
      const result = getOrderedMap(map, []);
      expect(result.size).toBe(0);
    });

    it('should maintain Map type and methods', () => {
      const map = new Map(sampleData.map((item) => [item.id, item]));
      const result = getOrderedMap(map, [1, 2]);

      expect(result instanceof Map).toBe(true);
      expect(result.get(1)).toEqual({ id: 1, name: 'Alpha' });
      expect(result.has(3)).toBe(false);
    });
  });
});
