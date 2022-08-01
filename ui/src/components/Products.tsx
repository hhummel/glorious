import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';


import { products } from '../utils/api';
import { Product, Order } from '../../types';
import ProductCard from './ProductCard'

type Props = {
    userId: number | undefined;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
    productData: Array<Product>;
}

export default function Products({userId, setVisible, productData}: Props) {

  return (    
    <Container maxWidth="sm">
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" gutterBottom>Products</Typography>
        {productData.map(product => <ProductCard 
          key={product.label} 
          userId={userId} 
          product={product} 
          setVisible={setVisible}
        />)}
      </Stack>
    </Container>
  );
};

function e(e: any, arg1: (any: any) => any): Product[] {
    throw new Error('Function not implemented.');
}
