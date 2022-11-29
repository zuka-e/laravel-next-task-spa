import type { ThemeOptions } from '@mui/material/styles';

const palette: ThemeOptions['palette'] = {
  primary: {
    light: '#e0fffa',
    main: '#40cbb5',
    contrastText: '#fff',
  },
  secondary: {
    main: '#ffa133',
    contrastText: '#fff',
  },
  // light, dark値の算出 0に近いほど main値に近付く (0-1)
  tonalOffset: 0.025,
};

export default palette;
