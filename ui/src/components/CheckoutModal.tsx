import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import type {} from '@mui/x-data-grid/themeAugmentation';
import CheckoutForm from './CheckoutForm';
import { Order } from '../../types';

type Props = {
    userId: number;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
}

export default function CheckoutModal({userId, setVisible, cart, setCart}: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
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
        />
      </div>
    </Modal>
    </>
  );
};