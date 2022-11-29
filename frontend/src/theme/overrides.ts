import type { ThemeOptions } from '@mui/material/styles';

/** Root element for Next.js */
const rootElement =
  typeof window !== 'undefined' ? document.getElementById('__next') : undefined;

const overrides: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      a: {
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
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
  MuiDrawer: {
    defaultProps: {
      // Required for applying styles in `Portal`-related elements.
      // https://mui.com/material-ui/guides/interoperability/#tailwind-css (5)
      container: rootElement,
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
  MuiPopover: {
    defaultProps: {
      // https://mui.com/material-ui/guides/interoperability/#tailwind-css (5)
      container: rootElement,
    },
  },
  MuiPopper: {
    defaultProps: {
      // https://mui.com/material-ui/guides/interoperability/#tailwind-css (5)
      container: rootElement,
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
