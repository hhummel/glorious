import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import App from './App';
import MainContainer from './components/MainContainer';
import PaymentReceived from './components/PaymentReceived';
import  { getTheme } from './themes';
import { brand } from './config'

ReactDOM.render(
  <ThemeProvider theme={getTheme(brand.theme)}>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainContainer title={brand.name} />}/>
        <Route path="/payment-received" element={<PaymentReceived />} />
        <Route element={<MainContainer title={brand.name} />}/> 
      </Routes>
    </BrowserRouter>
    <App />
  </ThemeProvider>,
  document.querySelector('#root'),
);
