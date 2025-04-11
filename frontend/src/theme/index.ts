import { createTheme } from '@mui/material/styles';

import breakpoints from './breakpoints';
import components from './overrides';
import palette from './palette';
import typography from './typography';

const theme = createTheme({
  breakpoints,
  palette,
  typography,
  components,
});

export default theme;
