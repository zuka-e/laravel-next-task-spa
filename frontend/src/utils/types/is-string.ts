/**
 * Determine if the value is a string.
 */
const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export default isString;
