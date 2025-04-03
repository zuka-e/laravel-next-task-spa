/**
 * Determine if the value is a plain object.
 */
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

export default isPlainObject;
