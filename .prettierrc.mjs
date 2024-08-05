/**
 * @see https://prettier.io/docs/en/configuration.html
 * @see https://prettier.io/docs/en/options
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  quoteProps: 'consistent',
  /** @see https://prettier.io/docs/en/plugins */
  plugins: ['@prettier/plugin-php', 'prettier-plugin-tailwindcss'],
  /** @see https://github.com/prettier/plugin-php#configuration */
  phpVersion: '8.2',
};

export default config;
