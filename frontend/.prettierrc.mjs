/**
 * @see https://prettier.io/docs/en/options
 * @type {import('prettier').Config}
 */
export default {
  singleQuote: true,
  quoteProps: 'consistent',

  plugins: [
    // https://github.com/IanVS/prettier-plugin-sort-imports
    '@ianvs/prettier-plugin-sort-imports',
  ],

  importOrder: [
    '<BUILTIN_MODULES>',
    '',
    '^react($|/)',
    '^next($|/)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@(|components)(/.*)$',
    '^..($|/)',
    '^[.]',
  ],
  importOrderCaseSensitive: true,
  importOrderTypeScriptVersion: '5.8.3',

  overrides: [
    {
      files: 'test/**/*.ts?(x)',
      options: {
        importOrder: [
          '<BUILTIN_MODULES>',
          '',
          '^vitest($|/)',
          '<THIRD_PARTY_MODULES>',
          '',
          '^@(|test)(/.*)$',
          '^..($|/)',
          '^[.]',
        ],
      },
    },
  ],
};
