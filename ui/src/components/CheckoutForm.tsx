import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import * as yup from 'yup';
import { useFormik } from 'formik';


import { Order } from '../../types';
import { modalStyle } from '../styles';
import { localZip, paymentChoices } from '../config';
import StripePaymentForm from './StripePaymentForm';


const validationSchema = yup.object({});

type Props = {
    userId: number;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
    handleClose: () => void;
    secret: string | undefined;
}

export default function CheckoutForm({userId, cart, setCart, setVisible, handleClose, secret}: Props) {
  const [paymentMethod, setPaymentMethod] = React.useState('CRD');
  const productsTotal = cart.reduce((previous, current) => previous + current.number * current.product.price, 0 )

  const defaultValues = {
    payment_method: 'CRD',
  }

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: values => {
      console.log("Submit checkout to backend");
      //setCart([]);
      //setVisible(1);
    }
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod((event.target as HTMLInputElement).value);
    console.log((event.target as HTMLInputElement).value);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={modalStyle}>
        <Typography variant="h4" component="h1" gutterBottom>
          Checkout
        </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={1}>
            <Typography variant="body1" component="h2" gutterBottom>
                <div>Order Total: ${productsTotal}</div>
                <div>Shipping Details</div>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Payment</FormLabel>
                  <RadioGroup
                    aria-label="payment"
                    defaultValue={formik.values.payment_method}
                    name="radio-buttons-group"
                    onChange={handleChange}
                  >
                    <FormControlLabel value="CRD" control={<Radio />} label="Card" />
                    <FormControlLabel value="VEN" control={<Radio />} label="Venmo" />
                    <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery" />
                    <FormControlLabel value="INV" control={<Radio />} label="Invoice" />
                  </RadioGroup>
                </FormControl>
            </Typography>    
              <Stack direction="row" spacing={5}>
                <Button color="primary" variant="contained" type="submit">Submit</Button>
                <Button color="primary" variant="contained" onClick={ () => handleClose()}>Cancel</Button>
              </Stack>
            </Stack>
          </form>
          {paymentMethod === 'CRD' &&  <StripePaymentForm secret={secret}/> }
      </Box>
    </Container>
  );
};