/**
 * Command to format
 *
 * @type {import('lint-staged').Command}
 * @see https://github.com/lint-staged/lint-staged#automatically-fix-code-style-with-prettier-for-any-format-prettier-supports
 */
const format = 'pnpm exec prettier --write --ignore-unknown';

/**
 * Command to lint
 *
 * @type {import('lint-staged').Command}
 * @see https://github.com/lint-staged/lint-staged#eslint--8510--flat-eslint-config
 */
const lint = 'pnpm exec eslint --fix --max-warnings=0 --no-warn-ignored';

/** @type {import('lint-staged').Config} */
export default {
  // cf. https://github.com/lint-staged/lint-staged#task-concurrency
  '*.?(c|m)[jt]s?(x)': [lint, format],
  '!*.?(c|m)[jt]s?(x)': [format],
};
