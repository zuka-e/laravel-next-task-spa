// https://mui.com/material-ui/guides/minimizing-bundle-size/#option-two-use-a-babel-plugin

const plugins = [
  [
    'babel-plugin-import',
    {
      libraryName: '@mui/material',
      libraryDirectory: '',
      camel2DashComponentName: false,
    },
    'core',
  ],
  [
    'babel-plugin-import',
    {
      libraryName: '@mui/icons-material',
      libraryDirectory: '',
      camel2DashComponentName: false,
    },
    'icons',
  ],
];

// https://nextjs.org/docs/advanced-features/customizing-babel-config
module.exports = {
  // Without `next/babel`, errors like `Unexpected token, expected ","` occur.
  presets: ['next/babel'],
  plugins,
};
