import React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { modalStyle } from '../styles';
import StripePaymentForm from './StripePaymentForm';
import { Order } from '../../types';
import { stripeSecret } from '../utils/api';

type Props = {
    userId: number;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
    buttonWidth: string;
}

export default function CardModal({userId, setVisible, cart, setCart, buttonWidth}: Props) {
  const initialTotal = cart.reduce((previous, current) => previous + current.number * current.product.price, 0 ); 
  const [secret, setSecret] = React.useState<string | undefined>('');
  const [open, setOpen] = React.useState(false);
  const [productTotal, setProductTotal] = React.useState<number | undefined>(initialTotal);
  const [shippingTotal, setShippingTotal] = React.useState<number | undefined>(undefined);

  const handleOpen = () => {
    setOpen(true);
    stripeSecret('CRD', cart).
    then(data => {
        setSecret(data?.client_secret);
        setProductTotal(data?.product_cost);
        setShippingTotal(data?.shipping_cost);
    }).catch(e => console.log(`Stripe secret error ${e}`));
  }
  const handleClose = () => setOpen(false);

  return (
    <>
    <Button color="primary" variant="contained" style={{ minWidth: buttonWidth }} onClick={() => handleOpen()}>Card</Button>

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
                <div>Order Total: ${productTotal}</div>
                <div>Shipping Total: ${shippingTotal}</div>
                {productTotal && shippingTotal ? 
                  <div>Grand Total: ${productTotal + shippingTotal}</div> : 
                  <div>Grand Total: $: ...</div>
                }
            </Typography>
            <StripePaymentForm secret={secret}/>
          </Box>
        </Container>
      </div>
    </Modal>
    </>
  );
};