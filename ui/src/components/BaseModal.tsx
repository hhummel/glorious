import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { modalStyle } from '../styles';
import { Order } from '../../types';
import { stripeSecret } from '../utils/api';
import { Stack } from '@mui/material';
import { parcelCost } from '../config';

type Props = {
    paymentMethod: string;
    userId: number;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
}

export default function BaseModal({paymentMethod, userId, setVisible, cart, setCart}: Props) {
  const [open, setOpen] = React.useState(false);
  const productsTotal = cart.reduce((previous, current) => previous + current.number * current.product.price, 0 );
  const shippingTotal = cart.filter(order => order.ship_this === true).length * parcelCost;
  const handleOpen = () => {
    setOpen(true);
    stripeSecret((productsTotal + shippingTotal) * 100, paymentMethod, cart)
  }
  const handleClose = () => {
      setOpen(false);
      setVisible(1);
      setCart([]);
  }
  const message = paymentMethod === "VEN" ? "Venmo" : "Cash or Check"

  return (
    <>
    <Button color="primary" variant="contained" onClick={() => handleOpen()}>{message}</Button>

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
                <div>Shipping Total: ${shippingTotal}</div>
                <div>Grand Total ${productsTotal + shippingTotal}</div>
            </Typography>
            <Stack spacing={1}>
            <div>Thanks for paying by {message}! If we don't get it before or at delivery, we'll invoice you.</div>
            <Button color="primary" variant="contained" onClick={ () => handleClose()}>Agreed</Button>
            </Stack>
          </Box>
        </Container>
      </div>
    </Modal>
    </>
  );
};