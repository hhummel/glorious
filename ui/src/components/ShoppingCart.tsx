import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import Stack from '@mui/material/Stack'

import CardModal from './CardModal';
import BaseModal from './BaseModal';
import OrderForm from './OrderForm';
import { Order } from '../../types'

const buttonWidth = '120px';


type Props = {
    userId: number | undefined;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
}

export default function ShoppingCart({userId, cart, setCart, setVisible}: Props) {
  const handleClear = () => setCart([]);
  const handleSubmit = () => handleClear();

  if (!userId || !cart.length ) return (
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
            <CardModal userId={userId} cart={cart} setCart={setCart} setVisible={setVisible} buttonWidth={buttonWidth} /> 
            <BaseModal 
              paymentMethod="VEN" 
              userId={userId} 
              cart={cart} 
              setCart={setCart} 
              setVisible={setVisible} 
              buttonWidth={buttonWidth} 
            />
            <BaseModal paymentMethod="CSH" userId={userId} cart={cart} setCart={setCart} setVisible={setVisible} buttonWidth={buttonWidth} />
        </Stack>
        {cart.map((order, index) => <OrderForm 
          key={index}
          index={index} 
          product={order.product} 
          userId={userId} 
          order={order} 
          cart={cart} 
          setCart={setCart} 
          handleClose={()=>{}}
        />)}
      </Stack>
    </Container>
  );
};

  