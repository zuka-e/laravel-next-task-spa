import globals from 'globals';
import { includeIgnoreFile } from '@eslint/compat';
import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier/flat';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import next from '@next/eslint-plugin-next';
import testingLibrary from 'eslint-plugin-testing-library';
import tseslint from 'typescript-eslint';

// `tseslint.config` enables `extends` that handles `Linter.Config` (e.g. `eslint.configs.recommended`)
// as well as its array (e.g. `tseslint.configs.recommended`).
// without this, `A config object is using the "extends" key, which is not supported in flat config system.`
// cf. https://tseslint.com/packages/typescript-eslint/#flat-config-extends
export default tseslint.config(
  // cf. https://eslint.org/docs/latest/use/configure/ignore#including-gitignore-files
  includeIgnoreFile(`${import.meta.dirname}/.gitignore`),
  {
    // Include only `ignores`
    // cf. https://eslint.org/docs/latest/use/configure/ignore#ignoring-files
    ignores: ['**/Dockerfile', 'public/'],
  },
  {
    files: ['**/*.{js,cjs,cts}'],
    languageOptions: {
      globals: {
        ...globals.commonjs,
      },
    },
  },
  {
    files: ['**/*.{mjs,mts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.{js,cjs,mjs,ts,cts,mts,tsx}'],
    extends: [
      // cf. https://eslint.org/docs/latest/use/configure
      eslint.configs.recommended,
      // cf. https://github.com/prettier/eslint-config-prettier
      prettierConfig,
    ],
  },
  {
    files: ['**/*.{ts,cts,mts,tsx}'],
    extends: [tseslint.configs.recommended],
    plugins: {
      // cf. https://nextjs.org/docs/app/api-reference/config/eslint#recommended-plugin-ruleset
      '@next/next': next,
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
      ...next.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.{ts,tsx}'], // Somehow `ts` is required.
    // cf. https://github.com/jsx-eslint/eslint-plugin-react#configuration
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    extends: [
      // cf. https://github.com/jsx-eslint/eslint-plugin-react#flat-configs
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
    ],
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ['test/**'],
    ignores: ['**/e2e/**'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    extends: [
      // cf. https://github.com/testing-library/eslint-plugin-testing-library#react
      testingLibrary.configs['flat/react'],
    ],
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
    },
  },
);
