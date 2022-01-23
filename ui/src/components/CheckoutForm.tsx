import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Order } from '../../types';
import NumberPicker from './NumberPicker';
import SwitchLabeled from './SwitchLabeled';
import { modalStyle } from '../styles';
import { localZip } from '../Configuration';
import { number } from 'yup/lib/locale';

const validationSchema = yup.object({

  });

  
type Props = {
    userId: number;
    cart: Array<Order>;
    setCart: React.Dispatch<React.SetStateAction<Order[]>>;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
    handleClose: () => void;
}

export default function CheckoutForm({userId, cart, setCart, setVisible, handleClose}: Props) {

    
  const defaultValues = {
  }

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: values => {
      console.log("Submit checkout to backend");
      setCart([]);
      setVisible(1);
    }
  });

  const productsTotal = cart.reduce((previous, current) => previous + current.number * current.product.price, 0 )

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
                <div>Payment</div>
            </Typography>    
              <Stack direction="row" spacing={5}>
                <Button color="primary" variant="contained" type="submit">Submit</Button>
                <Button color="primary" variant="contained" onClick={ () => handleClose()}>Cancel</Button>
              </Stack>
            </Stack>
          </form>
      </Box>
    </Container>
  );
};