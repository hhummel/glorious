import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import type {} from '@mui/x-data-grid/themeAugmentation';
import CheckoutForm from './CheckoutForm';
import { Order } from '../../types';
import { stripeSecret } from '../utils/api';

type Props = {
    userId: number;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
}

export default function CheckoutModal({userId, setVisible, cart, setCart}: Props) {
  const [secret, setSecret] = React.useState<string | undefined>('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    const productsTotal = cart.reduce((previous, current) => previous + current.number * current.product.price, 0 )
    console.log(`Submit shopping cart total: ${productsTotal}`);
    stripeSecret(productsTotal * 100, cart).
    then(data => {
        console.log(`Data from stripeSecret ${data.client_secret}`);
        setSecret(data?.client_secret);
    }).catch(e => console.log(`Stripe secret error ${e}`));
  }
  const handleClose = () => setOpen(false);

  return (
    <>
    <Button color="primary" variant="contained" onClick={() => handleOpen()}>Checkout</Button>

    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div>
        <CheckoutForm 
          userId={userId} 
          cart={cart} 
          setCart={setCart}
          setVisible={setVisible}
          handleClose={handleClose} 
          secret={secret}
        />
      </div>
    </Modal>
    </>
  );
};