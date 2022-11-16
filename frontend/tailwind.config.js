// https://tailwindcss.com/docs/configuration
// https://mui.com/material-ui/guides/interoperability/#tailwind-css

const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  important: '#__next',
  theme: {
    // https://tailwindcss.com/docs/screens
    screens: {
      // cf. https://mui.com/material-ui/migration/v5-component-changes/#breakpoint-sizes
      sm: '600px',
      md: '900px',
      lg: '1200px',
      xl: '1536px',
    },
    extend: {
      // https://tailwindcss.com/docs/customizing-colors
      colors: {
        primary: {
          light: '#e0fffa',
          DEFAULT: '#40cbb5',
          dark: '#34a694',
        },
        secondary: {
          light: '#ffac4b',
          DEFAULT: '#ffa133',
          dark: '#d18429',
        },
        success: colors.green[500],
        error: colors.red[500],
        info: colors.cyan[500],
        warning: colors.yellow[500],
      },
    },
  },
  corePlugins: {
    // Remove Tailwind CSS's preflight style so it can use the MUI's preflight instead (CssBaseline).
    preflight: false,
  },
  plugins: [
    // cf. https://github.com/tailwindlabs/tailwindcss-line-clamp
    require('@tailwindcss/line-clamp'),
  ],
};

// ※ If CSS isn't applied after `yarn dev`, maybe `.next/` should be removed.
