import * as React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import Login from './components/Login';
import MainContainer from './components/MainContainer';
import theme from './theme';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <MainContainer title='Glorious Grain'>
      <Login />
      <App />
    </MainContainer>
  </ThemeProvider>,
  document.querySelector('#root'),
);
