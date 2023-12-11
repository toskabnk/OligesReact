import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#549750',
    },
    secondary: {
      main: '#427b3e',
    },
    background: {
      default: '#cee6cc',
      paper: '#e6f3e5',
    },
  },
});

export default theme;