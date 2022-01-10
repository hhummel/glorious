import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import type {} from '@mui/x-data-grid/themeAugmentation';
import { createTheme } from '@mui/material/styles';

import { products } from '../utils/api';
import { Product, Order } from '../../types';
import ProductCard from './ProductCard'

const theme = createTheme({
  components: {
    // Use `MuiDataGrid` on both DataGrid and DataGridPro
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
});


type Props = {
    userId: number | undefined;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
}

export default function Products({userId, cart, setCart, setVisible}: Props) {
  const [productData, setProductData] = useState<Array<Product>>([]);
  useEffect(() => {
    products().then(data => setProductData(data)).catch(e => console.log(e));
  }, []);

  return (    
    <Container maxWidth="sm">
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Products
        </Typography>
        {
          productData.map(product => <ProductCard userId={userId} product={product} cart={cart} setCart={setCart} setVisible={setVisible}/>)
        }
      </Stack>
    </Container>
  );
};

function e(e: any, arg1: (any: any) => any): Product[] {
    throw new Error('Function not implemented.');
}
