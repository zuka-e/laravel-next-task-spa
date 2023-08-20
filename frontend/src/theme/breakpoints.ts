import type { ThemeOptions } from '@mui/material/styles';

import tailwindConfig from '@root/tailwind.config';

const { screens } = tailwindConfig.theme;

const breakpoints: ThemeOptions['breakpoints'] = {
  values: {
    xs: 0,
    ...(Object.fromEntries(
      Object.entries(screens).map(([key, value]) => [key, parseInt(value)])
    ) as Record<keyof typeof screens, number>),
  },
};

export default breakpoints;
