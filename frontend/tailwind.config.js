// https://tailwindcss.com/docs/configuration
// https://mui.com/material-ui/guides/interoperability/#tailwind-css

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  important: '#__next',
  theme: {
    extend: {},
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
