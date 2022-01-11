import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { createTheme } from '@mui/material/styles';
import { Order, Product} from '../../types';


type Props = {
    userId: number;
    order: Order;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
}

export default function CartForm({userId, order, cart, setCart}: Props) {
    const formik = useFormik({
      initialValues: order,
      onSubmit: values => {
        const order: Array<Order> = Array(values);
        setCart(cart.concat(order))
      },
    });
  
    return (
      <Container maxWidth="sm">
        <Box sx={{ border: '1px solid grey' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Order {order.product.label}
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={1}>
                <TextField
                  fullWidth
                  id="number"
                  name="number"
                  label="Number of items"
                  value={formik.values.number}
                  onChange={formik.handleChange}
                  error={formik.touched.number && Boolean(formik.errors.number)}
                  helperText={formik.touched.number && formik.errors.number}
                />
                <TextField
                  fullWidth
                  id="delivery_date"
                  name="delivery_date"
                  label="Delivery Date"
                  value={formik.values.delivery_date}
                  onChange={formik.handleChange}
                  error={formik.touched.delivery_date && Boolean(formik.errors.delivery_date)}
                  helperText={formik.touched.delivery_date && formik.errors.delivery_date}
                />
                <TextField
                  fullWidth
                  id="this_is_a_gift"
                  name="this_is_a_gift"
                  label="Is this a gift?"
                  value={formik.values.this_is_a_gift}
                  onChange={formik.handleChange}
                  error={formik.touched.this_is_a_gift && Boolean(formik.errors.this_is_a_gift)}
                  helperText={formik.touched.this_is_a_gift && formik.errors.this_is_a_gift}
                />
                {
                  formik.values.this_is_a_gift &&
                  <>
                    <TextField
                    fullWidth
                    id="recipient_name"
                    name="recipeint_name"
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
                   </> 
                }
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
                <Stack direction="row" spacing={5}>
                  <Button color="primary" variant="contained" type="submit">
                    Add to Cart
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Typography>
        </Box>
      </Container>
    );
  };