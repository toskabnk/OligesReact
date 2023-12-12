import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#769166',
    },
    secondary: {
      main: '#a7bb9a',
    },
    background: {
      default: '#e6ebe0',
      paper: '#f4f7f2',
    },
  },
});

export default theme;