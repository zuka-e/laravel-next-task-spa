import globals from 'globals';
import { includeIgnoreFile } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import testingLibrary from 'eslint-plugin-testing-library';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      // Workaround (All files are included despite `--ext` option)
      '**/*.!(?(*.)js|?(*.)mjs|?(*.)cjs|?(*.)jsx|?(*.)ts|?(*.)mts|?(*.)cts|?(*.)tsx)',
      '**/Dockerfile',
      'public/**',
    ],
  },
  // cf. https://eslint.org/docs/latest/use/configure/ignore#including-gitignore-files
  includeIgnoreFile(`${import.meta.dirname}/.gitignore`),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.config({
    // cf. https://nextjs.org/docs/app/api-reference/config/eslint#recommended-plugin-ruleset
    extends: ['plugin:@next/next/recommended'],
  }),
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      ecmaVersion: 5,
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      // cf. https://typescript-eslint.io/rules/no-unused-vars
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ['test'],
    ignores: ['e2e'],
    // cf. https://github.com/testing-library/eslint-plugin-testing-library#react
    ...testingLibrary.configs['flat/react'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
];
