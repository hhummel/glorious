import React, { useState, useEffect } from 'react';
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

type Props = {
    title: string;
  };

export default function MainContainer({ title }: Props) {
  const [visible, setVisible] = useState(1);
  const [productData, setProductData] = useState<Array<Product>>([]);
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
        <NavBar setVisible={setVisible} />
        {(visible === 1) && <Products productData={productData}/> }
        {(visible === 2) && <Account productData={productData}/>}
        {(visible === 3) && <ShoppingCart setVisible={setVisible}/>}
        {(visible === 4) && <Profile setVisible={setVisible}/>}
        {(visible === 5) && <About/>}
        {(visible === 6) && <FAQ/>}
        {(visible === 7) && <NewUser setVisible={setVisible}/>}
        {(visible === 8) && <ResetPassword setVisible={setVisible}/>}
        {(visible === 9) && <ForgotPassword setVisible={setVisible}/>}
        {(visible === 10) && <ConfirmPassword setVisible={setVisible}/>}
      </Container>
    </React.Fragment>
  );
}