// If any file ignored for ESLint is included in the commit files, the following will be displayed
// and the commit cannot be completed because of `--max-warnings=0`.
// -- warning  File ignored because of a matching ignore pattern. Use "--no-ignore" to override --
// cf. https://github.com/okonet/lint-staged#how-can-i-ignore-files-from-eslintignore

import { ESLint } from 'eslint';

/**
 * @param {string[]} files
 * @returns {Promise<string>}
 */
const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint();
  const isIgnored = await Promise.all(
    files.map((file) => {
      return eslint.isPathIgnored(file);
    })
  );

  return files.filter((_, i) => !isIgnored[i]).join(' ');
};

export default {
  // cf. https://github.com/okonet/lint-staged#example-wrap-filenames-in-single-quotes-and-run-once-per-file
  '**/*.{ts,tsx,js,jsx}': async (files) => {
    const filesToLint = await removeIgnoredFiles(files);

    return [
      `eslint --max-warnings=0 ${filesToLint}`,
      `prettier --write ${filesToLint}`,
    ];
  },
};
