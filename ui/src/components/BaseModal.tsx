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

type Props = {
    paymentMethod: string;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
    buttonWidth: string;
}

export default function BaseModal({paymentMethod, setVisible, cart, setCart, buttonWidth}: Props) {
  const initialTotal = cart.reduce((previous, current) => previous + current.number * current.product.price, 0 ); 
  const [open, setOpen] = React.useState(false);
  const [productTotal, setProductTotal] = React.useState<number | undefined>(initialTotal);

  const hasShipping = cart.filter(order => order.ship_this === true).length > 0 ? true : false;

  const handleOpen = () => {
    setOpen(true);
    stripeSecret(paymentMethod, cart).then(data => {
      setProductTotal(data?.product_cost);
    })
  }
  const handleClose = () => {
      setOpen(false);
      setVisible(1);
      setCart([]);
  }
  const message = paymentMethod === "VEN" ? "Venmo" : "Check"

  return (
    <>
    <Button 
      color="primary" 
      variant="contained"  
      style={{ minWidth: buttonWidth }} 
      disabled={hasShipping} 
      onClick={() => handleOpen()}>{message}
    </Button>

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
            <Stack spacing={1}>
              <Typography variant="body1" component="h2" gutterBottom>
                <div>Order Total: ${productTotal}</div>
              </Typography>
              <div>Thanks for paying by {message}!</div>
              <div>We'll email you an invoice if we don't receive your payment before or at the time of delivery</div>
              <Button color="primary" variant="contained" onClick={ () => handleClose()}>Close</Button>
            </Stack>
          </Box>
        </Container>
      </div>
    </Modal>
    </>
  );
};