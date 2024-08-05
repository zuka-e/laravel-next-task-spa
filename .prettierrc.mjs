/**
 * @see https://prettier.io/docs/en/configuration.html
 * @see https://prettier.io/docs/en/options
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  quoteProps: 'consistent',
  /** @see https://prettier.io/docs/en/plugins */
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
