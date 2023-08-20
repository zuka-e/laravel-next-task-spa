import type { ThemeOptions } from '@mui/material/styles';

import tailwindConfig from '@root/tailwind.config';

const { colors } = tailwindConfig.theme.extend;

const palette: ThemeOptions['palette'] = {
  primary: {
    light: colors.primary.light,
    main: colors.primary.DEFAULT,
    dark: colors.primary.dark,
    contrastText: '#fff',
  },
  secondary: {
    light: colors.secondary.light,
    main: colors.secondary.DEFAULT,
    dark: colors.secondary.dark,
    contrastText: '#fff',
  },
};

export default palette;
