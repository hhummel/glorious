import React, { useState, useEffect } from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'

import type {} from '@mui/x-data-grid/themeAugmentation';
import { createTheme } from '@mui/material/styles';

import OrderForm from './OrderForm';
import { Order } from '../../types'

type Props = {
    userId: number | undefined;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
}

export default function ShoppingCart({userId, cart, setCart, setVisible}: Props) {

  const handleClear = () => setCart([]);
  const handleSubmit = () => {
    console.log('Submit shoppring cart!');
    handleClear();
  }
  
  return (    
    <Container maxWidth="sm">
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>
        <Stack direction="row" spacing={5}>
                <Button color="primary" variant="contained" onClick={handleSubmit}>
                  Checkout
                </Button>
                <Button color="primary" variant="contained" onClick={handleClear}>
                  Empty cart
                </Button>
              </Stack>
        {userId && cart.map((order, index) => <OrderForm index={index} product={order.product} userId={userId} order={order} cart={cart} setCart={setCart} handleClose={()=>{}}/>)}
      </Stack>
    </Container>
  );
};
  