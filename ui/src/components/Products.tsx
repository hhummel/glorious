import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { Product } from '../../types';
import ProductCard from './ProductCard'
import { productState } from '../store';

export default function Products() {
  const [productData, setProductData] = useRecoilState(productState);
  return (    
    <Container maxWidth="sm">
      <Stack spacing={2}>
        <Typography variant="h4" component="h1" gutterBottom>Products</Typography>
        {productData.map(product => <ProductCard 
          key={product.label} 
          product={product} 
        />)}
      </Stack>
    </Container>
  );
};

function e(e: any, arg1: (any: any) => any): Product[] {
    throw new Error('Function not implemented.');
}
