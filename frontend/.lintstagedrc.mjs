import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { parse } from 'tsconfck';

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

/**
 * Get a command to check types only for dir
 *
 * @param {string[]} allFiles staged files
 * @param {string} dir directory name
 * @see https://github.com/lint-staged/lint-staged#example-run-tsc-on-changes-to-typescript-files-but-do-not-pass-any-filename-arguments
 * @see https://github.com/lint-staged/lint-staged/issues/829#issuecomment-631563134
 */
const createTypeCheckFn = async (allFiles, dir) => {
  const files = allFiles.filter((file) => {
    return file.startsWith(`${import.meta.dirname}/${dir}`);
  });

  if (!files.length) {
    return;
  }

  const confPath = existsSync(`${import.meta.dirname}/${dir}/tsconfig.json`)
    ? `${import.meta.dirname}/${dir}/tsconfig.json`
    : `${import.meta.dirname}/tsconfig.json`;
  const confData = await parse(confPath);
  const tsconfig = confData.tsconfig;

  tsconfig.include = [
    `${import.meta.dirname}/next-env.d.ts`,
    `${import.meta.dirname}/${dir}/types/**/globals.d.ts`,
  ];

  tsconfig.files = files;

  const tmpConfPath = `${import.meta.dirname}/.tmp/tsconfig.json`;

  mkdirSync(dirname(tmpConfPath), { recursive: true });
  writeFileSync(tmpConfPath, JSON.stringify(tsconfig));

  return `pnpm run type-check -p ${confPath}`;
};

/**
 * Get a command to check types only for staged files.
 *
 * @type {import('lint-staged').ConfigFn}
 */
const typeCheck = async (files) => {
  const fn = await createTypeCheckFn(files, 'src');
  const testFn = await createTypeCheckFn(files, 'test');

  return [fn, testFn].filter(Boolean);
};

/** @type {import('lint-staged').Config} */
export default {
  // cf. https://github.com/lint-staged/lint-staged#task-concurrency
  '*.?(c|m)[jt]s?(x)': [format, lint],
  '*.?(c|m)ts?(x)': [format, lint, typeCheck],
  '!*.?(c|m)[jt]s?(x)': [format],
};
