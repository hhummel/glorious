import * as React from 'react';
import { RecoilRoot } from 'recoil';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import App from './App';
import MainContainer from './components/MainContainer';
import  { getTheme } from './themes';
import { brand } from './config'

ReactDOM.render(
  <ThemeProvider theme={getTheme(brand.theme)}>
    <CssBaseline />
    <RecoilRoot>
      <MainContainer title={brand.name} />
    </RecoilRoot>
    <App />
  </ThemeProvider>,
  document.querySelector('#root'),
);
