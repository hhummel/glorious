import React from 'react';
import { useRecoilState } from 'recoil';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { Order, Product } from '../../types'
import OrderModal from './OrderModal'
import ProductDetailModal from './ProductDetailModal'
import { userState } from '../store';

type Props = {
    product: Product;
}

export default function ProductCard({product}: Props) {
  const [user, setUser] = useRecoilState(userState);
  return (
      <>
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={product.picture || "https://gloriousgrain.s3.amazonaws.com/PXL_20220107_144009933.MP.jpg"}
        alt={product.label || "Winter light"}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.label}: ${product.price} 
        </Typography>
      </CardContent>
      <CardActions>
        <ProductDetailModal product={product} />
        { user && <OrderModal product={product} />}
      </CardActions>
    </Card>
    </>
  );
}
