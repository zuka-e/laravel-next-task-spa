/**
 * Sleep for specified milliseconds.
 *
 * @example
 * await sleep(3000); // Wait for 3s
 * console.log('After 3s');
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default sleep;
