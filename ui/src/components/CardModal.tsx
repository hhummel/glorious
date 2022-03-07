import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { modalStyle } from '../styles';

import type {} from '@mui/x-data-grid/themeAugmentation';
import StripePaymentForm from './StripePaymentForm';
import { Order } from '../../types';
import { stripeSecret } from '../utils/api';

type Props = {
    userId: number;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
}

export default function CardModal({userId, setVisible, cart, setCart}: Props) {
  const [secret, setSecret] = React.useState<string | undefined>('');
  const [open, setOpen] = React.useState(false);
  const productsTotal = cart.reduce((previous, current) => previous + current.number * current.product.price, 0 )
  console.log(`Submit shopping cart total: ${productsTotal}`);
  const handleOpen = () => {
    setOpen(true);
    const productsTotal = cart.reduce((previous, current) => previous + current.number * current.product.price, 0 )
    console.log(`Submit shopping cart total: ${productsTotal}`);
    stripeSecret(productsTotal * 100, 'CRD', cart).
    then(data => {
        console.log(`Data from stripeSecret ${data.client_secret}`);
        setSecret(data?.client_secret);
    }).catch(e => console.log(`Stripe secret error ${e}`));
  }
  const handleClose = () => setOpen(false);

  return (
    <>
    <Button color="primary" variant="contained" onClick={() => handleOpen()}>Card</Button>

    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div>
        <Container maxWidth="sm">
          <Box sx={modalStyle}>
            <Typography variant="h4" component="h1" gutterBottom>Checkout</Typography>
            <Typography variant="body1" component="h2" gutterBottom>
                <div>Order Total: ${productsTotal}</div>
                <div>Shipping Details</div>
            </Typography>
            <StripePaymentForm secret={secret}/>
          </Box>
        </Container>
      </div>
    </Modal>
    </>
  );
};