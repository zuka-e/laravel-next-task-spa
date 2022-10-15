import { createTheme } from '@mui/material/styles';

import palette from './palette';
import typography from './typography';
import components from './overrides';

const theme = createTheme({
  palette,
  typography,
  components,
});

export default theme;
