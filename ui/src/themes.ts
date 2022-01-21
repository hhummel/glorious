import { createTheme } from '@mui/material/styles';

// A custom theme for this app
export const darkTheme = createTheme({
  
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#f48fb1',
      },
      background: {
        default: '#212121',
        paper: '#424242',
      },
    },
    components: {
      MuiList: {
        defaultProps: {
        dense: true,
      }},
      MuiMenuItem: {
        defaultProps: {
        dense: true,
      }},
      MuiTable: {
        defaultProps: {
        size: 'small',
      }},
      MuiButtonBase: {
        defaultProps: {
        disableRipple: true,
      }},
      MuiButton: {
        defaultProps: {
        size: 'small',
      }},
      MuiButtonGroup: {
        defaultProps: {
        size: 'small',
      }},
      MuiCheckbox: {
        defaultProps: {
        size: 'small',
      }},
      MuiFab: {
        defaultProps: {
        size: 'small',
      }},
      MuiFormControl: {
        defaultProps: {
        margin: 'dense',
        size: 'small',
      }},
      MuiFormHelperText: {
        defaultProps: {
        margin: 'dense',
      }},
      MuiIconButton: {
        defaultProps: {
        size: 'small',
      }},
      MuiInputBase: {
        defaultProps: {
        margin: 'dense',
      }},
      MuiInputLabel: {
        defaultProps: {
        margin: 'dense',
      }},
      MuiRadio: {
        defaultProps: {
        size: 'small',
      }},
      MuiSwitch: {
        defaultProps: {
        size: 'small',
      }},
      MuiTextField: {
        defaultProps: {
        margin: 'dense',
        size: 'small',
      }},
    },
    shape: {
      borderRadius: 4,
    },
});

export const lightTheme = createTheme({
  palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: 'rgb(220, 0, 78)',
      },
      background: {
        default: '#fff',
        paper: '#fff',
      },
  },
});

export const hackerTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0f0',
    },
    background: {
      default: '#111111',
      paper: '#212121',
    },
  },
  typography: {
    fontFamily: 'Open Sans',
    h1: {
      fontFamily: 'Ubuntu Mono',
    },
    h2: {
      fontFamily: 'Ubuntu Mono',
    },
    h3: {
      fontFamily: 'Ubuntu Mono',
    },
    h4: {
      fontFamily: 'Ubuntu Mono',
    },
    h6: {
      fontFamily: 'Ubuntu Mono',
    },
    h5: {
      fontFamily: 'Ubuntu Mono',
    },
    subtitle1: {
      fontFamily: 'Ubuntu Mono',
    },
    subtitle2: {
      fontFamily: 'Ubuntu Mono',
    },
    button: {
      fontFamily: 'Ubuntu Mono',
      fontWeight: 900,
    },
    overline: {
      fontFamily: 'Ubuntu Mono',
    },
  },
});