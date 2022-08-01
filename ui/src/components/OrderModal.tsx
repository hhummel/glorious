import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import OrderForm from './OrderForm';
import { Order, Product} from '../../types';

type Props = {
    userId: number;
    product: Product;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
}

export default function OrderModal({userId, product, setVisible}: Props) {
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
            handleClose={handleClose} 
          />
        </div>
      </Modal>
      </>
    );
  };
