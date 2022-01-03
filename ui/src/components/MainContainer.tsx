import React, {useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Login from './Login';
import Logout from './Logout';
import Orders from './Orders';
import Products from './Products';
import NavBar from './NavBar';
import { User } from '../../types';

type Props = {
    title: string;
  };

export default function MainContainer({ title }: Props) {
  const [user, setUser] = useState<User>();
  const [visible, setVisible] = useState(1);
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='sm'>
        <Typography variant="h2" component="h1" gutterBottom>
          {title}
        </Typography>
        <NavBar setVisible={setVisible} setUser={setUser}/>
        {(visible === 1) && <Products userId={user?.id}/> }
        {(visible === 2) && <Orders userId={user?.id}/>}
        {user ? <Logout setUser={setUser} /> : <Login setUser={setUser} /> } 
      </Container>
    </React.Fragment>
  );
}