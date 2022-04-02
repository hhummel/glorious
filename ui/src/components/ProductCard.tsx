import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Order, Product } from '../../types'
import OrderModal from './OrderModal'
import ProductDetailModal from './ProductDetailModal'

type Props = {
    userId: number | undefined;
    product: Product;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
}

export default function ProductCard({userId, product, cart, setCart, setVisible}: Props) {
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
        { userId && <OrderModal userId={userId} product={product} setVisible={setVisible} cart={cart} setCart={setCart} />}
      </CardActions>
    </Card>
    </>
  );
}
