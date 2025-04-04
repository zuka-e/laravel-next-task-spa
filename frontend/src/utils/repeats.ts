/**
 * Repeats a callback function the given number of times,
 * calling the callback on each iteration with the index.
 *
 * @param times - The number of times to repeat the callback.
 * @param callback - The callback function to repeat.
 */
export const repeatEach = (
  times: number,
  callback: (index: number) => void,
): void => {
  Array.from({ length: times }, (_, i) => i).forEach((i) => {
    callback(i);
  });
};

/**
 * Repeats a callback function a given number of times, collecting the results into an array.
 *
 * @param times - The number of times to repeat the callback.
 * @param callback - The callback function to repeat.
 * @returns An array containing the results of the repeated callback calls.
 */
export const repeatMap = <T>(
  times: number,
  callback: (index: number) => T,
): T[] => {
  return Array.from({ length: times }, (_, i) => i).map((j) => callback(j));
};
