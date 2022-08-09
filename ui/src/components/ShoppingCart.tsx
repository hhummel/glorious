import React from 'react';
import { useRecoilState } from 'recoil';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'

import CardModal from './CardModal';
import BaseModal from './BaseModal';
import OrderForm from './OrderForm';
import { cartState, userState} from '../store';

const buttonWidth = '120px';


type Props = {
    setVisible: React.Dispatch<React.SetStateAction<number>>;
}

export default function ShoppingCart({setVisible}: Props) {
  const [cart, setCart] = useRecoilState(cartState);
  const [user, setUser] = useRecoilState(userState);
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
            <CardModal cart={cart} buttonWidth={buttonWidth} /> 
            <BaseModal 
              paymentMethod="VEN" 
              cart={cart} 
              setCart={setCart} 
              setVisible={setVisible} 
              buttonWidth={buttonWidth} 
            />
            <BaseModal paymentMethod="CSH" cart={cart} setCart={setCart} setVisible={setVisible} buttonWidth={buttonWidth} />
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

  