import React, { useState, useEffect } from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'

import type {} from '@mui/x-data-grid/themeAugmentation';
import { createTheme } from '@mui/material/styles';

import CartForm from './CartForm';
import { Order } from '../../types'

type Props = {
    userId: number | undefined;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
}

export default function ShoppingCart({userId, cart, setCart, setVisible}: Props) {

  
    return (    
      <Container maxWidth="sm">
        <Stack spacing={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            Shopping Cart
          </Typography>
          {userId && cart.map(order => <CartForm userId={userId} order={order} cart={cart} setCart={setCart} />)}
        </Stack>
      </Container>
    );
  };
  