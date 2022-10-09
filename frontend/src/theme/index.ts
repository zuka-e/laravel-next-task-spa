import { createTheme, adaptV4Theme } from '@mui/material/styles';

import palette from './palette';
import typography from './typography';
import overrides from './overrides';

const theme = createTheme(
  adaptV4Theme({
    palette,
    typography,
    overrides,
  })
);

export default theme;
