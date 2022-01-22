import * as React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import App from './App';
import MainContainer from './components/MainContainer';
import  { getTheme } from './themes';
import { brand } from './Configuration'

ReactDOM.render(
  <ThemeProvider theme={getTheme(brand.theme)}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <MainContainer title={brand.name} />
    <App />
  </ThemeProvider>,
  document.querySelector('#root'),
);
