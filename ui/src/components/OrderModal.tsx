import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import OrderForm from './OrderForm';
import { Product} from '../../types';

type Props = {
    product: Product;
}

export default function OrderModal({product}: Props) {
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
            product={product}
            order={undefined} 
            handleClose={handleClose} 
          />
        </div>
      </Modal>
      </>
    );
  };
