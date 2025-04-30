import {
  arrayToMapById,
  arrayToMapByKey,
  arrayToObjectById,
  arrayToObjectByKey,
} from '@/utils/array';

describe('arrayToObjectByKey', () => {
  it('should convert array to object using string key', () => {
    const array = [
      { id: '1', name: 'Alpha' },
      { id: '2', name: 'Bravo' },
    ];
    const result = arrayToObjectByKey(array, 'id');
    expect(result).toEqual({
      '1': { id: '1', name: 'Alpha' },
      '2': { id: '2', name: 'Bravo' },
    });
  });

  it('should throw error when key type is not string', () => {
    const array = [
      { id: 1, name: 'Alpha' },
      { id: 2, name: 'Bravo' },
    ];
    expect(() => arrayToObjectByKey(array, 'id')).toThrow(
      'Key type should be "string"',
    );
  });

  it('should handle empty array', () => {
    const array: Array<{ id: string; name: string }> = [];
    const result = arrayToObjectByKey(array, 'id');
    expect(result).toEqual({});
  });
});

describe('arrayToObjectById', () => {
  it('should convert array to object using id key', () => {
    const array = [
      { id: '1', name: 'Alpha' },
      { id: '2', name: 'Bravo' },
    ];
    const result = arrayToObjectById(array);
    expect(result).toEqual({
      '1': { id: '1', name: 'Alpha' },
      '2': { id: '2', name: 'Bravo' },
    });
  });

  it('should handle empty array', () => {
    const array: Array<{ id: string }> = [];
    const result = arrayToObjectById(array);
    expect(result).toEqual({});
  });
});

describe('arrayToMapByKey', () => {
  it('should convert array to Map using string key', () => {
    const array = [
      { id: '1', name: 'Alpha' },
      { id: '2', name: 'Bravo' },
    ];
    const result = arrayToMapByKey(array, 'id');
    expect(result.get('1')).toEqual({ id: '1', name: 'Alpha' });
    expect(result.get('2')).toEqual({ id: '2', name: 'Bravo' });
  });

  it('should convert array to Map using number key', () => {
    const array = [
      { id: 1, name: 'Alpha' },
      { id: 2, name: 'Bravo' },
    ];
    const result = arrayToMapByKey(array, 'id');
    expect(result.get(1)).toEqual({ id: 1, name: 'Alpha' });
    expect(result.get(2)).toEqual({ id: 2, name: 'Bravo' });
  });

  it('should handle empty array', () => {
    const array: Array<{ id: string; name: string }> = [];
    const result = arrayToMapByKey(array, 'id');
    expect(result.size).toBe(0);
  });
});

describe('arrayToMapById', () => {
  it('should convert array to Map using id key', () => {
    const array = [
      { id: '1', name: 'Alpha' },
      { id: '2', name: 'Bravo' },
    ];
    const result = arrayToMapById(array);
    expect(result.get('1')).toEqual({ id: '1', name: 'Alpha' });
    expect(result.get('2')).toEqual({ id: '2', name: 'Bravo' });
  });

  it('should handle empty array', () => {
    const array: Array<{ id: string }> = [];
    const result = arrayToMapById(array);
    expect(result.size).toBe(0);
  });
});
