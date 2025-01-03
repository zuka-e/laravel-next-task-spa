import typescriptEslint from '@typescript-eslint/eslint-plugin';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/** @type {import('eslint').Linter.Config} */
export default [
  {
    ignores: [
      '**/node_modules',
      '**/build',
      '**/coverage',
      '**/public',
      '!**/.babelrc.js',
    ],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'prettier'
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'testing-library': testingLibrary,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'commonjs',
    },

    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['!src/*.js'],

    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  ...compat.extends('plugin:testing-library/react').map((config) => ({
    ...config,
    files: [
      'src/**/__tests__/**/*.[jt]s?(x)',
      'src/**/?(*.)+(spec|test).[jt]s?(x)',
    ],
    ignores: ['**/e2e/**/*'],
  })),
];
