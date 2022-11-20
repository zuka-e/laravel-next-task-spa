import type { ThemeOptions } from '@mui/material/styles';

const overrides: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      '@global': {
        a: {
          color: '#1a73e8',
          textDecoration: 'none',
          '&:hover': {
            color: '#ffa133',
            textDecoration: 'underline',
          },
        },
      },
    },
  },
  MuiButtonBase: {
    styleOverrides: {
      root: {
        '& *': { pointerEvents: 'none' }, // `event.target`として捕捉されるのを防ぐ
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: { textTransform: 'unset' },
    },
  },
  MuiLink: {
    defaultProps: {
      // https://mui.com/material-ui/migration/v5-component-changes/#✅-update-default-underline-prop
      underline: 'hover',
    },
  },
  MuiList: {
    styleOverrides: {
      dense: { paddingTop: '4px', paddingBottom: '4px' },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: { minWidth: undefined, paddingRight: '16px' },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      primary: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      gutterBottom: {
        '&:not(div)': { marginBottom: '1.2rem' },
      },
    },
  },
};

export default overrides;
