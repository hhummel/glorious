import React, {useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Account from './Account';
import Products from './Products';
import NavBar from './NavBar';
import ShoppingCart from './ShoppingCart';
import Profile from './Profile';
import { User, Order } from '../../types';

type Props = {
    title: string;
  };

export default function MainContainer({ title }: Props) {
  const [user, setUser] = useState<User>();
  const [visible, setVisible] = useState(1);
  const [cart, setCart] = useState<Array<Order>>([])
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='sm'>
        <Typography variant="h3" component="h1" gutterBottom>
          {title}
        </Typography>
        <NavBar user={user} setUser={setUser} setVisible={setVisible} />
        {(visible === 1) && <Products userId={user?.id} cart={cart} setCart={setCart} setVisible={setVisible}/> }
        {(visible === 2) && <Account userId={user?.id}/>}
        {(visible === 3) && <ShoppingCart userId={user?.id} cart={cart} setCart={setCart} setVisible={setVisible}/>}
        {(visible === 4) && <Profile userId={user?.id} setVisible={setVisible}/>}
      </Container>
    </React.Fragment>
  );
}