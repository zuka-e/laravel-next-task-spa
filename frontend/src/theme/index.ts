import { createTheme } from '@mui/material/styles';

import breakpoints from './breakpoints';
import palette from './palette';
import typography from './typography';
import components from './overrides';

const theme = createTheme({
  breakpoints,
  palette,
  typography,
  components,
});

export default theme;
