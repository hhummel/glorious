import React from 'react';
import { useRecoilState } from 'recoil';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'

import CardModal from './CardModal';
import BaseModal from './BaseModal';
import OrderForm from './OrderForm';
import { cartState, userState, visibleState } from '../store';

const buttonWidth = '120px';

export default function ShoppingCart() {
  const [cart, setCart] = useRecoilState(cartState);
  const [user, setUser] = useRecoilState(userState);
  const [visible, setVisible] = useRecoilState(visibleState);

  const handleClear = () => setCart([]);
  const handleSubmit = () => handleClear();

  if (!user || !cart.length ) return (
    <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart Empty
        </Typography>
    </Container>
  )

  return (    
    <Container maxWidth="sm">
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>
        <Stack direction="row" spacing={2}>
            <CardModal buttonWidth={buttonWidth} /> 
            <BaseModal paymentMethod="VEN" buttonWidth={buttonWidth} />
            <BaseModal paymentMethod="CSH" buttonWidth={buttonWidth} />
        </Stack>
        {cart.map((order, index) => <OrderForm 
          key={index}
          index={index} 
          product={order.product} 
          order={order} 
          handleClose={()=>{}}
        />)}
      </Stack>
    </Container>
  );
};

  