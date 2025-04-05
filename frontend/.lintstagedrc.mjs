/**
 * Command to format
 *
 * @type {import('lint-staged').Command}
 * @see https://github.com/lint-staged/lint-staged#automatically-fix-code-style-with-prettier-for-any-format-prettier-supports
 */
const format = 'pnpm run format';

/**
 * Command to lint
 *
 * @type {import('lint-staged').Command}
 * @see https://github.com/lint-staged/lint-staged#eslint--8510--flat-eslint-config
 */
const lint = 'pnpm run lint';
/** @type {import('lint-staged').Config} */
export default {
  // cf. https://github.com/lint-staged/lint-staged#task-concurrency
  '*.?(c|m)[jt]s?(x)': [format, lint],
  // '*.?(c|m)ts?(x)': [lint, typeCheckFn, format],
  '!*.?(c|m)[jt]s?(x)': [format],
};
