import React from 'react';
import { useRecoilState } from 'recoil';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Order, Product } from '../../types';
import DatePicker from './DatePicker'
import NumberPicker from './NumberPicker';
import SwitchLabeled from './SwitchLabeled';
import { isDisabledDate } from '../utils/dateConstraints';
import { dateConstraints } from '../config';
import { modalStyle, cartStyle } from '../styles';
import { getValidatedAddress } from '../utils/api';
import { cartState, userState } from '../store';

type Props = {
    index: number | undefined;
    product: Product;
    order: Order | undefined;
    handleClose: () => void;
}
const validationSchema = yup.object({
  number: yup.number().required().positive().integer(),
  delivery_date: yup.date().required(),
  ship_this: yup.boolean().required(),
  this_is_a_gift: yup.boolean().required(),
  recipient_name: yup.string().max(100),
  recipient_address: yup.string().max(100),
  recipient_city: yup.string().max(100),
  recipient_state: yup.string().max(100),
  recipient_message: yup.string().max(150),
  special_instructions: yup.string().max(150),
});

export default function OrderForm({index, product, order, handleClose}: Props) {
  const [cart, setCart] = useRecoilState(cartState);
  const [user, setUser] = useRecoilState(userState);
  const isDisabled = isDisabledDate(dateConstraints);
  const buttonWidth = '120px'
  
  /**
  * @param startDate - Starting date
  * @returns nextDate - The first enabled date in the year 365 days. || returns startDate
  */
  const nextEnabledDate = (startDate: Date): Date => {
    let nextDate = new Date(startDate);
    for (let i=0; i<365; i++) {
        nextDate.setDate(nextDate.getDate() + 1);
        if (!isDisabled(nextDate)) {
            return nextDate
        }
    }
    return startDate;
  }
    
  const defaultOrder = {
    index_key: undefined,
    confirmed: false,
    delivered: false,
    delivery_date: nextEnabledDate(new Date()),
    meister: false,
    number: 1,
    order_date: '',
    product: product,
    recipient_address: '',
    recipient_city: '',
    recipient_message: '',
    recipient_name: '',
    recipient_state: '',
    recipient_zip: '',
    special_instructions: '',
    standing: false,
    ship_this: false,
    this_is_a_gift: false,
    user: user?.id || 0,
  }  
  /**
   * The index is defined in the ShoppingCart, in that case the behavior is to 
   * edit the items in the cart. If index is undefined, the cart object is in 
   * the Products list and the item should be appended to the cart.
   */

  const isCart = typeof index !== 'undefined'

  const formik = useFormik({
    initialValues: order || defaultOrder,
    validationSchema: validationSchema,
    onSubmit: values => {
      //validate address if a gift
      if (values.this_is_a_gift && values.recipient_address && values.recipient_city && values.recipient_state) {
        getValidatedAddress(values.recipient_address, values.recipient_city, values.recipient_state).then(
          response => {
            const validData = response?.data || '';
            const {address, city, state, zip5} = JSON.parse(validData);
            formik.setFieldValue("recipient_zip", zip5);
          }).catch(
            // TODO: Raise error if validation fails 
            reason => console.log(`Address validation rejected: ${reason}`)
        )
      }

      //update order in cart if in ShoppingCart
      if (typeof index !== 'undefined') {
        const newCart = [...cart];
        newCart[index] = values;
        setCart(newCart);
      }

      //append order to cart if in Products
      else {
        setCart([...cart].concat(values))
        handleClose();
      }
    }
  });

  const handleDateChange = (date: Date | null, keyboardInputValue: string | undefined): void => {
    formik.setFieldValue("delivery_date", date || new Date());
    return;
  }
  const handleNumberChange = (number: number) => formik.setFieldValue("number", number);
  const handleCheck = (status: boolean) => formik.setFieldValue("this_is_a_gift", status);
  const handleShipCheck = (status: boolean) => formik.setFieldValue("ship_this", status);

  return (
    <Container maxWidth="sm">
      <Box sx={isCart ? cartStyle : modalStyle}>
        <Typography variant="h4" component="h1" gutterBottom>
          {product.label}
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={1}>
              <NumberPicker number={formik.values.number} maxNumber={5} handleNumberChange={handleNumberChange}/>
              <DatePicker 
                date={formik.values.delivery_date} 
                handleDateChange={handleDateChange} 
                shouldDisableDate={isDisabled}/>
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
                  label='Should this item be shipped?' 
                  isChecked={formik.values.ship_this} 
                  handleCheck={handleShipCheck}
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
                      id="recipient_zip"
                      name="recipient_zip"
                      label="Recipient Zip"
                      value={formik.values.recipient_zip}
                      onChange={formik.handleChange}
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
                <Button color="primary" variant="contained" style={{minWidth: buttonWidth}} type="submit">
                  {isCart ? 'Update' : 'Add to Cart' }
                </Button>
                {typeof index !== 'undefined' ? 
                  <Button color="primary" variant="contained" style={{minWidth: buttonWidth}} onClick={ 
                    () => {
                      const newCart = [...cart];
                      newCart.splice(index, 1);
                      setCart(newCart);
                    }
                  }>Delete</Button> : 
                  <Button color="primary" variant="contained" style={{minWidth: buttonWidth}} onClick={ () => handleClose()}>
                    Cancel
                  </Button>
                }
              </Stack>
            </Stack>
          </form>
        </Typography>
      </Box>
    </Container>
  );
};