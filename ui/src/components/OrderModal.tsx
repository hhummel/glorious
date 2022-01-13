import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import type {} from '@mui/x-data-grid/themeAugmentation';
import { createTheme } from '@mui/material/styles';
import OrderForm from './OrderForm';
import { Order, Product} from '../../types';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type Props = {
    userId: number;
    product: Product;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
}

export default function OrderModal({userId, product, setVisible, cart, setCart}: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  
    return (
      <>
      <Button size="small" onClick={() => handleOpen()}> Order</Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <OrderForm 
          userId={userId} 
          product={product} 
          setVisible={setVisible} 
          cart={cart} setCart={setCart} 
          handleClose={handleClose} 
        />
      </Modal>
      </>
    );
  };
