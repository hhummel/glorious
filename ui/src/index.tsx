import * as React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';

import MainContainer from './components/MainContainer';
import  { darkTheme, lightTheme, hackerTheme } from './themes';

ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <MainContainer title='Glorious Grain' />
  </ThemeProvider>,
  document.querySelector('#root'),
);
