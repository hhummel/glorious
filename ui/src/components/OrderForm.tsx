import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { createTheme } from '@mui/material/styles';
import { Order, Product} from '../../types';
import DatePicker from './DatePicker'
import NumberPicker from './NumberPicker';
import SwitchLabeled from './SwitchLabeled';

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

const validationSchema = yup.object({
    number: yup.number().required().positive().integer(),
    delivery_date: yup.date().required(),
    this_is_a_gift: yup.boolean().required(),
    recipient_name: yup.string().max(100),
    recipient_address: yup.string().max(100),
    recipient_city: yup.string().max(100),
    recipient_state: yup.string().max(100),
    recipient_message: yup.string().max(150),
    special_instructions: yup.string().max(150),
  });
  
type Props = {
    userId: number;
    product: Product;
    initialOrder?: Order;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
    handleClose: () => void;
}

export default function OrderForm({userId, product, setVisible, cart, setCart, handleClose}: Props) {
    const formik = useFormik({
      initialValues: {
        index_key: undefined,
        confirmed: false,
        delivered: false,
        delivery_date: new Date(),
        meister: false,
        number: 1,
        order_date: '',
        product: product,
        recipient_address: undefined,
        recipient_city: undefined,
        recipient_message: undefined,
        recipient_name: undefined,
        recipient_state: undefined,
        special_instructions: undefined,
        standing: false,
        this_is_a_gift: false,
        user: userId  
      },
      validationSchema: validationSchema,
      onSubmit: values => {
        const order: Array<Order> = Array(values);
        setCart(cart.concat(order))
        handleClose();
      },
    });

    const handleDateChange = (date: Date)  => formik.setFieldValue("delivery_date", date);
    const handleNumberChange = (number: number) => formik.setFieldValue("number", number);
    const handleCheck = (status: boolean) => formik.setFieldValue("this_is_a_gift", status);
  
    return (
      <Container maxWidth="sm">
        <Box sx={style}>
          <Typography variant="h4" component="h1" gutterBottom>
            Order {product.label}
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={1}>
                <NumberPicker number={formik.values.number} maxNumber={5} handleNumberChange={handleNumberChange}/>
                <DatePicker date={formik.values.delivery_date} handleDateChange={handleDateChange}/>
                <TextField
                fullWidth
                    id="special_instructions"
                    name="special_instructions"
                    label="Special Instructions"
                    value={formik.values.special_instructions}
                    onChange={formik.handleChange}
                    error={formik.touched.special_instructions && Boolean(formik.errors.special_instructions)}
                    helperText={formik.touched.special_instructions && formik.errors.special_instructions}
                />
                <SwitchLabeled 
                    label='Is this a gift?' 
                    isChecked={formik.values.this_is_a_gift} 
                    handleCheck={handleCheck}
                />
                {
                  formik.values.this_is_a_gift &&
                  <>
                    <TextField
                        fullWidth
                        id="recipient_name"
                        name="recipient_name"
                        label="Recipient Name"
                        value={formik.values.recipient_name}
                        onChange={formik.handleChange}
                        error={formik.touched.recipient_name && Boolean(formik.errors.recipient_name)}
                        helperText={formik.touched.recipient_name && formik.errors.recipient_name}
                    />                  
                    <TextField
                        fullWidth
                        id="recipient_address"
                        name="recipient_address"
                        label="Recipient Address"
                        value={formik.values.recipient_address}
                        onChange={formik.handleChange}
                        error={formik.touched.recipient_address && Boolean(formik.errors.recipient_address)}
                        helperText={formik.touched.recipient_address && formik.errors.recipient_address}
                    />
                    <TextField
                        fullWidth
                        id="recipient_city"
                        name="recipient_city"
                        label="Recipient City"
                        value={formik.values.recipient_city}
                        onChange={formik.handleChange}
                        error={formik.touched.recipient_city && Boolean(formik.errors.recipient_city)}
                        helperText={formik.touched.recipient_city && formik.errors.recipient_city}
                    />
                    <TextField
                        fullWidth
                        id="recipient_state"
                        name="recipient_state"
                        label="Recipient State"
                        value={formik.values.recipient_state}
                        onChange={formik.handleChange}
                        error={formik.touched.recipient_state && Boolean(formik.errors.recipient_state)}
                        helperText={formik.touched.recipient_state && formik.errors.recipient_state}
                    />
                    <TextField
                        fullWidth
                        id="recipient_message"
                        name="recipient_message"
                        label="Recipient Message"
                        value={formik.values.recipient_message}
                        onChange={formik.handleChange}
                        error={formik.touched.recipient_message && Boolean(formik.errors.recipient_message)}
                        helperText={formik.touched.recipient_message && formik.errors.recipient_message}
                    />
                   </> 
                }

                <Stack direction="row" spacing={5}>
                  <Button color="primary" variant="contained" type="submit">
                    Add to Cart
                  </Button>
                  <Button color="primary" variant="contained" onClick={ () => handleClose()}>
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Typography>
        </Box>
      </Container>
    );
  };