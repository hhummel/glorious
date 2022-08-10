import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Account from './Account';
import Products from './Products';
import NavBar from './NavBar';
import ShoppingCart from './ShoppingCart';
import Profile from './Profile';
import { Product } from '../../types';
import About from './About';
import FAQ from './FAQ';
import NewUser from './NewUser';
import ResetPassword from './ResetPassword';
import ForgotPassword from './ForgotPassword';
import ConfirmPassword from './ConfirmPassword';
import { products } from '../utils/api';
import { visibleState, productState } from '../store';

type Props = {
    title: string;
  };

export default function MainContainer({ title }: Props) {
  const [visible, setVisible] = useRecoilState(visibleState);
  const [productData, setProductData] = useRecoilState(productState);
  useEffect(() => {
    products().then(data => setProductData(data)).catch(e => console.log(e));
  }, []);
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='sm'>
        <Typography variant="h3" component="h1" gutterBottom>
          {title}
        </Typography>
        <NavBar />
        {(visible === 1) && <Products /> }
        {(visible === 2) && <Account />}
        {(visible === 3) && <ShoppingCart />}
        {(visible === 4) && <Profile />}
        {(visible === 5) && <About/>}
        {(visible === 6) && <FAQ/>}
        {(visible === 7) && <NewUser />}
        {(visible === 8) && <ResetPassword />}
        {(visible === 9) && <ForgotPassword />}
        {(visible === 10) && <ConfirmPassword />}
      </Container>
    </React.Fragment>
  );
}