import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import type {} from '@mui/x-data-grid/themeAugmentation';
import OrderForm from './OrderForm';
import { Order, Product} from '../../types';

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
        <div>
          <OrderForm 
            index={undefined}
            userId={userId} 
            product={product}
            order={undefined} 
            cart={cart} setCart={setCart} 
            handleClose={handleClose} 
          />
        </div>
      </Modal>
      </>
    );
  };
